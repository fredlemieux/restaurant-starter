output "pages_project_subdomain" {
  description = "Cloudflare Pages preview subdomain (e.g. <project>.pages.dev). Always present — this is the free URL you can share immediately."
  value       = cloudflare_pages_project.web.subdomain
}

output "custom_domain_configured" {
  description = "Whether a custom apex + www were attached (matches var.enable_custom_domain)."
  value       = var.enable_custom_domain
}

output "site_url" {
  description = "Best URL to visit — custom domain if configured, else the pages.dev subdomain."
  value       = var.enable_custom_domain ? "https://${var.domain}" : "https://${cloudflare_pages_project.web.subdomain}"
}

output "turnstile_site_key" {
  description = "Public site key for the Turnstile widget."
  value       = cloudflare_turnstile_widget.contact.id
}

output "turnstile_secret_key" {
  description = "Secret key for server-side Turnstile verification."
  value       = cloudflare_turnstile_widget.contact.secret
  sensitive   = true
}
