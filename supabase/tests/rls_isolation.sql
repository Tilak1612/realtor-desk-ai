-- Authorization regression test: can one account reach another's data?
--
-- Runs entirely inside a transaction and ROLLS BACK, so it is safe against
-- production. Creates four throwaway users, seeds one row per table for two of
-- them, then has every principal attempt SELECT / INSERT / UPDATE / DELETE
-- across the boundary. Every attempt is recorded with its expected outcome.
--
-- WHAT "BROKERAGE" MEANS HERE. The schema has no brokerage, team, tenant or
-- organization column anywhere, and no policy references one: isolation is per
-- USER. So "Brokerage A member" is simply a second user account, and the
-- expected result is that they see nothing of the owner's data either. That is
-- what the database does today, and these tests pin it. If team sharing is
-- ever added, the expectations for the A_member rows are what change.
--
-- Run:  supabase db execute --file supabase/tests/rls_isolation.sql
--   or paste into the SQL editor. Nothing is committed either way.

BEGIN;

CREATE TEMP TABLE rls_results(
  principal text, tbl text, op text, expected text, actual text, pass boolean
) ON COMMIT DROP;
GRANT ALL ON rls_results TO authenticated, anon;

DO $outer$
DECLARE
  a_owner  uuid := '00000000-0000-4000-a000-00000000000a';
  a_member uuid := '00000000-0000-4000-a000-00000000000b';
  b_owner  uuid := '00000000-0000-4000-b000-00000000000a';
  b_member uuid := '00000000-0000-4000-b000-00000000000b';
  principal record;
  t record;
  n int;
  victim_row uuid;
  own_row uuid;
  a_contact uuid;
  b_contact uuid;
