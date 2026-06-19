export interface GeoResult {
  lat: number;
  lng: number;
  postcode: string | null;
}

// Shared module-level caches — survive component re-mounts and panel close/reopen
const cache = new Map<string, GeoResult | null>();
const inFlight = new Map<string, Array<(r: GeoResult | null) => void>>();

/** cityName → postcode — exported so any component can read it */
export const postalByCity: Map<string, string> = new Map();

export function isCached(city: string): boolean {
  return cache.has(city);
}

export function getCached(city: string): GeoResult | null | undefined {
  if (!cache.has(city)) return undefined;
  return cache.get(city)!;
}

/**
 * Global serial queue — guarantees ≤1 Nominatim request per 1.15 s
 * across ALL callers (DataDisplay + MapPanel).
 * Each geocodeCity call appends to the chain; cached cities skip the queue entirely.
 */
let queueTail: Promise<void> = Promise.resolve();

export async function geocodeCity(city: string): Promise<GeoResult | null> {
  if (cache.has(city)) return cache.get(city)!;

  // Deduplicate: if already queued, share the result
  if (inFlight.has(city)) {
    return new Promise((resolve) => {
      inFlight.get(city)!.push(resolve);
    });
  }
  inFlight.set(city, []);

  // Extend the global queue
  const myTurn = queueTail;
  let releaseNext!: () => void;
  queueTail = new Promise<void>((r) => {
    releaseNext = r;
  });

  await myTurn; // wait for previous request + its delay

  // Re-check cache — another call may have filled it while we were waiting
  if (!cache.has(city)) {
    let result: GeoResult | null = null;
    try {
      const q = encodeURIComponent(`${city}, Polska`);
      const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=pl&addressdetails=1`;
      const res = await fetch(url, { headers: { "Accept-Language": "pl,en" } });
      if (res.ok) {
        const json = (await res.json()) as Array<{
          lat: string;
          lon: string;
          address?: { postcode?: string };
        }>;
        if (json.length > 0) {
          result = {
            lat: parseFloat(json[0].lat),
            lng: parseFloat(json[0].lon),
            postcode: json[0].address?.postcode ?? null,
          };
          if (result.postcode) postalByCity.set(city, result.postcode);
        }
      }
    } catch {
      /* network/CORS error — result stays null */
    }
    cache.set(city, result);
  }

  const finalResult = cache.get(city) as GeoResult | null;
  const waiters = inFlight.get(city) ?? [];
  inFlight.delete(city);
  waiters.forEach((cb) => cb(finalResult));

  // Throttle: allow next request only after 1.15 s
  setTimeout(releaseNext, 1150);

  return finalResult;
}

/**
 * Load a custom postal-code CSV file and populate postalByCity.
 * Expected format (one entry per line):
 *   Nazwa miejscowości;XX-XXX
 * or with any number of extra columns after the code.
 * Lines that do not contain a valid XX-XXX code are skipped.
 * If a city already has a cached Nominatim code, the CSV value takes precedence.
 */
export function loadPostalCSV(text: string): number {
  const lines = text.split(/\r?\n/);
  let loaded = 0;
  for (const line of lines) {
    const raw = line.trim();
    if (!raw) continue;
    const parts = raw.split(";");
    if (parts.length < 2) continue;
    const city = parts[0].trim();
    if (!city) continue;

    let voiv = "";
    let code = "";
    if (parts.length >= 3 && /^\d{2}-\d{3}$/.test(parts[2].trim())) {
      // format: Miejscowość;Województwo;XX-XXX
      voiv = parts[1].trim();
      code = parts[2].trim();
    } else {
      // format: Miejscowość;XX-XXX
      code = parts[1].trim();
    }
    if (!/^\d{2}-\d{3}$/.test(code)) continue;

    if (voiv) {
      postalByCity.set(`${city}|${voiv}`, code); // klucz złożony
    }
    postalByCity.set(city, code); // fallback bez województwa
    loaded++;
  }
  return loaded;
}
