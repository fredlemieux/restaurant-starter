locals {
  project_name = var.project_name
  domain       = var.domain
  zone_name    = var.zone_name
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
