# Sanity does not publish an official Terraform provider.
#
# Steps to provision a Sanity project, performed manually once:
#
#   1. pnpm --filter @restaurant/studio sanity init --create-project "Restaurant" --dataset production
#   2. Note the printed project ID and add it as `SANITY_PROJECT_ID` to your secret store.
#   3. In manage.sanity.io: API > CORS origins > add the production domain + every Pages preview
#      subdomain pattern (https://*.<project>.pages.dev) with credentials enabled.
#   4. API > Webhooks > add a webhook for `mutation` events:
#        - URL: https://api.github.com/repos/<owner>/<repo>/dispatches
#        - Method: POST
#        - Headers: Authorization=Bearer <PAT>, Accept=application/vnd.github+json
#        - Body: {"event_type":"sanity-content-changed"}
#        - HTTP secret: matches SANITY_WEBHOOK_SECRET in the Pages env
#
# Once a community provider matures (or Sanity ships an official one), wire those steps in here.
