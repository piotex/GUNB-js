import { DataRow } from "./types";

export const MISSING_DATE_LABEL = "BRAK DATY";

const DATE_COLUMNS = [
  "data_wplywu_wniosku",
  "data_wplywu_wniosku_do_urzedu",
  "data_wydania_decyzji",
];

const detectSeparator = (firstLine: string): string => {
  const candidates = ["#", ";", ",", "\t"];
  let best = "#";
  let bestCount = 0;
  for (const sep of candidates) {
    const count = firstLine.split(sep).length - 1;
    if (count > bestCount) {
      bestCount = count;
      best = sep;
    }
  }
  return best;
};

const parseCSVLine = (line: string, separator: string): string[] => {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === separator && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
};

export const parseCSV = (
  csvData: string,
): { headers: string[]; data: DataRow[] } => {
  const rows = csvData.split("\n");
  const separator = detectSeparator(rows[0]);
  const rawHeaders = parseCSVLine(rows[0], separator);

  // Handle duplicate headers by adding suffix
  // First pass: count occurrences
  const headerCount: { [key: string]: number } = {};
  for (let i = 0; i < rawHeaders.length; i++) {
    const header = rawHeaders[i];
    headerCount[header] = (headerCount[header] || 0) + 1;
  }

  // Second pass: add suffixes to duplicates
  const headers: string[] = [];
  const currentCount: { [key: string]: number } = {};

  for (let i = 0; i < rawHeaders.length; i++) {
    const header = rawHeaders[i];
    currentCount[header] = (currentCount[header] || 0) + 1;

    if (headerCount[header] > 1) {
      // Add suffix if there are duplicates
      headers.push(`${header}_${currentCount[header]}`);
    } else {
      // No suffix if unique
      headers.push(header);
    }
  }

  const data: DataRow[] = [];

  for (let i = 1; i < rows.length; i++) {
    // Process all rows, including empty ones (like the original)
    const cells = parseCSVLine(rows[i], separator);
    const obj: DataRow = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = cells[j] || "";
    }
    for (const col of DATE_COLUMNS) {
      if (headers.includes(col) && !obj[col]?.trim()) {
        obj[col] = MISSING_DATE_LABEL;
      }
    }

    data.push(obj);
  }

  return { headers, data };
};

export const parseCSVHeadersAndSeparator = (
  firstLine: string,
): { headers: string[]; separator: string } => {
  const separator = detectSeparator(firstLine);
  const rawHeaders = parseCSVLine(firstLine, separator);

  const headerCount: { [key: string]: number } = {};
  for (const header of rawHeaders) {
    headerCount[header] = (headerCount[header] || 0) + 1;
  }

  const headers: string[] = [];
  const currentCount: { [key: string]: number } = {};
  for (const header of rawHeaders) {
    currentCount[header] = (currentCount[header] || 0) + 1;
    headers.push(
      headerCount[header] > 1 ? `${header}_${currentCount[header]}` : header,
    );
  }

  return { headers, separator };
};

export const parseCSVBatch = (
  lines: string[],
  startIdx: number,
  count: number,
  headers: string[],
  separator: string,
): DataRow[] => {
  const data: DataRow[] = [];
  const end = Math.min(startIdx + count, lines.length);
  for (let i = startIdx; i < end; i++) {
    const line = lines[i].replace(/\r$/, "");
    if (!line.trim()) continue;
    const cells = parseCSVLine(line, separator);
    const obj: DataRow = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = cells[j] || "";
    }
    for (const col of DATE_COLUMNS) {
      if (headers.includes(col) && !obj[col]?.trim()) {
        obj[col] = MISSING_DATE_LABEL;
      }
    }
    data.push(obj);
  }
  return data;
};

export const sortDataByDate = (
  data: DataRow[],
  headers: string[],
): DataRow[] => {
  const key = headers.includes("data_wplywu_wniosku_do_urzedu")
    ? "data_wplywu_wniosku_do_urzedu"
    : "data_wplywu_wniosku";

  const toSortKey = (val: string | undefined): number => {
    if (!val || val === MISSING_DATE_LABEL) return 0; // sort to end (descending)
    const d = new Date(val.substring(0, 10));
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  return [...data].sort((a, b) => toSortKey(b[key]) - toSortKey(a[key]));
};

export const getYearFromItem = (item: DataRow, headers: string[]): string => {
  const key = headers.includes("data_wplywu_wniosku_do_urzedu")
    ? "data_wplywu_wniosku_do_urzedu"
    : "data_wplywu_wniosku";

  if (!item[key]) return "";

  const year = item[key].split("-")[0];
  return year && year[0] === "2" ? year : "";
};

export const getStateFromItem = (item: DataRow, headers: string[]): string => {
  const key = headers.includes("wojewodztwo_objekt")
    ? "wojewodztwo_objekt"
    : "wojewodztwo";

  return item[key] || "";
};

export const getNazwaZamierzeniaKey = (headers: string[]): string => {
  return headers.includes("nazwa_zamierzenia_bud")
    ? "nazwa_zamierzenia_bud"
    : "rodzaj_zam_budowlanego";
};
