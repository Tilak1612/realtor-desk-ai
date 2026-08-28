#!/usr/bin/env bash
# Switch how Supabase Auth sends verification and password-reset mail.
#
# Context. Auth SMTP points at Resend, and Resend currently refuses every send
# because the API key is scoped to a domain that is not verified. Confirmed on
# the exact path Auth uses:
#
#   SMTP AUTH: ok
#   SEND REJECTED: The associated domain with your API key is not verified.
#
# So `mailer_autoconfirm` is ON: signup works but nobody is emailed, and
# /forgot-password produces nothing. Turning autoconfirm off while sends fail
# would strand every new user at an unconfirmed account, which is worse.
#
# This script flips between the two workable states. Both are reversible in
# seconds, so the decision is cheap either way.
#
#   status    show what is configured now
#   supabase  drop the custom SMTP so Supabase's own mailer sends, and require
#             email confirmation. Self-service reset and verification start
#             working immediately, WITHOUT any domain verification. Cost: mail
#             comes from a supabase.io address rather than realtordesk.ai, with
#             weaker deliverability, and Supabase documents this sender as
#             development-grade. Reasonable as a stopgap at low volume.
#   resend    restore Resend SMTP. Use this once the domain is verified (or a
#             full-access key is installed). Requires SMTP_USER and SMTP_PASS.
#
# Usage:
#   SUPABASE_ACCESS_TOKEN=<token> ./scripts/auth-email-mode.sh status
#   SUPABASE_ACCESS_TOKEN=<token> ./scripts/auth-email-mode.sh supabase
#   SUPABASE_ACCESS_TOKEN=<token> SMTP_USER=resend SMTP_PASS=<key> \
#     ./scripts/auth-email-mode.sh resend
#
# After switching, verify for real rather than trusting the config:
#   ./scripts/recovery-link.sh someone@yourdomain.test   # link path still works
#   then trigger /forgot-password and confirm the mail arrives.
set -euo pipefail

PROJECT_REF="${PROJECT_REF:-vxkqwkeqincbxrgglmca}"
TOKEN="${SUPABASE_ACCESS_TOKEN:?set SUPABASE_ACCESS_TOKEN}"
API="https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth"
MODE="${1:-status}"

show() {
  curl -sS "$API" -H "Authorization: Bearer $TOKEN" | python3 -c '
import json,sys
d=json.load(sys.stdin)
host=d.get("smtp_host") or None
print()
print("  mailer_autoconfirm :", d.get("mailer_autoconfirm"),
      "(True = signup skips email confirmation)")
print("  smtp_host          :", host or "(none — Supabase built-in sender)")
print("  sender name        :", d.get("smtp_sender_name"))
print("  email rate limit   :", d.get("rate_limit_email_sent"), "per hour")
print()
if d.get("mailer_autoconfirm"):
    print("  => No verification or password-reset mail is being sent.")
else:
    print("  => Email confirmation is required; sends must be working.")
print()
'
}

patch() {
  curl -sS -X PATCH "$API" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$1" >/dev/null
}

case "$MODE" in
  status)
    show
    ;;
  supabase)
    # Clearing smtp_host makes Auth fall back to Supabase's own sender.
    # autoconfirm goes OFF in the same call: it is only safe to require
    # confirmation once a working sender is in place.
    patch '{"smtp_host":"","smtp_port":"","smtp_user":"","smtp_pass":"","mailer_autoconfirm":false}'
    echo "Switched to Supabase's built-in sender; email confirmation now required."
    show
    echo "  Send a real password reset and confirm it arrives before relying on this."
    ;;
  resend)
    : "${SMTP_USER:?set SMTP_USER (Resend uses the literal user 'resend')}"
    : "${SMTP_PASS:?set SMTP_PASS to the Resend API key}"
    patch "$(python3 -c '
import json,os
print(json.dumps({
  "smtp_host": "smtp.resend.com",
  "smtp_port": "465",
  "smtp_user": os.environ["SMTP_USER"],
  "smtp_pass": os.environ["SMTP_PASS"],
  "mailer_autoconfirm": False,
}))')"
    echo "Restored Resend SMTP; email confirmation required."
    show
    echo "  Confirm a real send succeeds. If Resend still refuses, run:"
    echo "    ./scripts/auth-email-mode.sh supabase"
    echo "  to avoid stranding new signups at an unconfirmed account."
    ;;
  *)
    echo "usage: auth-email-mode.sh [status|supabase|resend]" >&2
    exit 1
    ;;
esac
