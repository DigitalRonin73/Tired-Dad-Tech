# Programming list

Standalone app at `/programlist`. No homepage or public navigation link. Page metadata and response headers request no indexing; access to data and changes requires a login.

## Architecture

- Next.js static export renders the responsive React interface.
- Cloudflare Pages Functions serves `/api/programlist/*`.
- Cloudflare D1 binding `PROGRAMLIST_DB` stores users, buildings, sessions and submissions.
- Each request has its own immutable submitter/time and separate completion actor/time. A partial unique database index allows only one pending request per building/door, including concurrent submissions.
- Room identifiers are text matching exactly three ASCII digits, preserving leading zeros. Other-door descriptions normalize whitespace/case for duplicate checks and history.
- Bulk completion acts on the IDs shown when confirmation opens; newly submitted work is not accidentally completed.
- History pages contain 50 records. Its all-time counts follow building/door, independently of date/person/status filters. Date range boundaries come from the browser's local timezone; the through-date is inclusive.
- Passwords use salted PBKDF2-SHA256. Sessions use random tokens stored only as hashes, HttpOnly cookies, SameSite=Strict and Secure on HTTPS. All POST requests require same-origin JSON. Login failures are rate limited in D1.

## Local development

```sh
pnpm install --frozen-lockfile
pnpm programlist:migrate
pnpm programlist:seed
pnpm exec wrangler d1 execute programlist-local --local --config wrangler.local.jsonc --file .programlist-local/initial-users.sql
pnpm build
pnpm programlist:dev
```

Open `http://127.0.0.1:8788/programlist`. The seed script prompts for passwords without echoing them. Its private SQL file is ignored by Git, has owner-only permissions and does not overwrite existing accounts. Initial users are Scott (admin), John, Erin, Kathi, Ray, Dustin, Logan, Jamal, Derrick, Prince, Matt, Brandon and Elijah. The two programmer labels can be assigned in Manage once identified; every active user can submit and complete doors.

The preview database is local and contains disposable testing activity. Never upload `.wrangler/` or `.programlist-local/` to the site or GitHub. Production must start with migrations and the private account seed only, not a copy of local request history.

`pnpm dev` can inspect the existing static site, but it does not serve Pages Functions. Use `pnpm programlist:dev` for the complete app. Rebuild with `pnpm build` and refresh the browser after frontend edits. Local config is explicitly named `wrangler.local.jsonc` so it cannot silently replace production Pages settings.

## Validation

```sh
pnpm lint
pnpm build
pnpm programlist:test
git diff --check
```

The API checks compile the Pages Functions and run them in the real Workers runtime with an isolated D1 database and generated test credentials. They cover login, authorization, room validation, concurrent duplicate rejection, attribution, repeat requests, counts and filtering, bulk completion races/SQL limits, history pagination, user management, session invalidation and login throttling.

## First production deployment

This app requires Cloudflare Pages Functions plus D1; GitHub Pages alone cannot execute its API. Preserve the existing GitHub → Cloudflare Pages site deployment.

After approval to change the site's Cloudflare setup:

1. Sign in to Wrangler or use the authenticated Cloudflare dashboard, and verify the existing Pages project and account.
2. Create the dedicated D1 database `tireddadtech-programlist`.
3. Apply `migrations/0001_programlist.sql` to that database. Import the private account seed directly into D1; never commit or put that file in `public/` or `out/`.
4. Add a **production** Pages D1 binding named `PROGRAMLIST_DB` pointing to that database. Use a separate empty D1 database for preview deployments if previews are needed; never attach the production database to preview branches.
5. Publish the reviewed source through the existing GitHub deployment. Keep the current static export build and output directory (`pnpm build`, `out`). No DNS change is required.
6. Verify deployment success and live HTTPS login, submission, duplicate warning, completion, history and logout on `/programlist`. Verify the homepage and CertForge policy are unaffected. Production verification records should be clearly identified and not mistaken for actual door work.

Cloudflare reference: [Pages D1 bindings](https://developers.cloudflare.com/pages/functions/bindings/#d1-databases).

Production database configuration is recorded in `wrangler.programlist.jsonc`. The dedicated database is `tireddadtech-programlist`; the existing `tired-dad-tech` Pages project uses it through the production-only `PROGRAMLIST_DB` binding. Preview bindings remain separate. For subsequent reviewed migrations, run:

```sh
pnpm exec wrangler d1 migrations apply tireddadtech-programlist --remote --config wrangler.programlist.jsonc
```

## Operation

Manage lets Scott add buildings/users, assign programmer labels, deactivate/reactivate accounts and reset passwords. Deactivated users remain in history. Password resets invalidate sessions. There is no public account registration, password recovery email, deletion or editing of historical submissions in this first version.

Refreshing the list or switching views does not reset the building. Browser storage remembers the most recently selected building across page loads. The list refreshes when the window regains focus and every 45 seconds while visible. Submissions and completions refresh immediately without page navigation.


## Programmer overview and repeat warnings

- All buildings shows only buildings with pending doors and opens their checklist in a modal. Complete building confirms an exact snapshot of the displayed IDs; individual completions leave the modal open.
- Header totals show pending doors across every building and completions in the browser's current local calendar day (inclusive midnight, exclusive next midnight). Counts refresh after writes, on window focus, and every 45 seconds while visible, including date rollover.
- New submissions check the latest completion for that same building, door type and normalized door name within the preceding 168 hours. The server returns the completion details before inserting. Submit anyway acknowledges that specific completion ID; a newer completion requires a fresh warning. Pending duplicates still take precedence and cannot be overridden.
- History no longer exposes a door-type filter. Existing records and history remain unchanged.
