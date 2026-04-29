terraform {
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.4"
    }
  }
}

resource "local_file" "mein_file" {
  content  = "Hallo, ich lerne Terraform!"
  filename = "hello.txt"
}