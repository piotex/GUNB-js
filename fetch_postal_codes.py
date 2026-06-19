"""
fetch_postal_codes.py
---------------------
Wczytuje unikalne nazwy miejscowości ze wszystkich plików CSV w katalogu,
pobiera dla nich kody pocztowe przez Nominatim API (OpenStreetMap)
i zapisuje do pliku kody_pocztowe.csv w formacie:
    Miejscowość;XX-XXX

Przy każdym uruchomieniu uzupełnia tylko brakujące wpisy — nie wysyła
ponownych zapytań dla miast już zapisanych w pliku wynikowym.

Uruchomienie:
    python3 fetch_postal_codes.py

Plik wynikowy można załadować w aplikacji przyciskiem
"📂 Importuj kody pocztowe z CSV".
"""

import csv
import glob
import os
import re
import ssl
import time
import urllib.request
import urllib.parse
import json

OUTPUT_FILE = "kody_pocztowe.csv"
# Kolumny, w których może być nazwa miejscowości (pierwsza znaleziona w nagłówkach)
CITY_COLUMN_CANDIDATES = ["miasto", "miejscowosc", "miejscowość", "city", "gmina"]
DELAY_S = 1.1                   # przerwa między zapytaniami (Nominatim TOS: ≥1 s)
SEPARATOR = None                # None = auto-detect


# ── helpers ────────────────────────────────────────────────────────────────

def detect_separator(line: str) -> str:
    for sep in ["#", ";", ",", "\t"]:
        if line.count(sep) > 0:
            return sep
    return ";"


def load_existing(output_file: str) -> dict[str, str]:
    """Wczytuje już zapisane kody: {miasto: kod_pocztowy}"""
    result: dict[str, str] = {}
    if not os.path.exists(output_file):
        return result
    with open(output_file, encoding="utf-8-sig") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split(";")
            if len(parts) < 2:
                continue
            city, code = parts[0].strip(), parts[1].strip()
            if re.match(r"^\d{2}-\d{3}$", code):
                result[city] = code
    print(f"Wczytano {len(result)} istniejących kodów z '{output_file}'")
    return result


def read_cities(input_file: str, city_col: str) -> list[str]:
    """Zwraca posortowaną listę unikalnych nazw miejscowości."""
    if not os.path.exists(input_file):
        raise FileNotFoundError(f"Nie znaleziono pliku '{input_file}'")

    with open(input_file, encoding="utf-8-sig") as f:
        first_line = f.readline()
    sep = detect_separator(first_line) if SEPARATOR is None else SEPARATOR

    cities: set[str] = set()
    with open(input_file, encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f, delimiter=sep)
        for row in reader:
            city = (row.get(city_col) or "").strip()
            if city:
                cities.add(city)

    print(f"  {len(cities)} unikalnych miejscowości w '{input_file}'")
    return sorted(cities)


def find_city_column(input_file: str) -> str | None:
    """Szuka nazwy kolumny z miejscowością na podstawie CITY_COLUMN_CANDIDATES."""
    with open(input_file, encoding="utf-8-sig") as f:
        first_line = f.readline()
    sep = detect_separator(first_line) if SEPARATOR is None else SEPARATOR
    headers = [h.strip().lower() for h in first_line.split(sep)]
    for candidate in CITY_COLUMN_CANDIDATES:
        if candidate.lower() in headers:
            # zwróć oryginalną (niezmienioną) nazwę
            idx = headers.index(candidate.lower())
            return first_line.split(sep)[idx].strip()
    return None


def nominatim_postcode(city: str) -> str | None:
    """
    Odpytuje Nominatim o kod pocztowy miejscowości w Polsce.
    Zwraca string 'XX-XXX' lub None jeśli nie znaleziono.
    """
    params = urllib.parse.urlencode({
        "q": f"{city}, Poland",
        "format": "json",
        "addressdetails": "1",
        "limit": "1",
        "accept-language": "pl",
        "countrycodes": "pl",
    })
    url = f"https://nominatim.openstreetmap.org/search?{params}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "GUNB-postal-fetcher/1.0 (local-script)"},
    )
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            data = json.load(resp)
    except Exception as e:
        print(f"  BŁĄD zapytania dla '{city}': {e}")
        return None

    if not data:
        return None

    postcode = data[0].get("address", {}).get("postcode", "")
    # Nominatim może zwrócić "05-088" lub "05-088; 05-090" — bierzemy pierwszy
    postcode = postcode.split(";")[0].strip().split(" ")[0].strip()
    if re.match(r"^\d{2}-\d{3}$", postcode):
        return postcode
    return None


def append_result(output_file: str, city: str, code: str) -> None:
    """Dopisuje jeden wpis do pliku wynikowego."""
    with open(output_file, "a", encoding="utf-8") as f:
        f.write(f"{city};{code}\n")


# ── main ───────────────────────────────────────────────────────────────────

def main() -> None:
    existing = load_existing(OUTPUT_FILE)

    # Zbierz miejscowości ze WSZYSTKICH plików CSV (poza plikiem wynikowym)
    output_abs = os.path.abspath(OUTPUT_FILE)
    csv_files = [
        f for f in glob.glob("*.csv")
        if os.path.abspath(f) != output_abs
    ]
    if not csv_files:
        print("Brak plików CSV w bieżącym katalogu.")
        return

    all_cities: set[str] = set()
    for csv_file in sorted(csv_files):
        city_col = find_city_column(csv_file)
        if not city_col:
            print(f"  Pomijam '{csv_file}' — brak kolumny z miejscowością")
            continue
        cities = read_cities(csv_file, city_col)
        all_cities.update(cities)

    pending = sorted(c for c in all_cities if c not in existing)
    print(f"\nŁącznie unikalnych miejscowości: {len(all_cities)}")
    print(f"Już mamy: {len(existing)}, do pobrania: {len(pending)}\n")

    if not pending:
        print("Nic do zrobienia — wszystkie kody już pobrane.")
        return

    found = 0
    not_found = 0

    for i, city in enumerate(pending, 1):
        print(f"[{i}/{len(pending)}] {city} ...", end=" ", flush=True)
        code = nominatim_postcode(city)
        if code:
            print(f"→ {code}")
            append_result(OUTPUT_FILE, city, code)
            found += 1
        else:
            print("→ nie znaleziono")
            not_found += 1
        time.sleep(DELAY_S)

    print(f"\nGotowe. Znaleziono: {found}, nie znaleziono: {not_found}")
    print(f"Wynik zapisany w '{OUTPUT_FILE}'")
    print(f"\nZaładuj ten plik w aplikacji: 📂 Importuj kody pocztowe z CSV")


if __name__ == "__main__":
    main()
