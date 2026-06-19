import csv
import os

# Lista fraz – wiersz musi zawierać WSZYSTKIE (jak grep | grep | grep)
# DATA = ["Jaworska", "Agnieszka"]
# DATA = ["10/2025", "Owczarnia"]
DATA = ["60149/10/2025"]


INPUT_FILE = "wynik_mazowieckie.csv"
OUTPUT_FILE = "python_out.txt"
SEPARATOR = None  # auto-detect: #  ;  ,  \t


def detect_separator(line: str) -> str:
    candidates = ["#", ";", ",", "\t"]
    return max(candidates, key=lambda s: line.count(s))


def format_table(headers: list[str], rows: list[list[str]]) -> str:
    all_rows = [headers] + rows
    col_widths = [
        max(len(str(row[i])) for row in all_rows)
        for i in range(len(headers))
    ]
    sep = "+" + "+".join("-" * (w + 2) for w in col_widths) + "+"

    def fmt_row(row):
        return "| " + " | ".join(str(cell).ljust(col_widths[i]) for i, cell in enumerate(row)) + " |"

    lines = [sep, fmt_row(headers), sep]
    for row in rows:
        lines.append(fmt_row(row))
    lines.append(sep)
    return "\n".join(lines)


def main():
    if not os.path.exists(INPUT_FILE):
        print(f"Błąd: nie znaleziono pliku '{INPUT_FILE}'")
        return

    with open(INPUT_FILE, encoding="utf-8-sig") as f:
        first_line = f.readline()

    sep = detect_separator(first_line) if SEPARATOR is None else SEPARATOR

    matched_rows: list[list[str]] = []
    headers: list[str] = []

    with open(INPUT_FILE, encoding="utf-8-sig", newline="") as f:
        reader = csv.reader(f, delimiter=sep)
        headers = next(reader)
        terms = [DATA] if isinstance(DATA, str) else DATA
        for row in reader:
            row_text = " ".join(cell.lower() for cell in row)
            if all(term.lower() in row_text for term in terms):
                matched_rows.append(row)

    terms = [DATA] if isinstance(DATA, str) else DATA
    label = " & ".join(f"'{t}'" for t in terms)
    print(f"Szukane frazy (AND): {label}")
    print(f"Znaleziono wierszy: {len(matched_rows)}")

    if not matched_rows:
        print("Brak wyników.")
        return

    table = format_table(headers, matched_rows)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(f"Szukane frazy (AND): {label}\n")
        f.write(f"Znaleziono wierszy: {len(matched_rows)}\n\n")
        f.write(table)
        f.write("\n")

    print(f"Zapisano do '{OUTPUT_FILE}'")


if __name__ == "__main__":
    main()
