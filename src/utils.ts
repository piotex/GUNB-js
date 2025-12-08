import { DataRow } from "./types";

export const parseCSV = (
  csvData: string
): { headers: string[]; data: DataRow[] } => {
  const rows = csvData.split("\n");
  const rawHeaders = rows[0].split("#");

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
    const cells = rows[i].split("#");
    const obj: DataRow = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = cells[j] || "";
    }

    data.push(obj);
  }

  return { headers, data };
};

export const sortDataByDate = (
  data: DataRow[],
  headers: string[]
): DataRow[] => {
  const key = headers.includes("data_wplywu_wniosku_do_urzedu")
    ? "data_wplywu_wniosku_do_urzedu"
    : "data_wplywu_wniosku";

  return [...data].sort((a, b) => {
    const dateA = new Date(a[key]?.substring(0, 10) || "");
    const dateB = new Date(b[key]?.substring(0, 10) || "");
    return dateB.getTime() - dateA.getTime();
  });
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
