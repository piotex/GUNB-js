import React, { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DataRow } from "../types";
import { geocodeCity, getCached, isCached, postalByCity } from "../geocoding";
import RowDetailsModal from "./RowDetailsModal";

function createIcon(count: number, selected: boolean): L.DivIcon {
  const bg = selected ? "#dc2626" : "#2563eb";
  const s = count > 99 ? 38 : 30;
  const fs = count > 99 ? 10 : 12;
  const label = count > 999 ? "999+" : String(count);
  return L.divIcon({
    html: `<div style="background:${bg};color:#fff;width:${s}px;height:${s}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${fs}px;font-weight:700;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35)">${label}</div>`,
    className: "",
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
    popupAnchor: [0, -(s / 2 + 2)],
  });
}

interface CityGroup {
  key: string;
  city: string;
  voiv: string;
  rows: DataRow[];
}

interface MapPanelProps {
  data: DataRow[];
  headers: string[];
  onClose: () => void;
}

const MapPanel: React.FC<MapPanelProps> = ({ data, headers, onClose }) => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const cancelRef = useRef(false);

  const cityKey = useMemo(
    () => (headers.includes("miasto") ? "miasto" : ""),
    [headers],
  );
  const voivKey = useMemo(
    () =>
      headers.includes("wojewodztwo_objekt")
        ? "wojewodztwo_objekt"
        : headers.includes("wojewodztwo")
          ? "wojewodztwo"
          : "",
    [headers],
  );

  const groups = useMemo<CityGroup[]>(() => {
    const map = new Map<string, CityGroup>();
    for (const row of data) {
      const city = (row[cityKey] || "").trim();
      if (!city) continue;
      const voiv = (row[voivKey] || "").trim();
      const key = `${city}|||${voiv}`;
      if (!map.has(key)) map.set(key, { key, city, voiv, rows: [] });
      map.get(key)!.rows.push(row);
    }
    return Array.from(map.values()).sort(
      (a, b) => b.rows.length - a.rows.length,
    );
  }, [data, cityKey, voivKey]);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [geocodingStatus, setGeocodingStatus] = useState<string | null>(null);
  const [markerVersion, setMarkerVersion] = useState(0);
  const [modalRow, setModalRow] = useState<DataRow | null>(null);

  // Init Leaflet map once
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;
    mapRef.current = L.map(mapDivRef.current).setView([52.1, 19.4], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapRef.current);
    return () => {
      cancelRef.current = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Geocode cities sequentially (Nominatim: max 1 req/s)
  useEffect(() => {
    if (groups.length === 0) return;
    cancelRef.current = false;

    const pending = groups.filter((g) => !isCached(g.city, g.voiv));

    // Immediately show already-cached markers
    setMarkerVersion((v) => v + 1);

    if (pending.length === 0) return;

    let done = 0;
    setGeocodingStatus(`0 / ${pending.length}`);

    (async () => {
      for (const g of pending) {
        if (cancelRef.current) return;
        await geocodeCity(g.city, g.voiv);
        done++;
        setGeocodingStatus(
          done < pending.length ? `${done} / ${pending.length}` : null,
        );
        setMarkerVersion((v) => v + 1);
      }
    })();
  }, [groups]);

  // Sync markers to map whenever markerVersion or selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const g of groups) {
      const geo = getCached(g.city, g.voiv);
      if (geo === undefined) continue; // not geocoded yet
      const isSelected = selectedKey === g.key;
      const existing = markersRef.current.get(g.key);
      const compositeKey = `${g.city}|${g.voiv}`;
      const postcode =
        postalByCity.get(compositeKey) ?? postalByCity.get(g.city);
      const tooltipText = postcode
        ? `${g.city} (${g.rows.length}) \u2022 ${postcode}`
        : `${g.city} (${g.rows.length})`;
      if (existing) {
        existing.setIcon(createIcon(g.rows.length, isSelected));
        existing.setTooltipContent(tooltipText);
      } else if (geo) {
        const m = L.marker([geo.lat, geo.lng], {
          icon: createIcon(g.rows.length, isSelected),
        });
        m.bindTooltip(tooltipText, { direction: "top" });
        m.on("click", () => setSelectedKey(g.key));
        m.addTo(map);
        markersRef.current.set(g.key, m);
      }
    }
  }, [markerVersion, selectedKey, groups]);

  // Remove stale markers when groups change
  useEffect(() => {
    const keys = new Set(groups.map((g) => g.key));
    markersRef.current.forEach((m, k) => {
      if (!keys.has(k)) {
        m.remove();
        markersRef.current.delete(k);
      }
    });
  }, [groups]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const selectedGroup = selectedKey
    ? (groups.find((g) => g.key === selectedKey) ?? null)
    : null;

  const dateField = (row: DataRow) =>
    (
      row["data_wydania_decyzji"] ||
      row["data_wplywu_wniosku_do_urzedu"] ||
      row["data_wplywu_wniosku"] ||
      ""
    ).slice(0, 10);

  return (
    <div className="map-panel-overlay">
      <div className="map-panel-inner">
        {/* Header */}
        <div className="map-panel-header">
          <span>
            🗺️ Mapa — <strong>{data.length.toLocaleString("pl-PL")}</strong>{" "}
            rekordów, <strong>{groups.length}</strong> miast
          </span>
          {geocodingStatus && (
            <span className="map-geocoding-badge">
              ⏳ Geokodowanie: {geocodingStatus}
            </span>
          )}
          <button className="btn btn-sm btn-secondary" onClick={onClose}>
            ✕ Zamknij
          </button>
        </div>

        {/* Body */}
        <div className="map-panel-body">
          {/* Side panel */}
          <div className="map-side-panel">
            {selectedGroup ? (
              <>
                <div className="map-side-city-header">
                  <strong>{selectedGroup.city}</strong>
                  <span>
                    {postalByCity.get(selectedGroup.city) && (
                      <span className="map-side-postcode">
                        {postalByCity.get(selectedGroup.city)}
                      </span>
                    )}
                    {selectedGroup.rows.length.toLocaleString("pl-PL")} rekordów
                  </span>
                </div>
                <div className="map-side-list">
                  {selectedGroup.rows.slice(0, 300).map((row, i) => (
                    <div
                      key={i}
                      className="map-side-item map-side-item-clickable"
                      onClick={() => setModalRow(row)}
                    >
                      <div className="map-side-item-id">
                        {row["numer_decyzji_urzedu"] ||
                          row["numer_decyzji"] ||
                          `#${i + 1}`}
                      </div>
                      {row["nazwa_inwestor"] && (
                        <div className="map-side-item-investor">
                          {row["nazwa_inwestor"]}
                        </div>
                      )}
                      <div className="map-side-item-date">{dateField(row)}</div>
                      <div className="map-side-item-desc">
                        {row["nazwa_zam_budowlanego"] ||
                          row["nazwa_zamierzenia_bud"] ||
                          ""}
                      </div>
                    </div>
                  ))}
                  {selectedGroup.rows.length > 300 && (
                    <div className="map-side-more">
                      + {selectedGroup.rows.length - 300} kolejnych rekordów
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="map-side-hint">
                <p>
                  Kliknij marker na mapie, aby zobaczyć rekordy z danego miasta.
                </p>
                {groups.length === 0 && (
                  <p className="map-side-warning">
                    Brak danych z wypełnionym polem „miasto".
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Map */}
          <div ref={mapDivRef} className="map-leaflet-container" />
        </div>
      </div>
      <RowDetailsModal
        isOpen={modalRow !== null}
        row={modalRow}
        headers={headers}
        onClose={() => setModalRow(null)}
      />
    </div>
  );
};

export default MapPanel;
