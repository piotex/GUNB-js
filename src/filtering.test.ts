/**
 * Testy silnika filtrowania — uruchom: npx react-scripts test --watchAll=false
 * Sprawdzają pełny pipeline: parsowanie CSV → filtr App (rok/województwo) → filtr DataDisplay (searchParameters)
 */

import {
  parseCSVHeadersAndSeparator,
  parseCSVBatch,
  getYearFromItem,
  getStateFromItem,
} from "./utils";
import { DataRow, SearchParameter } from "./types";
import { CHECKBOXES_YEARS } from "./constants";

// ── helpers ────────────────────────────────────────────────────────────────

const CSV_HEADER =
  "numer_urzad#numer_gunb#nazwa_organu#adres_organu#data_wplywu_wniosku#numer_decyzji_urzedu#data_wydania_decyzji#nazwa_inwestor#wojewodztwo#miasto#terc#cecha_1#cecha_2#ulica#ulica_dalej#nr_domu#rodzaj_inwestycji#kategoria#nazwa_zamierzenia_bud#nazwa_zam_budowlanego#kubatura#projektant_nazwisko#projektant_imie#projektant_numer_uprawnien#jednosta_numer_ew#obreb_numer#numer_dzialki#numer_arkusza_dzialki#jednostka_stara_numeracja_z_wniosku#stara_numeracja_obreb_z_wnioskiu#stara_numeracja_dzialka_z_wniosku";

const makeRow = (overrides: Partial<Record<string, string>> = {}): string => {
  const defaults: Record<string, string> = {
    numer_urzad: "60149/10/2025",
    numer_gunb: "ST-MZ-PR/WNIOSEK/33678/2025",
    nazwa_organu: "Starosta Powiatu Pruszków",
    adres_organu: "ul. Drzymały 30, 05-800 Pruszków",
    data_wplywu_wniosku: "2025-10-31 00:00:00",
    numer_decyzji_urzedu: "2111/2025",
    data_wydania_decyzji: "2025-12-12 00:00:00",
    nazwa_inwestor: "",
    wojewodztwo: "mazowieckie",
    miasto: "Owczarnia",
    terc: "1421035",
    cecha_1: "",
    cecha_2: "",
    ulica: "",
    ulica_dalej: "",
    nr_domu: "",
    rodzaj_inwestycji: "Budynek mieszkalny jednorodzinny",
    kategoria: "I",
    nazwa_zamierzenia_bud: "budowa nowego/nowych obiektów budowlanych",
    nazwa_zam_budowlanego:
      "budowa dwóch budynków mieszkalnych jednorodzinnych w zabudowie bliźniaczej",
    kubatura: "1651",
    projektant_nazwisko: "Jaworski",
    projektant_imie: "Michał",
    projektant_numer_uprawnien: "45/01/WŁ",
    jednosta_numer_ew: "142103_5",
    obreb_numer: "0016",
    numer_dzialki: "410/2",
    numer_arkusza_dzialki: "",
    jednostka_stara_numeracja_z_wniosku: "",
    stara_numeracja_obreb_z_wnioskiu: "",
    stara_numeracja_dzialka_z_wniosku: "",
  };
  const merged = { ...defaults, ...overrides };
  return Object.values(merged).join("#");
};

const parseSample = (extraRows: string[] = []) => {
  const lines = [CSV_HEADER, makeRow(), ...extraRows];
  const { headers, separator } = parseCSVHeadersAndSeparator(lines[0]);
  const data = parseCSVBatch(lines, 1, lines.length, headers, separator);
  return { headers, data };
};

/** Replicates App.tsx filterBatch logic */
const appFilter = (
  data: DataRow[],
  headers: string[],
  selectedYears: string[],
  selectedStates: string[],
): DataRow[] =>
  data.filter((item) => {
    const year = getYearFromItem(item, headers);
    const state = getStateFromItem(item, headers);
    return (
      year &&
      state &&
      selectedYears.includes(year) &&
      selectedStates.includes(state)
    );
  });

/** Replicates DataDisplay filterData searchParameters logic */
const displayFilter = (data: DataRow[], params: SearchParameter[]): DataRow[] =>
  data.filter((item) => {
    for (const param of params) {
      const key = Object.keys(param)[0];
      const value = param[key];
      const fieldVal = item[key] || "";
      const alts = value
        .split("|")
        .map((v) => v.trim())
        .filter(Boolean);
      if (!alts.some((alt) => fieldVal.includes(alt))) return false;
    }
    return true;
  });

