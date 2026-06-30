# Deployment

The first deploy is about 30 minutes of clicking through Sanity + Cloudflare + Resend, mostly waiting for DNS. After that, every change is `git push`.

## One-time setup

### 1. Sanity

```bash
cd apps/studio
pnpm sanity init --create-project "Your Restaurant" --dataset production
```

Note the **project ID** that's printed. Stash it.

In [manage.sanity.io](https://manage.sanity.io) → your project:
- **API → CORS origins** — add `https://<your-domain>` and `https://*.<your-pages-project>.pages.dev` (Pages preview URLs), both with credentials enabled.
- **API → Tokens** — create a read token; save as `SANITY_READ_TOKEN`.
- **API → Webhooks** — add a webhook on `mutation` events pointing at the GitHub `repository_dispatch` endpoint (see `infra/terraform/sanity.tf` for the exact body).

### 2. Cloudflare

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars
export TF_VAR_cloudflare_api_token=...    # token with Pages:Edit, Zone DNS:Edit, Turnstile:Edit
terraform init
terraform plan
terraform apply
```

This provisions:
- The Pages project + GitHub source binding
- DNS records for apex + www
- A Turnstile widget

Copy the Turnstile keys from `terraform output` into your repo secrets.

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
