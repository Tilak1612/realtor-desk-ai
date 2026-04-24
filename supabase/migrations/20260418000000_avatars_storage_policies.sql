-- Storage RLS policies for the `avatars` bucket.
--
-- The bucket was `public = true` (so existing avatar URLs render via CDN),
-- but `storage.objects` had RLS enabled with zero policies matching the
-- avatars bucket. Result: every avatar upload was denied with
-- "new row violates row-level security policy".
--
-- Client upload path from DashboardNavbar.tsx / Settings.tsx:
--   supabase.storage.from("avatars").upload("${user.id}/${timestamp}.${ext}", file)
--
-- So `(storage.foldername(name))[1]` is the user's UUID. Authenticated
-- users may only write objects under their own UUID folder.

-- DROP IF EXISTS guards so this migration is replayable against the
-- shared storage plane (Supabase preview branches share storage.* with
-- the parent project — policy rows persist across branch resets).
drop policy if exists "avatars_insert_own" on storage.objects;
drop policy if exists "avatars_update_own" on storage.objects;
drop policy if exists "avatars_delete_own" on storage.objects;
drop policy if exists "avatars_select_public" on storage.objects;

-- Upload: authenticated users can write only into their own folder
create policy "avatars_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Replace: authenticated users can overwrite only their own objects
create policy "avatars_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Delete: authenticated users can delete only their own objects
-- (in case we later clean up old avatar files when a user replaces/removes one)
create policy "avatars_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Read: bucket is `public = true` so GETs via CDN don't need this policy,
-- but adding it for consistency + signed-URL / SDK-based reads.
create policy "avatars_select_public"
  on storage.objects for select
  using (bucket_id = 'avatars');
