# GUNB-js

Aplikacja do analizy danych z GUNB (Główny Urząd Nadzoru Budowlanego) - pozwoleń na budowę w Polsce.

## Opis funkcjonalności

### Główne możliwości aplikacji:

1. **Wczytywanie danych CSV**

   - Format pliku: CSV z separatorem `#`
   - Źródło danych: https://wyszukiwarka.gunb.gov.pl/pobranie.html
   - Automatyczne parsowanie nagłówków i danych

2. **Filtrowanie wstępne (przed wczytaniem pliku)**

   - Wybór roku/lat z zakresu 2000-2030
   - Wybór województw (16 województw Polski)
   - Dane są filtrowane już podczas wczytywania dla optymalizacji

3. **Filtrowanie zaawansowane (po wczytaniu)**

   - **Kolumny do wyświetlenia**: możliwość wyboru które kolumny mają być widoczne w tabeli
   - **Organy administracyjne**: filtrowanie po konkretnych starostwach/urzędach
   - **Kategorie**: filtrowanie po kategoriach obiektów budowlanych (I-XXX)
   - **Nazwa zamierzenia budowlanego**: typy projektów (budowa, rozbudowa, rozbiórka, nadbudowa, itp.)
   - **Filtry niestandardowe**: możliwość dodawania własnych filtrów tekstowych dla dowolnej kolumny

4. **Wyświetlanie danych**

   - Tabela z możliwością sortowania po kliknięciu w nagłówek kolumny
   - Limit wyświetlanych rekordów (kontrolowany przez użytkownika)
   - Podsumowanie: liczba elementów spełniających filtry
   - Opcja wyświetlania tylko unikalnych decyzji (deduplikacja)

5. **Domyślne ustawienia**
   - Domyślnie wybrany: bieżący rok
   - Domyślnie wybrane: województwo mazowieckie
   - Domyślnie zaznaczone kolumny: nazwa_organu, numer_decyzji_urzedu, data_wydania_decyzji, nazwa_inwestor, wojewodztwo, miasto, nazwa_zam_budowlanego, kubatura

### Struktura danych CSV

Aplikacja obsługuje różne warianty nazw kolumn:

- `data_wplywu_wniosku` / `data_wplywu_wniosku_do_urzedu`
- `wojewodztwo` / `wojewodztwo_objekt`
- `rodzaj_zam_budowlanego` / `nazwa_zamierzenia_bud`

### Kluczowe funkcje techniczne:

- **Sortowanie**: dane automatycznie sortowane po dacie wpływu wniosku (od najnowszych)
- **Filtrowanie wielopoziomowe**: łączenie wielu warunków filtrowania
- **Deduplikacja**: wykrywanie duplikatów po numerze decyzji urzędu
- **Animacje**: loader podczas wczytywania danych
- **Responsywność**: wykorzystanie Bootstrap 3.4.1

## Uruchomienie wersji React
```
cd /mnt/c/Users/pkubon/kn/0-git-repos/GUNB-js
```

```bash
npm install
npm start
```

## Build produkcyjny

```bash
npm run build
```

## Źródło danych

https://wyszukiwarka.gunb.gov.pl/pobranie.html

