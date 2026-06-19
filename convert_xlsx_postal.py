"""
convert_xlsx_postal.py
----------------------
Konwertuje Oficjalny_Spis_Pocztowych_Numerw_Adresowych_2024.xlsx
do pliku kody_pocztowe.csv w formacie:
    Miejscowość;XX-XXX

Jeśli dla jednej miejscowości jest wiele kodów (różne ulice/dzielnice),
zapisuje WSZYSTKIE — aplikacja bierze pierwszy pasujący.

Uruchomienie:
    python3 convert_xlsx_postal.py

Plik wynikowy załaduj w aplikacji: 📂 Importuj kody pocztowe z CSV
"""

import re
import openpyxl

INPUT_FILE = "Oficjalny_Spis_Pocztowych_Numerw_Adresowych_2024.xlsx"
OUTPUT_FILE = "kody_pocztowe.csv"
# Gdy True — zapisuje tylko jeden (pierwszy) kod na miejscowość
# Gdy False — zapisuje wszystkie kody (lepsza pokrywalność ulic)
ONE_PER_CITY = True


def main() -> None:
    print(f"Wczytuję '{INPUT_FILE}' ...")
    wb = openpyxl.load_workbook(INPUT_FILE, read_only=True, data_only=True)
    ws = wb.active

    rows = ws.iter_rows(min_row=1, values_only=True)
    headers = [str(h).strip() if h else "" for h in next(rows)]
    print(f"Nagłówki: {headers}")

    # Znajdź indeksy kolumn
    try:
        voiv_idx = headers.index("Województwo")
        city_idx = headers.index("Miejscowość")
        code_idx = headers.index("Kod pocztowy")
    except ValueError:
        # Fallback: szukaj case-insensitive
        hl = [h.lower() for h in headers]
        voiv_idx = next((i for i, h in enumerate(hl) if "wojew" in h), None)
        city_idx = next((i for i, h in enumerate(hl) if "miejscow" in h), None)
        code_idx = next((i for i, h in enumerate(hl) if "kod" in h), None)
        if city_idx is None or code_idx is None:
            raise RuntimeError(f"Nie znaleziono kolumn. Nagłówki: {headers}")

    seen: set[tuple[str, str]] = set()  # (city, voiv) → seen
    all_entries: list[tuple[str, str, str]] = []
    skipped = 0

    for row in rows:
        city = str(row[city_idx]).strip() if row[city_idx] else ""
        code = str(row[code_idx]).strip() if row[code_idx] else ""
        voiv = str(row[voiv_idx]).strip() if voiv_idx is not None and row[voiv_idx] else ""
        if not city or not code:
            skipped += 1
            continue
        if not re.match(r"^\d{2}-\d{3}$", code):
            skipped += 1
            continue
        key = (city, voiv)
        if ONE_PER_CITY:
            if key not in seen:
                seen.add(key)
                all_entries.append((city, voiv, code))
        else:
            all_entries.append((city, voiv, code))
            seen.add(key)

    wb.close()

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for city, voiv, code in all_entries:
            if voiv:
                f.write(f"{city};{voiv};{code}\n")
            else:
                f.write(f"{city};{code}\n")

    unique_cities = len({city for city, _, _ in all_entries})
    print(f"\nZapisano {len(all_entries)} wpisów ({unique_cities} unikalnych nazw miast, {len(seen)} par miasto+województwo)")
    print(f"Pominięto {skipped} pustych/nieprawidłowych wierszy")
    print(f"Wynik: '{OUTPUT_FILE}'")
    print(f"\nZaładuj w aplikacji: 📂 Importuj kody pocztowe z CSV")


if __name__ == "__main__":
    main()
