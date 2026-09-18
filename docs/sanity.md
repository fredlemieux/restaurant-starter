# Sanity setup

Sanity does not publish an official Terraform provider, so a Sanity project
can't be provisioned as part of `terraform apply`. The steps below are the
one-time manual setup — performed once per project, then never touched again.

## Steps

1. **Create the project + dataset**

   ```bash
   pnpm --filter @restaurant/studio sanity init --create-project "Restaurant" --dataset production
   ```

2. **Note the printed project ID** and add it as `SANITY_PROJECT_ID` to your secret store.

3. **Configure CORS.** In [manage.sanity.io](https://manage.sanity.io) → API → CORS origins,
   add the production domain + every Pages preview subdomain pattern
   (`https://*.<project>.pages.dev`) with credentials enabled.

4. **Mint a GitHub fine-grained personal access token for the webhook auth:**
   - <https://github.com/settings/personal-access-tokens/new>
   - **Repository access:** *Only select repositories* → `<owner>/<repo>`
   - **Repository permissions:** **Contents: Read and write** — required for `repository_dispatch`.
     (The `repo` scope name applies to *classic* PATs only; fine-grained tokens
     need `Contents: write`. `Actions` is not the right permission — dispatch writes
     a repo event; the workflow running is downstream.)
   - Copy the `github_pat_...` value once (won't be shown again).

5. **Add the webhook.** In [manage.sanity.io](https://manage.sanity.io) → API → Webhooks,
   add a webhook for `mutation` events:

   - **URL:** `https://api.github.com/repos/<owner>/<repo>/dispatches`
   - **Method:** `POST`
   - **Headers:**
     - `Authorization: Bearer <PAT>` — must include the word `Bearer` + a space, or GitHub returns `401`.
     - `Accept: application/vnd.github+json`
   - **Payload:** set the outgoing body to a **static** object. Sanity's default is
     "post the changed document as the body", which GitHub rejects with `422`
     (fields like `_id`, `name`, `email` are not permitted keys; `event_type` isn't supplied).
     Depending on your Sanity UI version, use ONE of:
     - **HTTP body** field (raw JSON string): `{"event_type": "sanity-content-changed"}`
     - **Projection** field (GROQ expression): `{ "event_type": "sanity-content-changed" }`

     The `event_type` value must match the `types:` entry in
     `.github/workflows/content-webhook.yml` (`sanity-content-changed`) — otherwise
     GitHub `204`s the request but no workflow matches.
   - The webhook signing secret field can be left blank — GitHub validates the PAT,
     not a shared secret. See the README "Deployment model — revisit" callout for a
     future direct-endpoint alternative that would use HMAC.

6. **Verify.** Publish any small edit in Studio, then
   [manage.sanity.io](https://manage.sanity.io) → Webhooks → the webhook → **Attempts**.
   A healthy attempt is `resultCode: 204`. Common failures:

   | `resultCode` | Meaning | Fix |
   |---|---|---|
   | `401 Requires authentication` | Authorization header missing/wrong | Usually the `Bearer ` prefix was omitted from the header value |
   | `403 Resource not accessible by PAT` | PAT is missing `Contents: write` | Edit the fine-grained PAT permissions (or mint a new one) |
   | `404` | Owner/repo wrong in the URL | Check `https://api.github.com/repos/<owner>/<repo>/dispatches` matches the actual repo |
   | `422 ... are not permitted keys / event_type wasn't supplied` | Projection / HTTP body not set — Sanity is posting the changed document instead of the static `{event_type: ...}` | Set the Projection or HTTP body per step 5 |

## If a community Terraform provider ever ships

Wire these steps into the (currently absent) `infra/terraform/sanity.tf` and
delete this file. Until then, this doc is the source of truth.
