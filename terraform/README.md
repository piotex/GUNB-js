# Terraform - GUNB Website Deployment

Ten katalog zawiera konfigurację Terraform do wdrożenia aplikacji GUNB jako statycznej strony internetowej na AWS S3.

## Wymagania

- [Terraform](https://www.terraform.io/downloads.html) >= 1.0
- Konto AWS z odpowiednimi uprawnieniami
- [AWS CLI](https://aws.amazon.com/cli/) zainstalowane (opcjonalne, ale zalecane)
- Zbudowana aplikacja (katalog `build/` w głównym katalogu projektu)

## Konfiguracja AWS Credentials

### Opcja 1: Tymczasowe credentials (zalecane dla testów)

Ustaw zmienne środowiskowe w terminalu:

```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="eu-central-1"
```

Credentials będą aktywne tylko w bieżącej sesji terminala. Po zamknięciu terminala zostaną automatycznie usunięte.

### Opcja 2: AWS CLI z profilem (łatwe do usunięcia)

1. Zainstaluj AWS CLI jeśli nie masz
2. Skonfiguruj profil:

```bash
aws configure --profile gunb-terraform
# Wprowadź: Access Key ID, Secret Access Key, region (eu-central-1), output format (json)
```

3. Użyj profilu z Terraform:

```bash
export AWS_PROFILE=gunb-terraform
terraform init
terraform apply
```

4. **Usunięcie profilu po zakończeniu:**

```bash
# Usuń profil z konfiguracji
aws configure --profile gunb-terraform list
rm ~/.aws/credentials  # lub edytuj i usuń sekcję [gunb-terraform]
unset AWS_PROFILE
```



## Konfiguracja projektu

1. Skopiuj plik z przykładową konfiguracją:

   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Edytuj `terraform.tfvars` i ustaw swoje wartości:

   - `bucket_name` - unikalna nazwa bucketa S3 (musi być globalnie unikalna)
   - `aws_region` - region AWS (domyślnie: eu-central-1)
   - `environment` - środowisko (prod, dev, staging)

3. Upewnij się, że masz zbudowaną aplikację:
   ```bash
   cd ..
   npm run build
   ```

## Użycie

### Inicjalizacja Terraform

```bash
terraform init
```

### Sprawdzenie planu zmian

```bash
terraform plan
```

### Wdrożenie infrastruktury

```bash
terraform apply
```

Po zakończeniu, Terraform wyświetli URL strony internetowej.

### Aktualizacja zawartości strony

Po każdej zmianie w kodzie:

1. Zbuduj ponownie aplikację: `npm run build`
2. Wdróż zmiany: `terraform apply`

### Usunięcie infrastruktury

```bash
terraform destroy
```

## Zasoby tworzone przez Terraform

- **S3 Bucket** - przechowuje pliki statycznej strony
- **S3 Bucket Website Configuration** - konfiguracja hostingu strony
- **S3 Bucket Policy** - polityka dostępu publicznego do plików
- **S3 Objects** - wszystkie pliki z katalogu `build/`

## Bezpieczeństwo

Bucket S3 jest skonfigurowany jako publicznie dostępny (tylko odczyt), co jest wymagane dla hostingu statycznej strony. Upewnij się, że:

- Nie przechowujesz wrażliwych danych w kodzie aplikacji
- Plik `terraform.tfvars` jest w `.gitignore` i nie jest commitowany do repozytorium

## Koszty

Hosting statycznej strony na S3 jest bardzo tani:

- Przechowywanie danych: ~$0.023 za GB miesięcznie
- Transfer danych: pierwsze 100GB/miesiąc gratis, potem ~$0.09 za GB
- Zapytania GET: ~$0.0004 za 1000 zapytań

## Rozszerzenia

Aby dodać CloudFront CDN, HTTPS i własną domenę, można rozszerzyć konfigurację o:

- `aws_cloudfront_distribution`
- `aws_route53_zone` i `aws_route53_record`
- `aws_acm_certificate` (dla certyfikatu SSL)
