# Format danych wejściowych — CzytnikCSV GUNB

## Wymagania ogólne

| Parametr          | Wartość            |
| ----------------- | ------------------ |
| Typ pliku         | `.csv`             |
| Separator kolumn  | `#` (hash/krzyżyk) |
| Separator wierszy | `\n` (nowa linia)  |
| Kodowanie         | UTF-8              |
| Pierwszy wiersz   | nagłówki kolumn    |

> **Uwaga:** Program NIE używa przecinka ani średnika jako separatora — wyłącznie znak `#`.

---

## Struktura pliku

```
nazwa_organu#data_wplywu_wniosku#numer_decyzji#...
Prezydent Miasta Warszawa#2024-03-15#001/2024#...
Starosta Powiatu Kraków#2024-04-01#002/2024#...
```

---

## Kolumny — wariant standardowy (zalecany)

| Nazwa kolumny           | Typ          | Opis                                                           | Przykład                                    |
| ----------------------- | ------------ | -------------------------------------------------------------- | ------------------------------------------- |
| `nazwa_organu`          | tekst        | Pełna nazwa organu administracyjnego                           | `Prezydent Miasta Warszawa`                 |
| `data_wplywu_wniosku`   | data         | Data wpłynięcia wniosku do urzędu                              | `2024-03-15`                                |
| `numer_decyzji`         | tekst        | Numer decyzji administracyjnej                                 | `AB.6740.1.2024`                            |
| `numer_decyzji_urzedu`  | tekst        | Wewnętrzny numer decyzji urzędu (klucz unikalności)            | `001/2024`                                  |
| `data_wydania_decyzji`  | data         | Data wydania decyzji                                           | `2024-05-20`                                |
| `nazwa_inwestor`        | tekst        | Nazwa inwestora / wnioskodawcy                                 | `Jan Kowalski`                              |
| `wojewodztwo`           | tekst        | Nazwa województwa (małe litery, bez polskich znaków w filtrze) | `mazowieckie`                               |
| `miasto`                | tekst        | Miejscowość objęta inwestycją                                  | `Warszawa`                                  |
| `nazwa_zam_budowlanego` | tekst        | Opis zamierzenia budowlanego                                   | `Budynek mieszkalny jednorodzinny`          |
| `kubatura`              | liczba/tekst | Kubatura obiektu w m³                                          | `450`                                       |
| `projektant_nazwisko`   | tekst        | Nazwisko projektanta                                           | `Nowak`                                     |
| `projektant_imie`       | tekst        | Imię projektanta                                               | `Anna`                                      |
| `kategoria`             | tekst        | Kategoria obiektu budowlanego (cyfry rzymskie)                 | `I`                                         |
| `nazwa_zamierzenia_bud` | tekst        | Rodzaj zamierzenia budowlanego                                 | `budowa nowego/nowych obiektów budowlanych` |

### Kolumny w wariancie alternatywnym (starszy format)

Aplikacja automatycznie wykrywa wariant pliku. Jeśli w nagłówkach brak kolumn z wariantu standardowego, program szuka następujących zamienników:

| Kolumna standardowa     | Zamiennik (starszy format)      |
| ----------------------- | ------------------------------- |
| `data_wplywu_wniosku`   | `data_wplywu_wniosku_do_urzedu` |
| `wojewodztwo`           | `wojewodztwo_objekt`            |
| `nazwa_zamierzenia_bud` | `rodzaj_zam_budowlanego`        |

---

## Format dat

Program akceptuje dwa formaty daty:

| Format       | Przykład              | Uwagi                                             |
| ------------ | --------------------- | ------------------------------------------------- |
| ISO 8601     | `2024-03-15`          | **zalecany**                                      |
| europejski   | `15.03.2024`          | akceptowany                                       |
| ISO z czasem | `2024-03-15 10:30:00` | akceptowany (używane są tylko pierwsze 10 znaków) |

Rok do filtrowania odczytywany jest z kolumny `data_wplywu_wniosku` (lub `data_wplywu_wniosku_do_urzedu`).

---

## Województwa — akceptowane wartości

Wartość w kolumnie `wojewodztwo` (lub `wojewodztwo_objekt`) musi być pisana małymi literami i być jednym z poniższych:

```
dolnośląskie        kujawsko-pomorskie   lubelskie         lubuskie
łódzkie             małopolskie          mazowieckie       opolskie
podkarpackie        podlaskie            pomorskie         śląskie
świętokrzyskie      warmińsko-mazurskie  wielkopolskie     zachodniopomorskie
```

---

## Kategoria obiektu — akceptowane wartości

Cyfry rzymskie od `I` do `XXX`:

```
I  II  III  IV  V  VI  VII  VIII  IX  X  XI  XII  XIII  XIV  XV
XVI  XVII  XVIII  XIX  XX  XXI  XXII  XXIII  XXIV  XXV  XXVI  XXVII  XXVIII  XXIX  XXX
```

---

## Rodzaj zamierzenia budowlanego (`nazwa_zamierzenia_bud`) — typowe wartości

```
budowa nowego/nowych obiektów budowlanych
nadbudowa istniejącego/istniejących obiektów budowlanych
rozbiórka istniejącego obiektu budowlanego
rozbudowa istniejącego/istniejących obiektów budowlanych
wykonanie robót budowlanych innych niż wymienione powyżej
```

---

## Filtrowanie danych przy wczytywaniu

Przy wczytywaniu pliku użytkownik wybiera:

1. **Rok/lata** — aplikacja odczytuje rok z kolumny `data_wplywu_wniosku`, wiersze z rokiem spoza zaznaczenia są odfiltrowane.
2. **Województwo/województwa** — wiersze z województwem spoza zaznaczenia są odfiltrowane.

Wiersze bez możliwej do odczytania daty lub województwa są pomijane.

---

## Obsługa zduplikowanych nagłówków

Jeśli plik zawiera dwie lub więcej kolumn o tej samej nazwie, aplikacja automatycznie dodaje sufiks numeryczny:

```
nazwa_organu#nazwa_organu#kategoria
→ nagłówki: nazwa_organu_1, nazwa_organu_2, kategoria
```

---

## Minimalny przykład poprawnego pliku

```csv
nazwa_organu#data_wplywu_wniosku#numer_decyzji_urzedu#data_wydania_decyzji#nazwa_inwestor#wojewodztwo#miasto#nazwa_zam_budowlanego#kubatura#projektant_nazwisko#projektant_imie#kategoria#nazwa_zamierzenia_bud
Prezydent Miasta Warszawa#2024-03-15#001/2024#2024-05-20#Jan Kowalski#mazowieckie#Warszawa#Budynek mieszkalny jednorodzinny#450#Nowak#Anna#I#budowa nowego/nowych obiektów budowlanych
```
