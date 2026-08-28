#!/usr/bin/env bash
# Regenerate supabase/migrations/00000000000000_baseline_production_schema.sql
# from the live production database.
#
# Why this exists: the repo's migration history diverged badly from production
# (51 files creating 64 tables, against production's 41). `supabase db reset`
# produced a database that did not match prod, and replaying the old set would
# have introduced RLS holes that production does not have. Rather than hand-fix
# 51 files, the history is archived and replaced with one generated baseline.
#
# Usage:
#   SUPABASE_ACCESS_TOKEN=<token> ./scripts/generate-schema-baseline.sh
#
# Requires: curl, python3. Read-only against production.
set -euo pipefail

PROJECT_REF="${PROJECT_REF:-vxkqwkeqincbxrgglmca}"
TOKEN="${SUPABASE_ACCESS_TOKEN:?set SUPABASE_ACCESS_TOKEN}"
OUT="supabase/migrations/00000000000000_baseline_production_schema.sql"
API="https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query"

q() {
  python3 -c 'import json,sys;print(json.dumps({"query":sys.stdin.read()}))' \
    | curl -sS -X POST "$API" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        --data-binary @- \
    | python3 -c '
import json,sys
rows=json.load(sys.stdin)
if isinstance(rows,dict) and rows.get("message"):
    sys.exit("API error: "+str(rows)[:300])
print((rows[0] or {}).get("ddl") or "" if rows else "")
'
}

ENUMS=$(q <<'SQL'
select string_agg(stmt, E'\n') as ddl from (
  select 'CREATE TYPE public.' || quote_ident(t.typname) || ' AS ENUM (' ||
         string_agg(quote_literal(e.enumlabel), ', ' order by e.enumsortorder) || ');' as stmt
  from pg_type t
  join pg_enum e on e.enumtypid = t.oid
  join pg_namespace n on n.oid = t.typnamespace
  where n.nspname = 'public'
  group by t.typname order by t.typname
) s;
SQL
)

TABLES=$(q <<'SQL'
select string_agg(tbl, E'\n\n' order by tablename) as ddl from (
  select c.relname as tablename,
    'CREATE TABLE IF NOT EXISTS public.' || quote_ident(c.relname) || E' (\n' ||
    string_agg('  ' || quote_ident(a.attname) || ' ' || format_type(a.atttypid, a.atttypmod) ||
      coalesce(' DEFAULT ' || pg_get_expr(d.adbin, d.adrelid), '') ||
      case when a.attnotnull then ' NOT NULL' else '' end, E',\n' order by a.attnum) || E'\n);' as tbl
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  join pg_attribute a on a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
  left join pg_attrdef d on d.adrelid = c.oid and d.adnum = a.attnum
  where n.nspname = 'public' and c.relkind = 'r'
  group by c.relname
) s;
SQL
)

CONSTRAINTS=$(q <<'SQL'
select string_agg(
  'DO $c$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = ' ||
  quote_literal(con.conname) || ' AND conrelid = ' ||
  quote_literal('public.' || rel.relname) || '::regclass) THEN ' ||
  'ALTER TABLE public.' || quote_ident(rel.relname) ||
  ' ADD CONSTRAINT ' || quote_ident(con.conname) || ' ' ||
  pg_get_constraintdef(con.oid) || '; END IF; END $c$;', E'\n'
  order by rel.relname, con.contype desc, con.conname) as ddl
from pg_constraint con
join pg_class rel on rel.oid = con.conrelid
join pg_namespace n on n.oid = rel.relnamespace
where n.nspname='public' and con.contype in ('p','f','u','c');
SQL
)

INDEXES=$(q <<'SQL'
select string_agg(indexdef || ';', E'\n' order by indexname) as ddl
from pg_indexes i
where schemaname='public'
  and not exists (select 1 from pg_constraint c
                  where c.conname = i.indexname and c.connamespace='public'::regnamespace);
SQL
)

FUNCTIONS=$(q <<'SQL'
select string_agg(pg_get_functiondef(p.oid) || ';', E'\n\n' order by p.proname) as ddl
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.prokind='f';
SQL
)