BEGIN
  -- Four throwaway identities. Rolled back with everything else.
  INSERT INTO auth.users (id, instance_id, aud, role, email, created_at, updated_at)
  SELECT u, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'rlstest+' || u || '@example.invalid', now(), now()
  FROM unnest(ARRAY[a_owner, a_member, b_owner, b_member]) AS u;

  -- Seed: one contact each for the two owners, then dependent rows.
  INSERT INTO public.contacts(user_id, first_name, last_name, email)
    VALUES (a_owner, 'Ada', 'Owner', 'a-owner@example.invalid') RETURNING id INTO a_contact;
  INSERT INTO public.contacts(user_id, first_name, last_name, email)
    VALUES (b_owner, 'Bo', 'Owner', 'b-owner@example.invalid') RETURNING id INTO b_contact;

  INSERT INTO public.deals(user_id, title) VALUES (a_owner,'A deal'), (b_owner,'B deal');
  INSERT INTO public.tasks(user_id, title) VALUES (a_owner,'A task'), (b_owner,'B task');
  INSERT INTO public.property_listings(user_id, title, address)
    VALUES (a_owner,'A listing','1 A St'), (b_owner,'B listing','1 B St');
  INSERT INTO public.contact_notes(user_id, contact_id, content)
    VALUES (a_owner, a_contact, 'A note'), (b_owner, b_contact, 'B note');
  INSERT INTO public.contact_documents(user_id, contact_id, file_name, file_path, file_size, file_type)
    VALUES (a_owner, a_contact, 'a.pdf', 'a/a.pdf', 1, 'application/pdf'),
           (b_owner, b_contact, 'b.pdf', 'b/b.pdf', 1, 'application/pdf');
  INSERT INTO public.contact_activities(user_id, contact_id, activity_type, title)
    VALUES (a_owner, a_contact, (SELECT enumlabel FROM pg_enum e JOIN pg_type ty ON ty.oid=e.enumtypid
              WHERE ty.typname='activity_type' ORDER BY e.enumsortorder LIMIT 1)::activity_type, 'A act'),
           (b_owner, b_contact, (SELECT enumlabel FROM pg_enum e JOIN pg_type ty ON ty.oid=e.enumtypid
              WHERE ty.typname='activity_type' ORDER BY e.enumsortorder LIMIT 1)::activity_type, 'B act');
  INSERT INTO public.conversation_messages(user_id, lead_id, author, body)
    VALUES (a_owner, a_contact, 'agent', 'A msg'), (b_owner, b_contact, 'agent', 'B msg');
  INSERT INTO public.integration_connections(user_id, tool_slug, credentials_encrypted)
    VALUES (a_owner, 'gmail', 'A-SECRET'), (b_owner, 'gmail', 'B-SECRET');

  -- Every principal tries to reach BROKERAGE B's data.
  FOR principal IN
    SELECT * FROM (VALUES
      ('A_owner',  a_owner,  'authenticated'),
      ('A_member', a_member, 'authenticated'),
      ('B_member', b_member, 'authenticated'),
      ('anon',     NULL::uuid, 'anon')
    ) AS v(name, uid, dbrole)
  LOOP
    FOR t IN
      SELECT * FROM (VALUES
        ('contacts'),('deals'),('tasks'),('property_listings'),
        ('contact_notes'),('contact_documents'),('contact_activities'),
        ('conversation_messages'),('integration_connections')
      ) AS x(tbl)
    LOOP
      -- Impersonate
      PERFORM set_config('role', principal.dbrole, true);
      IF principal.uid IS NULL THEN
        PERFORM set_config('request.jwt.claims', json_build_object('role','anon')::text, true);
      ELSE
        PERFORM set_config('request.jwt.claims',
          json_build_object('sub', principal.uid, 'role','authenticated')::text, true);
      END IF;

      -- READ another tenant's rows
      BEGIN
        EXECUTE format('SELECT count(*) FROM public.%I WHERE user_id = %L', t.tbl, b_owner) INTO n;
        INSERT INTO rls_results VALUES (principal.name, t.tbl, 'SELECT other', '0 rows', n || ' rows', n = 0);
      EXCEPTION WHEN others THEN
        INSERT INTO rls_results VALUES (principal.name, t.tbl, 'SELECT other', '0 rows', 'error: '||SQLERRM, true);
      END;

      -- WRITE a row owned by another tenant
      BEGIN
        EXECUTE format(
          'INSERT INTO public.%I (user_id%s) VALUES (%L%s)',
          t.tbl,
          CASE t.tbl
            WHEN 'deals' THEN ', title' WHEN 'tasks' THEN ', title'
            WHEN 'property_listings' THEN ', title, address'
            WHEN 'contact_notes' THEN ', contact_id, content'
            WHEN 'contact_documents' THEN ', contact_id, file_name, file_path, file_size, file_type'
            WHEN 'contact_activities' THEN ', contact_id, activity_type, title'
            WHEN 'conversation_messages' THEN ', lead_id, author, body'
            WHEN 'integration_connections' THEN ', tool_slug'
            ELSE ', first_name' END,
          b_owner,
          CASE t.tbl
            WHEN 'deals' THEN ', ''x''' WHEN 'tasks' THEN ', ''x'''
            WHEN 'property_listings' THEN ', ''x'', ''y'''
            WHEN 'contact_notes' THEN format(', %L, ''x''', b_contact)
            WHEN 'contact_documents' THEN format(', %L, ''x'', ''x'', 1, ''x''', b_contact)
            WHEN 'contact_activities' THEN format(', %L, (SELECT enumlabel FROM pg_enum e JOIN pg_type ty ON ty.oid=e.enumtypid WHERE ty.typname=''activity_type'' ORDER BY e.enumsortorder LIMIT 1)::activity_type, ''x''', b_contact)
            WHEN 'conversation_messages' THEN format(', %L, ''agent'', ''x''', b_contact)
            WHEN 'integration_connections' THEN ', ''x'''
            ELSE ', ''x''' END);
        INSERT INTO rls_results VALUES (principal.name, t.tbl, 'INSERT as other', 'refused', 'ALLOWED', false);
      EXCEPTION WHEN others THEN
        INSERT INTO rls_results VALUES (principal.name, t.tbl, 'INSERT as other', 'refused', 'refused', true);
      END;

      -- EDIT another tenant's row
      BEGIN
        EXECUTE format('UPDATE public.%I SET user_id = user_id WHERE user_id = %L', t.tbl, b_owner);
        GET DIAGNOSTICS n = ROW_COUNT;
        INSERT INTO rls_results VALUES (principal.name, t.tbl, 'UPDATE other', '0 rows', n || ' rows', n = 0);
      EXCEPTION WHEN others THEN
        INSERT INTO rls_results VALUES (principal.name, t.tbl, 'UPDATE other', '0 rows', 'error: '||SQLERRM, true);
      END;

      -- DELETE another tenant's row
      BEGIN
        EXECUTE format('DELETE FROM public.%I WHERE user_id = %L', t.tbl, b_owner);
        GET DIAGNOSTICS n = ROW_COUNT;
        INSERT INTO rls_results VALUES (principal.name, t.tbl, 'DELETE other', '0 rows', n || ' rows', n = 0);
      EXCEPTION WHEN others THEN
        INSERT INTO rls_results VALUES (principal.name, t.tbl, 'DELETE other', '0 rows', 'error: '||SQLERRM, true);
      END;

      PERFORM set_config('role', 'postgres', true);
    END LOOP;
  END LOOP;

  -- The owner must still be able to work normally, or "isolation" just means
  -- "broken". Tested last so a failure here is unambiguous.
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', b_owner, 'role','authenticated')::text, true);

  SELECT count(*) INTO n FROM public.contacts WHERE user_id = b_owner;
  INSERT INTO rls_results VALUES ('B_owner','contacts','SELECT own','>=1 row', n||' rows', n >= 1);

  BEGIN
    UPDATE public.contacts SET first_name = 'Renamed' WHERE user_id = b_owner;
    GET DIAGNOSTICS n = ROW_COUNT;
    INSERT INTO rls_results VALUES ('B_owner','contacts','UPDATE own','>=1 row', n||' rows', n >= 1);
  EXCEPTION WHEN others THEN
    INSERT INTO rls_results VALUES ('B_owner','contacts','UPDATE own','>=1 row','error: '||SQLERRM, false);
  END;

  -- Giving your own row away is the WITH CHECK case.
  BEGIN
    UPDATE public.contacts SET user_id = a_owner WHERE user_id = b_owner;
    INSERT INTO rls_results VALUES ('B_owner','contacts','UPDATE own -> other owner','refused','ALLOWED', false);
  EXCEPTION WHEN others THEN
    INSERT INTO rls_results VALUES ('B_owner','contacts','UPDATE own -> other owner','refused','refused', true);
  END;

  PERFORM set_config('role', 'postgres', true);
