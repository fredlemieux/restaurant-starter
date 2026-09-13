# Deployment

Two paths depending on what you need:

- **[Quick demo deploy](#quick-demo-deploy-dashboard-no-terraform)** (~5 min) — a `<slug>.pages.dev` URL for sharing. No custom domain, no Terraform, no API token. Just Git push + Cloudflare dashboard.
- **[Full setup](#one-time-setup)** (~30 min) — custom domain, DNS, provisioned via Terraform, GitHub Actions CI/CD, Sanity webhooks. What you want for a real client site.

---

## Quick demo deploy (dashboard, no Terraform)

Use when you want a live URL fast — for a portfolio piece, a client demo, or just to see the built site online.

1. Push the repo to GitHub if you haven't already.
2. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** tab → **Connect to Git**.
3. Authorize Cloudflare on GitHub, pick your repo, click **Begin setup**.
4. **Framework preset**: `Astro`. Override the defaults with:
   - **Build command**: `pnpm --filter @restaurant/web build`
   - **Build output directory**: `apps/web/dist`
   - **Root directory**: leave blank (repo root — the build script handles the monorepo path)
5. **Environment variables** (Production) — add at minimum:

   | Key | Value |
   |---|---|
   | `SANITY_PROJECT_ID` | your project id from sanity.io/manage |
   | `SANITY_DATASET` | `production` |
   | `SANITY_API_VERSION` | `2026-01-01` |
   | `SANITY_READ_TOKEN` | Sanity → API → Tokens → Viewer role |
   | `PUBLIC_SITE_URL` | leave blank on first deploy; set to `https://<slug>.pages.dev` after |
   | `PUBLIC_TURNSTILE_SITE_KEY` | `3x00000000000000000000FF` for the test challenge, or your real key |
   | `TURNSTILE_SECRET_KEY` | `1x0000000000000000000000000000000AA` for the test always-pass, or your real key |
   | `RESEND_API_KEY` | leave blank if you don't need email; contact form still renders |
   | `CONTACT_TO_ADDRESS` / `CONTACT_FROM_ADDRESS` | as configured |

6. **Save and Deploy**. First build takes 2-4 minutes. You'll get `https://<slug>.pages.dev`.
7. Every subsequent `git push` to your default branch triggers a new deploy. PRs get preview URLs automatically.

No API token needed for this path — Cloudflare uses your dashboard session.

**When you outgrow this** — hook up a custom domain, add DNS + Turnstile via Terraform, wire GitHub Actions for atomic deploys with Lighthouse budgets. See the full setup below.

---

## One-time setup

### 1. Sanity

1. Go to [sanity.io/manage](https://sanity.io/manage) → **New project** → give it a name, dataset `production`.
2. Copy the **project ID** from the URL / dashboard.
3. Once linked (via `SANITY_PROJECT_ID` in `apps/*/env`), you can re-open the dashboard any time with `pnpm run sanity`.

Then in [manage.sanity.io](https://manage.sanity.io) → your project:
- **API → CORS origins** — add `https://<your-domain>` and `https://*.<your-pages-project>.pages.dev` (Pages preview URLs), both with credentials enabled.
- **API → Tokens** — create a read token; save as `SANITY_READ_TOKEN`.
- **API → Webhooks** — add a webhook on `mutation` events pointing at the GitHub `repository_dispatch` endpoint (see `infra/terraform/sanity.tf` for the exact body).

### 2. Cloudflare

#### Creating the API token

Terraform needs a Cloudflare API token with three permissions. Cloudflare only shows the token once — copy it before closing the modal.

1. [dash.cloudflare.com](https://dash.cloudflare.com) → top-right avatar → **Profile** → **API Tokens** (left sidebar).
2. **Create Token** → find the "Custom token" section → **Get started**.
3. **Token name**: `restaurant-starter-terraform` (or your preference).
4. **Permissions** — add these rows:

   | Type | Group | Permission | |
   |---|---|---|---|
   | Account | Cloudflare Pages | **Edit** | required |
   | Account | Turnstile | **Edit** | required |
   | Zone | DNS | **Edit** | **skip if you don't have a custom domain yet** |

5. **Account Resources** → Include → Specific account → *your account*.
6. **Zone Resources** → Include → Specific zone → *your-domain.com*. **Skip this step if you skipped the Zone · DNS row above** — the Zone Resources selector only applies when a Zone-scoped permission is set.
7. (Optional) TTL or client IP filter — leave defaults for now.
8. **Continue to summary** → **Create Token** → **Copy the token immediately**.

> No custom domain yet? Leave `enable_custom_domain = false` in `terraform.tfvars` (the default). Terraform skips the zone/DNS lookup and the domain-attach resources entirely, and you still get a `<slug>.pages.dev` URL from the Pages project. Add a custom domain later by flipping the flag + setting `domain` and `zone_name`.

**Also grab your Cloudflare Account ID** — in the current dashboard, it's the 32-char hex ID directly in the URL: `https://dash.cloudflare.com/<ACCOUNT_ID>/...`. Copy it from there. You'll need it for `cloudflare_account_id` in `terraform.tfvars` and for the `CLOUDFLARE_ACCOUNT_ID` GitHub secret.

#### Install the Cloudflare Pages GitHub App (one-time, browser only)

Before Terraform can create a Pages project bound to a GitHub repo, the `cloudflare-workers-and-pages` GitHub App must be installed on the GitHub account that owns the repo, with access granted to that specific repo.

1. Open **[github.com/apps/cloudflare-workers-and-pages](https://github.com/apps/cloudflare-workers-and-pages)** → **Install** (or **Configure** if already installed)
2. Pick the account that owns the repo (personal or org)
3. **Only select repositories** → add `<owner>/restaurant-starter` (or "All repositories")
4. **Install** / **Save**

Equivalent path via Cloudflare dashboard: **Workers & Pages** → **Create application** → **Pages** → **Connect to Git** — bounces you to the same GitHub App install.

**If you get `401 Unauthorized` code `8000011` after installing**, diagnose with:

```bash
export TF_VAR_cloudflare_api_token=...  # your token
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/<YOUR_ACCOUNT_ID>/pages/projects" \
  -H "Authorization: Bearer $TF_VAR_cloudflare_api_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "binding-probe-'"$(date +%s)"'",
    "production_branch": "main",
    "source": {"type": "github", "config": {"owner": "<owner>", "repo_name": "restaurant-starter", "production_branch": "main"}}
  }' | jq
```

Common causes of persistent 8000011:
- API token isn't scoped to the account making the call (regenerate with **Account Resources → Include → your specific account**)
- `cloudflare_account_id` in tfvars is a different account than the one the App was installed against
- App installed on the wrong GitHub account (e.g. your personal `<user>` when the repo lives under an org)
- Repo access wasn't granted specifically to this repo (check the App's repo list under [github.com/settings/installations](https://github.com/settings/installations))
- **Stale App-install ↔ CF-account binding** — the App is installed and can see the repo on GitHub, but CF's server-side lookup for "does my account have access to this install" returns empty. Symptom: dashboard's **Workers & Pages → Create application → Connect to Git** just re-loops through the install page instead of showing your repos. **Fix that unsticks it**: go through the legacy **Import a project from Git repository** wizard (older Pages UI) — pick the repo (you don't need to complete the project). Just reaching the repo picker forces CF to re-sync the binding. After that, the modern flow works and `terraform apply` will succeed. Verified 2026-09-13.

If none of those apply, the raw API response usually points at the specific missing piece — share the full response with support via [cfl.re/3WgEyrH](https://cfl.re/3WgEyrH).

**Symptom if you skip this step**: `terraform apply` fails on `cloudflare_pages_project.web` with `401 Unauthorized` + Cloudflare error code `8000011` ("internal issue with your Cloudflare Pages Git installation"). The fix is always: install (or re-install) the app for the target repo, then re-run `terraform apply`.

#### Terraform apply

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars — fill in project_name, cloudflare_account_id, github_repo.
# Leave enable_custom_domain = false for a .pages.dev-only deploy.
# Flip to true and set domain + zone_name once you have a zone in this CF account.
export TF_VAR_cloudflare_api_token=...    # the token you just created
terraform init
terraform plan
terraform apply
```

This provisions:

- The Pages project + GitHub source binding
- A Turnstile widget
- DNS records for apex + www — **only when `enable_custom_domain = true`**; skipped on the default `.pages.dev`-only path

Copy the Turnstile keys from `terraform output` into your repo secrets.

> **First deploy: nothing to visit yet.** Terraform creates the Pages *project* but does **not** trigger the first build — the CF Terraform provider doesn't wrap the deployments API. Right after `terraform apply` succeeds, visiting `<slug>.pages.dev` returns 404. Kick the first deploy one of these ways:
>
> - **Easiest**: push any commit to the production branch — the GitHub source binding auto-triggers a build
> - **Or**: Cloudflare dash → your project → **Deployments** → **Create deployment** → deploy latest commit on the production branch
> - **Or (local build)**: `pnpm --filter @restaurant/web build` then `pnpm wrangler pages deploy apps/web/dist --project-name=<your-project-name>`
>
> After the first deploy lands, every subsequent `git push` auto-deploys as expected.

### 3. Resend

- Verify your sending domain.
- Create an API key.
- Add `RESEND_API_KEY`, `CONTACT_TO_ADDRESS`, `CONTACT_FROM_ADDRESS` to repo secrets.

### 4. GitHub repo secrets

The CI/CD workflows expect:

| Secret | Source |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dash |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dash |
| `CLOUDFLARE_PAGES_PROJECT` | The `project_name` you set in Terraform |
| `SANITY_PROJECT_ID` | Sanity dashboard |
| `SANITY_DATASET` | usually `production` |
| `SANITY_READ_TOKEN` | Sanity → API → Tokens |
| `SANITY_WEBHOOK_SECRET` | random 32-byte string (shared with webhook config) |
| `RESEND_API_KEY` | Resend dash |
| `PUBLIC_SITE_URL` | e.g. `https://example.com` |
| `CHROMATIC_PROJECT_TOKEN` | Optional — Chromatic for Storybook visual diffs |

## Day two

| | |
|---|---|
| Open a PR | `deploy-preview.yml` runs. Cloudflare creates a preview URL. |
| Merge to `main` | `deploy-prod.yml` builds + deploys + Lighthouse check. |
| Edit content in Sanity | Sanity webhook fires `repository_dispatch` → `content-webhook.yml` rebuilds. |
| Roll back | Cloudflare Pages → Deployments → "Rollback". |
