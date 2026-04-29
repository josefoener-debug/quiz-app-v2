provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "josefoener-terraform-state"
    key    = "app/terraform.tfstate"
    region = "us-east-1"
  }
}

resource "aws_security_group" "ssh" {
  name        = "allow_ssh"
  description = "Allow SSH access"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "demo" {
  ami                    = "ami-0b6c6ebed2801a5cb"
  instance_type          = "t2.micro"
  key_name               = "HIER-DEIN-KEYPAIR-NAME"
  vpc_security_group_ids = [aws_security_group.ssh.id]

  tags = {
    Name = "test-server-iac"
  }
}