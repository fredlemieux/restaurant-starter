# Infrastructure

## Terraform

Provisions everything that lives in Cloudflare:

| Resource | Purpose |
|---|---|
| `cloudflare_pages_project.web` | The Pages project that builds + serves the site |
| `cloudflare_pages_domain.apex` / `.www` | Custom domains on the Pages project |
| `cloudflare_dns_record.apex` / `.www` | CNAMEs to `<project>.pages.dev` (proxied) |
| `cloudflare_turnstile_widget.contact` | Anti-spam token used on the contact form |

Sanity is **not** provisioned here — see `sanity.tf` for the one-time manual steps (no official Terraform provider exists at time of writing).

## Apply order

1. Create a Sanity project once and note the `SANITY_PROJECT_ID`.
2. Add CORS origins in Sanity for the domain + Pages preview subdomain.
3. Copy `terraform.tfvars.example` to `terraform.tfvars`, fill in values.
4. Export the API token: `export TF_VAR_cloudflare_api_token=...`
5. `terraform init && terraform plan && terraform apply`
6. Push the Sanity webhook config (see `sanity.tf`).

## Docker Compose (local dev)

`infra/docker-compose.yml` starts ancillary local services. Required for full local-dev parity but not for the static build:

| Service | Port | Purpose |
|---|---|---|
| `mailpit` | 8025 (UI), 1025 (SMTP) | Catches contact-form emails in dev |

Start with: `pnpm --filter @restaurant/web dev:stack` (alias for `docker compose -f infra/docker-compose.yml up`).