RLS=$(q <<'SQL'
select string_agg('ALTER TABLE public.' || quote_ident(c.relname) ||
       ' ENABLE ROW LEVEL SECURITY;', E'\n' order by c.relname) as ddl
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind='r' and c.relrowsecurity;
SQL
)

# quote_ident on policyname, not quote_literal: CREATE POLICY takes an
# identifier. Getting this wrong produces 'name' and fails to parse.
POLICIES=$(q <<'SQL'
select string_agg(
  'DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON public.' || quote_ident(tablename) || E';\n' ||
  'CREATE POLICY ' || quote_ident(policyname) || ' ON public.' || quote_ident(tablename) ||
  ' AS ' || permissive || ' FOR ' || cmd || ' TO ' || array_to_string(roles, ', ') ||
  coalesce(' USING (' || qual || ')','') ||
  coalesce(' WITH CHECK (' || with_check || ')','') || ';',
  E'\n' order by tablename, policyname) as ddl
from pg_policies where schemaname='public';
SQL
)

TRIGGERS=$(q <<'SQL'
select string_agg(
  'DROP TRIGGER IF EXISTS ' || quote_ident(t.tgname) || ' ON ' ||
  quote_ident(n.nspname) || '.' || quote_ident(c.relname) || E';\n' ||
  pg_get_triggerdef(t.oid) || ';', E'\n'
  order by c.relname, t.tgname) as ddl
from pg_trigger t join pg_class c on c.oid=t.tgrelid
join pg_namespace n on n.oid=c.relnamespace
where n.nspname in ('public','auth') and not t.tgisinternal;
SQL
)

mkdir -p "$(dirname "$OUT")"
{
  cat <<'HEADER'
-- ─────────────────────────────────────────────────────────────────────────────
-- BASELINE: production schema, generated from the live database.
--
-- Regenerate with: SUPABASE_ACCESS_TOKEN=... ./scripts/generate-schema-baseline.sh
--
-- This replaces 51 hand-maintained migration files that had drifted badly from
-- production. They created 64 tables against production's 41, two of them could
-- not replay on a clean database at all, and replaying the set would have
-- introduced RLS holes production does not have (an email_log INSERT policy and
-- a scheduled_emails ALL policy, both named for the service role but with no TO
-- clause, so both applied to PUBLIC). The old files are kept for history under
-- supabase/migrations/_archive/ and are not applied.
--
-- Everything below is generated, so it cannot drift by hand again.
-- ─────────────────────────────────────────────────────────────────────────────

HEADER
  echo "-- ── Types ──────────────────────────────────────────────────────────────"
  echo "DO \$\$ BEGIN"
  echo "$ENUMS" | sed 's/^CREATE TYPE/  CREATE TYPE/' | sed 's/;$/;/'
  echo "EXCEPTION WHEN duplicate_object THEN NULL; END \$\$;"
  echo
  echo "-- ── Tables ─────────────────────────────────────────────────────────────"
  echo "$TABLES"
  echo
  echo "-- ── Constraints ────────────────────────────────────────────────────────"
  echo "$CONSTRAINTS"
  echo
  echo "-- ── Indexes ────────────────────────────────────────────────────────────"
  echo "$INDEXES" | sed 's/^CREATE INDEX /CREATE INDEX IF NOT EXISTS /; s/^CREATE UNIQUE INDEX /CREATE UNIQUE INDEX IF NOT EXISTS /'
  echo
  echo "-- ── Functions ──────────────────────────────────────────────────────────"
  echo "$FUNCTIONS"
  echo
  echo "-- ── Row Level Security ─────────────────────────────────────────────────"
  echo "$RLS"
  echo
  echo "-- ── Policies ───────────────────────────────────────────────────────────"
  echo "$POLICIES"
  echo
  echo "-- ── Triggers ───────────────────────────────────────────────────────────"
  echo "$TRIGGERS"
} > "$OUT"

echo "wrote $OUT ($(wc -l < "$OUT") lines)"
