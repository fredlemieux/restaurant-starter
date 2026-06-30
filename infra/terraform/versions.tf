terraform {
  required_version = ">= 1.9.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }

  # Uncomment and configure for a real environment.
  # backend "s3" {
  #   bucket = "restaurant-starter-tfstate"
  #   key    = "prod/terraform.tfstate"
  #   region = "eu-west-1"
  # }
}