// ── tests ──────────────────────────────────────────────────────────────────

describe("CSV parsing", () => {
  test("detects # separator and parses headers", () => {
    const { headers } = parseSample();
    expect(headers).toContain("numer_urzad");
    expect(headers).toContain("nazwa_zam_budowlanego");
    expect(headers.length).toBe(31);
  });

  test("parses the sample row correctly", () => {
    const { data } = parseSample();
    expect(data.length).toBeGreaterThanOrEqual(1);
    expect(data[0]["numer_urzad"]).toBe("60149/10/2025");
    expect(data[0]["miasto"]).toBe("Owczarnia");
    expect(data[0]["wojewodztwo"]).toBe("mazowieckie");
  });

  test("strips Windows \\r from last field", () => {
    // Simulate CRLF file
    const lines = (CSV_HEADER + "\r\n" + makeRow() + "\r").split(/\r?\n/);
    const { headers, separator } = parseCSVHeadersAndSeparator(lines[0]);
    const data = parseCSVBatch(lines, 1, lines.length, headers, separator);
    expect(data[0]["stara_numeracja_dzialka_z_wniosku"]).toBe("");
    // Should NOT contain \r in any field
    Object.values(data[0]).forEach((v) => {
      expect(v).not.toContain("\r");
    });
  });
});

describe("App-level year/state filter", () => {
  test("passes row when year 2025 is in selectedYears", () => {
    const { headers, data } = parseSample();
    const result = appFilter(data, headers, ["2025"], ["mazowieckie"]);
    expect(result.length).toBe(1);
  });

  test("BLOCKS row when only 2026 is selected (the original bug)", () => {
    const { headers, data } = parseSample();
    const result = appFilter(data, headers, ["2026"], ["mazowieckie"]);
    expect(result.length).toBe(0); // confirms the bug
  });

  test("CHECKBOXES_YEARS includes year 2025", () => {
    // Ensures default selected years span enough history
    expect(CHECKBOXES_YEARS).toContain("2025");
  });

  test("passes row when all CHECKBOXES_YEARS are selected", () => {
    const { headers, data } = parseSample();
    const result = appFilter(data, headers, CHECKBOXES_YEARS, ["mazowieckie"]);
    expect(result.length).toBe(1);
  });

  test("blocks row when state filter excludes its state", () => {
    const { headers, data } = parseSample();
    const result = appFilter(data, headers, CHECKBOXES_YEARS, ["dolnośląskie"]);
    expect(result.length).toBe(0);
  });
});

describe("DataDisplay searchParameters filter", () => {
  const { headers, data } = parseSample();
  const allYears = CHECKBOXES_YEARS;
  const preFiltered = appFilter(data, headers, allYears, ["mazowieckie"]);

  test("finds row by exact numer_urzad value", () => {
    const result = displayFilter(preFiltered, [
      { numer_urzad: "60149/10/2025" },
    ]);
    expect(result.length).toBe(1);
  });

  test("finds row by substring numer_urzad", () => {
    const result = displayFilter(preFiltered, [{ numer_urzad: "60149" }]);
    expect(result.length).toBe(1);
  });

  test("finds row with OR (|) operator", () => {
    const result = displayFilter(preFiltered, [
      { nazwa_zam_budowlanego: "budynek|budynków" },
    ]);
    expect(result.length).toBe(1);
  });

  test("excludes row when OR operands don't match", () => {
    const result = displayFilter(preFiltered, [
      { nazwa_zam_budowlanego: "basen|lotnisko" },
    ]);
    expect(result.length).toBe(0);
  });

  test("AND between multiple params — both must match", () => {
    const result = displayFilter(preFiltered, [
      { numer_urzad: "60149" },
      { miasto: "Owczarnia" },
    ]);
    expect(result.length).toBe(1);
  });

  test("AND between multiple params — one doesn't match → 0 results", () => {
    const result = displayFilter(preFiltered, [
      { numer_urzad: "60149" },
      { miasto: "Warszawa" },
    ]);
    expect(result.length).toBe(0);
  });
});
