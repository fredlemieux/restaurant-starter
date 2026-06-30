output "pages_project_subdomain" {
  description = "Cloudflare Pages preview subdomain (e.g. <project>.pages.dev)."
  value       = cloudflare_pages_project.web.subdomain
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
