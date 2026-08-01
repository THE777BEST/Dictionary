// @ts-check
import { createWordId } from "../utils/favorites.js";

const dictionaryModules = import.meta.glob("../vocabularies/*.js");
const moduleCache = new Map();
let allEntriesPromise;
let statsPromise;
const wordIndex = new Map();
const letterIndex = new Map();

function normalizeText(value = "") {
  return String(value)
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\s+/g, " ");
}

function stripHtml(value = "") {
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTerms(value = "") {
  const cleaned = stripHtml(value);
  if (!cleaned) {
    return [];
  }

  return cleaned
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .filter((item, index, list) => list.indexOf(item) === index);
}

function splitExamples(value = "") {
  const cleaned = stripHtml(value);
  if (!cleaned) {
    return [];
  }

  return cleaned
    .split(/(?:^|[•]|(?:\.\s{2,})|\n)+/g)
    .map((item) => item.replace(/^[•\-\u2022\s]+/, "").trim())
    .filter((item) => item.length > 0)
    .filter((item, index, list) => list.indexOf(item) === index);
}

function extractPronunciation(value = "") {
  const cleaned = String(value);
  const match = cleaned.match(/\/([^/]+)\//);
  return match ? `/${match[1].trim()}/` : "";
}

function normalizeEntry(entry = {}, source = "") {
  const eng = String(entry.eng ?? "").trim();
  const uzb = String(entry.uzb ?? "").trim();
  const tran = String(entry.tran ?? "").trim();
  const type = String(entry.type ?? "").trim();
  const id = createWordId(entry);

  return {
    ant: splitTerms(entry.ant),
    count: Number(entry.count ?? 0),
    eng,
    examples: splitExamples(entry.exam),
    id,
    pronunciation: extractPronunciation(tran),
    raw: entry,
    source,
    syn: splitTerms(entry.syn),
    tran,
    type,
    uzb,
  };
}

function normalizeCollection(data, source = "") {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => normalizeEntry(entry, source))
    .filter((entry) => entry.id && entry.eng.length > 0);
}

async function loadModule(path) {
  if (!dictionaryModules[path]) {
    return [];
  }

  if (!moduleCache.has(path)) {
    moduleCache.set(
      path,
      dictionaryModules[path]().then((module) =>
        normalizeCollection(module.default, path)
      )
    );
  }

  return moduleCache.get(path);
}

async function loadAllEntries() {
  if (!allEntriesPromise) {
    const paths = Object.keys(dictionaryModules).sort((left, right) =>
      left.localeCompare(right)
    );

    allEntriesPromise = Promise.all(paths.map((path) => loadModule(path))).then(
      (groups) => {
        const entries = groups.flat();

        wordIndex.clear();
        letterIndex.clear();

        for (const entry of entries) {
          wordIndex.set(entry.id, entry);
          const firstLetter = normalizeText(entry.eng).match(/[a-z]/)?.[0];
          if (!firstLetter) {
            continue;
          }

          const list = letterIndex.get(firstLetter) ?? [];
          list.push(entry);
          letterIndex.set(firstLetter, list);
        }

        return entries;
      }
    );
  }

  return allEntriesPromise;
}

async function loadLetterEntries(searchDirection, normalizedQuery) {
  if (searchDirection === "en") {
    const firstLetter = normalizedQuery.match(/[a-z]/)?.[0];
    if (!firstLetter) {
      return [];
    }

    const cached = letterIndex.get(firstLetter);
    if (cached) {
      return cached;
    }

    return loadModule(`../vocabularies/${firstLetter}.js`);
  }

  return loadAllEntries();
}

function rankEntry(entry, searchDirection, normalizedQuery) {
  const value =
    searchDirection === "en"
      ? normalizeText(entry.eng)
      : normalizeText(entry.uzb);

  if (!value) {
    return null;
  }

  let score = -1;

  if (value === normalizedQuery) {
    score = 0;
  } else if (value.startsWith(normalizedQuery)) {
    score = 1;
  } else if (value.includes(normalizedQuery)) {
    score = 2;
  }

  if (score === -1) {
    return null;
  }

  return {
    entry,
    length: value.length,
    score,
  };
}

function countMissing(entries, key) {
  return entries.reduce((count, entry) => {
    const value = entry?.raw?.[key];
    return count + (value === undefined || value === null || String(value).trim() === "" ? 1 : 0);
  }, 0);
}

async function calculateStats() {
  const entries = await loadAllEntries();
  const duplicateMap = new Map();

  for (const entry of entries) {
    const list = duplicateMap.get(entry.id) ?? [];
    list.push(entry);
    duplicateMap.set(entry.id, list);
  }

  const duplicateGroups = [...duplicateMap.values()].filter(
    (group) => group.length > 1
  );

  return {
    duplicateEntries: duplicateGroups.reduce(
      (sum, group) => sum + (group.length - 1),
      0
    ),
    duplicateGroups: duplicateGroups.length,
    files: Object.keys(dictionaryModules).length,
    missing: {
      ant: countMissing(entries, "ant"),
      count: countMissing(entries, "count"),
      eng: countMissing(entries, "eng"),
      exam: countMissing(entries, "exam"),
      syn: countMissing(entries, "syn"),
      tran: countMissing(entries, "tran"),
      type: countMissing(entries, "type"),
      uzb: countMissing(entries, "uzb"),
    },
    totalEntries: entries.length,
    uniqueEntries: new Set(entries.map((entry) => entry.id)).size,
  };
}

export function getDictionaryStats() {
  if (!statsPromise) {
    statsPromise = calculateStats();
  }

  return statsPromise;
}

export async function getAllDictionaryEntries() {
  return loadAllEntries();
}

export async function getDictionaryEntryById(id) {
  if (!id) {
    return null;
  }

  await loadAllEntries();
  return wordIndex.get(id) ?? null;
}

export async function getRandomWord() {
  const entries = await loadAllEntries();
  if (entries.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * entries.length);
  return entries[randomIndex] ?? null;
}

export async function warmDictionaryCache() {
  if (typeof window === "undefined") {
    return;
  }

  const preloads = Object.keys(dictionaryModules).map((path) =>
    loadModule(path).catch(() => [])
  );

  await Promise.all(preloads);
}

export async function searchDictionary(query, searchDirection = "en") {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return [];
  }

  const entries = await loadLetterEntries(searchDirection, normalizedQuery);
  const seenIds = new Set();

  return entries
    .map((entry) => rankEntry(entry, searchDirection, normalizedQuery))
    .filter(Boolean)
    .sort(
      (left, right) =>
        left.score - right.score ||
        left.length - right.length ||
        left.entry.eng.localeCompare(right.entry.eng)
    )
    .filter(({ entry }) => {
      if (seenIds.has(entry.id)) {
        return false;
      }

      seenIds.add(entry.id);
      return true;
    })
    .slice(0, 24)
    .map(({ entry }) => entry);
}

export { normalizeText, splitExamples, splitTerms, stripHtml };
