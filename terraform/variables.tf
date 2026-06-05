variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "eu-central-1"
}

variable "bucket_name" {
  description = "Name of the S3 bucket for website hosting (must be globally unique)"
  type        = string
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "prod"
}
