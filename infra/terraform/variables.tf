variable "project_name" {
  description = "Slug for the Cloudflare Pages project (no spaces)."
  type        = string
}

variable "domain" {
  description = "Apex domain the site is served from (e.g. example.com)."
  type        = string
}

variable "zone_name" {
  description = "Cloudflare DNS zone that owns the domain. Usually equal to `domain`."
  type        = string
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token with Pages:Edit + Zone DNS:Edit + Turnstile:Edit."
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID."
  type        = string
}

variable "github_repo" {
  description = "owner/repo for the Pages project source."
  type        = string
}

variable "production_branch" {
  description = "Branch deployed to the production environment."
  type        = string
  default     = "main"
}

variable "build_env_vars" {
  description = "Non-secret environment variables exposed to Pages builds + runtime."
  type        = map(string)
  default     = {}
}

variable "build_env_secrets" {
  description = "Secret environment variables (e.g. SANITY_READ_TOKEN, RESEND_API_KEY)."
  type        = map(string)
  sensitive   = true
  default     = {}
}
