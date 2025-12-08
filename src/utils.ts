import { DataRow } from "./types";

export const parseCSV = (
  csvData: string
): { headers: string[]; data: DataRow[] } => {
  const rows = csvData.split("\n");
  const headers = rows[0].split("#").map((h) => h.trim());
  const data: DataRow[] = [];

  for (let i = 1; i < rows.length; i++) {
    if (!rows[i].trim()) continue;

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