END
$outer$;

-- ── Storage ────────────────────────────────────────────────────────────────
-- contact-documents had no policies at all, so this section would have failed
-- every check (including the owner's own upload) before 2026-09-20.
DO $storage$
DECLARE a uuid := '00000000-0000-4000-a000-00000000000a';
        b uuid := '00000000-0000-4000-b000-00000000000a'; n int;
BEGIN
  INSERT INTO storage.objects(bucket_id,name,owner) VALUES ('contact-documents', b||'/c1/existing.pdf', b);
  PERFORM set_config('role','authenticated',true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub',a,'role','authenticated')::text, true);

  BEGIN
    INSERT INTO storage.objects(bucket_id,name,owner) VALUES ('contact-documents', a||'/c1/own.pdf', a);
    INSERT INTO rls_results VALUES ('A_owner','storage:contact-documents','upload own','allowed','allowed',true);
  EXCEPTION WHEN others THEN
    INSERT INTO rls_results VALUES ('A_owner','storage:contact-documents','upload own','allowed','DENIED: '||SQLERRM,false);
  END;
  BEGIN
    SELECT count(*) INTO n FROM storage.objects WHERE bucket_id='contact-documents' AND name LIKE a||'%';
    INSERT INTO rls_results VALUES ('A_owner','storage:contact-documents','read own','>=1',n||' rows',n>=1);
  EXCEPTION WHEN others THEN
    INSERT INTO rls_results VALUES ('A_owner','storage:contact-documents','read own','>=1','error: '||SQLERRM,false);
  END;
  BEGIN
    SELECT count(*) INTO n FROM storage.objects WHERE bucket_id='contact-documents' AND name LIKE b||'%';
    INSERT INTO rls_results VALUES ('A_owner','storage:contact-documents','read other','0 rows',n||' rows',n=0);
  EXCEPTION WHEN others THEN
    INSERT INTO rls_results VALUES ('A_owner','storage:contact-documents','read other','0 rows','error: '||SQLERRM,false);
  END;
  BEGIN
    INSERT INTO storage.objects(bucket_id,name,owner) VALUES ('contact-documents', b||'/c1/planted.pdf', a);
    INSERT INTO rls_results VALUES ('A_owner','storage:contact-documents','upload into other folder','refused','ALLOWED',false);
  EXCEPTION WHEN others THEN
    INSERT INTO rls_results VALUES ('A_owner','storage:contact-documents','upload into other folder','refused','refused',true);
  END;

  PERFORM set_config('role','anon',true);
  PERFORM set_config('request.jwt.claims', json_build_object('role','anon')::text, true);
  BEGIN
    SELECT count(*) INTO n FROM storage.objects WHERE bucket_id='contact-documents';
    INSERT INTO rls_results VALUES ('anon','storage:contact-documents','read any','0 rows',n||' rows',n=0);
  EXCEPTION WHEN others THEN
    INSERT INTO rls_results VALUES ('anon','storage:contact-documents','read any','0 rows','error: '||SQLERRM,true);
  END;
  PERFORM set_config('role','postgres',true);
END
$storage$;

-- ── Roles ──────────────────────────────────────────────────────────────────
-- A non-admin must not read the role table or grant themselves admin. Both
-- policies call has_role(); before the EXECUTE grant these ERRORED rather than
-- denying, which is a different and much noisier failure.
DO $roles$
DECLARE a uuid := '00000000-0000-4000-a000-00000000000a';
        b uuid := '00000000-0000-4000-b000-00000000000a'; n int;
BEGIN
  INSERT INTO public.user_roles(user_id, role) VALUES (b,'admin');
  PERFORM set_config('role','authenticated',true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub',a,'role','authenticated')::text, true);
  BEGIN
    SELECT count(*) INTO n FROM public.user_roles;
    INSERT INTO rls_results VALUES ('A_owner','user_roles','SELECT all','0 rows',n||' rows',n=0);
  EXCEPTION WHEN others THEN
    INSERT INTO rls_results VALUES ('A_owner','user_roles','SELECT all','0 rows','error: '||SQLERRM,false);
  END;
  BEGIN
    INSERT INTO public.user_roles(user_id, role) VALUES (a,'admin');
    INSERT INTO rls_results VALUES ('A_owner','user_roles','grant self admin','refused','ALLOWED -- ESCALATION',false);
  EXCEPTION WHEN others THEN
    INSERT INTO rls_results VALUES ('A_owner','user_roles','grant self admin','refused','refused',true);
  END;
  PERFORM set_config('role','postgres',true);
END
$roles$;

\echo '--- failures (empty means every boundary held) ---'
SELECT * FROM rls_results WHERE NOT pass ORDER BY principal, tbl, op;

\echo '--- summary ---'
SELECT principal, count(*) AS checks, count(*) FILTER (WHERE pass) AS passed,
       count(*) FILTER (WHERE NOT pass) AS failed
FROM rls_results GROUP BY principal ORDER BY principal;

ROLLBACK;
