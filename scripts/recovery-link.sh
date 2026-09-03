#!/usr/bin/env bash
# Generate a password-recovery (or email-confirmation) link for a user, WITHOUT
# sending email.
#
# Why this exists: Resend currently rejects every send because the sending
# domain is not marked verified, so /forgot-password produces no email and a
# user who forgets their password has no way back into their account. This is
# the manual path until the domain is verified. It keeps working afterwards and
# is the normal way to help someone whose mail is bouncing or filtered.
#
# The link carries a single-use token that logs the user straight in and lands
# them on /reset-password. Treat it like a password:
#   - send it over a channel you trust (the phone number on their account)
#   - it expires; generate a fresh one rather than re-sending an old one
#   - never paste it into a shared channel or a ticket
#
# Usage:
#   SUPABASE_SERVICE_ROLE_KEY=<key> ./scripts/recovery-link.sh user@example.com
#   SUPABASE_SERVICE_ROLE_KEY=<key> ./scripts/recovery-link.sh user@example.com signup
#
# The service role key is in Supabase → Project Settings → API. It bypasses RLS
# entirely, so never commit it or paste it anywhere.
set -euo pipefail

PROJECT_URL="${PROJECT_URL:-https://vxkqwkeqincbxrgglmca.supabase.co}"
APP_URL="${APP_URL:-https://www.realtordesk.ai}"
KEY="${SUPABASE_SERVICE_ROLE_KEY:?set SUPABASE_SERVICE_ROLE_KEY}"
EMAIL="${1:?usage: recovery-link.sh <email> [recovery|signup|magiclink]}"
TYPE="${2:-recovery}"

case "$TYPE" in
  recovery)  REDIRECT="${APP_URL}/reset-password" ;;
  signup)    REDIRECT="${APP_URL}/app" ;;
  magiclink) REDIRECT="${APP_URL}/app" ;;
  *) echo "type must be recovery, signup or magiclink" >&2; exit 1 ;;
esac

RESP=$(curl -sS -X POST "${PROJECT_URL}/auth/v1/admin/generate_link" \
  -H "apikey: ${KEY}" \
  -H "Authorization: Bearer ${KEY}" \
  -H "Content-Type: application/json" \
  -d "$(python3 -c '
import json,sys
print(json.dumps({"type": sys.argv[1], "email": sys.argv[2], "redirect_to": sys.argv[3]}))
' "$TYPE" "$EMAIL" "$REDIRECT")")

python3 - "$RESP" "$EMAIL" "$TYPE" <<'PY'
import json, sys
resp, email, kind = sys.argv[1], sys.argv[2], sys.argv[3]
try:
    d = json.loads(resp)
except json.JSONDecodeError:
    sys.exit("Unexpected response: " + resp[:300])

link = d.get("action_link") or (d.get("properties") or {}).get("action_link")
if not link:
    msg = d.get("msg") or d.get("message") or d.get("error_description") or str(d)[:300]
    sys.exit(f"Could not generate a {kind} link for {email}: {msg}")

print()
print(f"  {kind} link for {email}")
print(f"  {link}")
print()
print("  Single-use and time-limited. Send it over a channel you trust and do")
print("  not paste it into a shared channel or a ticket.")
print()
PY
