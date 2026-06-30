data "cloudflare_zone" "site" {
  filter = { name = local.zone_name }
}

resource "cloudflare_pages_project" "web" {
  account_id        = var.cloudflare_account_id
  name              = local.project_name
  production_branch = var.production_branch

  source = {
    type = "github"
    config = {
      owner                         = split("/", var.github_repo)[0]
      repo_name                     = split("/", var.github_repo)[1]
      production_branch             = var.production_branch
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "all"
    }
  }

  build_config = {
    build_command   = "pnpm --filter @restaurant/web build"
    destination_dir = "apps/web/dist"
    root_dir        = ""
  }

  deployment_configs = {
    preview = {
      env_vars               = { for k, v in var.build_env_vars : k => { type = "plain_text", value = v } }
      compatibility_date     = "2026-01-01"
      compatibility_flags    = ["nodejs_compat"]
    }
    production = {
      env_vars               = { for k, v in var.build_env_vars : k => { type = "plain_text", value = v } }
      compatibility_date     = "2026-01-01"
      compatibility_flags    = ["nodejs_compat"]
    }
  }
}

resource "cloudflare_pages_domain" "apex" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.web.name
  name         = local.domain
}

resource "cloudflare_pages_domain" "www" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.web.name
  name         = "www.${local.domain}"
}

resource "cloudflare_dns_record" "apex" {
  zone_id = data.cloudflare_zone.site.zone_id
  name    = local.domain
  type    = "CNAME"
  content = "${cloudflare_pages_project.web.name}.pages.dev"
  proxied = true
  ttl     = 1
}

resource "cloudflare_dns_record" "www" {
  zone_id = data.cloudflare_zone.site.zone_id
  name    = "www"
  type    = "CNAME"
  content = "${cloudflare_pages_project.web.name}.pages.dev"
  proxied = true
  ttl     = 1
}

resource "cloudflare_turnstile_widget" "contact" {
  account_id = var.cloudflare_account_id
  name       = "${local.project_name}-contact-form"
  domains    = [local.domain, "www.${local.domain}"]
  mode       = "managed"
  region     = "world"
}
