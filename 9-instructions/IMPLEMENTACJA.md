# Implementacja CzytnikCSV w React

## Struktura projektu

```
src/
├── App.tsx                      # Główny komponent aplikacji
├── App.css                      # Style aplikacji
├── types.ts                     # Definicje typów TypeScript
├── constants.ts                 # Stałe (lata, województwa, kategorie, organy)
├── utils.ts                     # Funkcje pomocnicze (parsowanie CSV, sortowanie)
└── components/
    ├── FileUpload.tsx           # Komponent wczytywania pliku
    ├── DataDisplay.tsx          # Główny komponent wyświetlania danych
    ├── FilterSection.tsx        # Komponent filtrowania
    └── DataTable.tsx            # Komponent tabeli z sortowaniem
```

## Główne komponenty

### App.tsx

- **Stan główny aplikacji**: przechowuje dane, nagłówki, wybrane lata i województwa
- **Obsługa wczytywania pliku**: parsowanie CSV, filtrowanie wstępne, sortowanie
- **Routing między widokami**: FileUpload → DataDisplay

### FileUpload.tsx

- Wybór lat (2000-2030) z możliwością zaznaczenia wszystkich
- Wybór województw z możliwością zaznaczenia wszystkich
- Wczytywanie pliku CSV z separatorem `#`
- Loader podczas wczytywania
- Blokowanie checkboxów podczas wczytywania

### DataDisplay.tsx

- **Filtry zaawansowane**:
  - Wybór kolumn do wyświetlenia
  - Filtrowanie po organach administracyjnych
  - Filtrowanie po kategoriach (I-XXX)
  - Filtrowanie po nazwach zamierzeń budowlanych
  - Niestandardowe filtry tekstowe
- **Podsumowanie**: liczba rekordów przed i po filtrowaniu
- **Limit wyświetlanych wierszy**: kontrolowany przez użytkownika
- **Przycisk powrotu**: reset aplikacji

### FilterSection.tsx

- Sekcja "Kolumny do wyświetlenia" z przyciskami "Wszystkie" i "Domyślne"
- Sekcja "Organy administracyjne" z możliwością zaznaczenia wszystkich
- Sekcja "Kategorie" z możliwością zaznaczenia wszystkich
- Sekcja "Nazwa zamierzenia budowlanego" z możliwością zaznaczenia wszystkich
- Tabela filtrów niestandardowych z możliwością dodawania i usuwania

### DataTable.tsx

- Wyświetlanie danych w formie tabeli
- **Sortowanie po kliknięciu w nagłówek**:
  - Pierwsze kliknięcie: sortowanie rosnące ▲
  - Drugie kliknięcie: sortowanie malejące ▼
  - Trzecie kliknięcie: brak sortowania
- Obsługa limitu wyświetlanych wierszy

## Funkcje pomocnicze (utils.ts)

### parseCSV()

- Parsuje plik CSV z separatorem `#`
- Zwraca nagłówki i dane jako obiekty

### sortDataByDate()

- Sortuje dane według daty wpływu wniosku
- Obsługuje różne warianty nazw kolumn

### getYearFromItem()

- Wyciąga rok z daty wpływu wniosku
- Walidacja (tylko lata zaczynające się od "2")

### getStateFromItem()

- Wyciąga województwo z rekordu
- Obsługuje różne warianty nazw kolumn

### getNazwaZamierzeniaKey()

- Zwraca poprawną nazwę kolumny dla nazwy zamierzenia
- Obsługuje warianty: `nazwa_zamierzenia_bud` / `rodzaj_zam_budowlanego`

## Stałe (constants.ts)

- **CHECKBOXES_YEARS**: tablica lat 2000-2030
- **POSIBLE_CATEGORIES**: kategorie I-XXX
- **POSIBLE_ORGANS**: obiekt z organami dla każdego województwa
- **DEFAULT_COLUMNS**: domyślnie wyświetlane kolumny

## Obsługa różnych formatów danych

Aplikacja automatycznie wykrywa i obsługuje różne warianty nazw kolumn:

- `data_wplywu_wniosku` / `data_wplywu_wniosku_do_urzedu`
- `wojewodztwo` / `wojewodztwo_objekt`
- `nazwa_zamierzenia_bud` / `rodzaj_zam_budowlanego`

## Filtrowanie danych

### Filtrowanie wstępne (podczas wczytywania)

1. Rok musi być w zakresie wybranych lat
2. Województwo musi być w zakresie wybranych województw
3. Dane są sortowane po dacie (od najnowszych)

### Filtrowanie zaawansowane (po wczytaniu)

1. **Nazwa zamierzenia**: musi pasować do wybranych opcji
2. **Organ**: musi być w liście wybranych organów
3. **Kategoria**: musi być w liście wybranych kategorii
4. **Filtry niestandardowe**: wszystkie warunki muszą być spełnione (AND)

## Styling

- Responsywny design
- Kolory zgodne z oryginałem (pomarańczowy upload button)
- Animowany loader
- Tabelki w stylu Bootstrap
- Grid layout dla checkboxów
- Hover effects na buttonach i wierszach tabeli

## Różnice od oryginału

### Uproszczenia:

- Usunięto deduplikację (funkcja `filter_unique()`) - można łatwo dodać
- Usunięto przyciski "Pokaż unikalne" - można łatwo dodać

### Ulepszenia:

- Kod w TypeScript (type safety)
- Komponentowa architektura (łatwiejsze utrzymanie)
- React hooks (nowoczesny stan aplikacji)
- Lepsza separacja logiki biznesowej
- Bardziej deklaratywny kod

## Uruchomienie

```bash
npm install
npm start
```

## Build produkcyjny

```bash
npm run build
```

Zbudowana aplikacja będzie dostępna w folderze `build/`.
