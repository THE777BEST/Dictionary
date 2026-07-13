import { createWordId } from "../utils/favorites.js";

const dictionaryModules = import.meta.glob("../vocabularies/*.js");
const moduleCache = new Map();
let allEntriesPromise;

function normalizeTerm(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[ʻʼ‘’`´]/g, "'");
}

function normalizeEntry(entry = {}) {
  return {
    ant: entry.ant ?? [],
    count: Number(entry.count ?? 0),
    eng: String(entry.eng ?? "").trim(),
    exam: entry.exam ?? "",
    examples: entry.examples ?? [],
    id: createWordId(entry),
    pronunciation: String(entry.pronunciation ?? "").trim(),
    syn: entry.syn ?? [],
    tran: String(entry.tran ?? "").trim(),
    type: String(entry.type ?? "").trim(),
    uzb: String(entry.uzb ?? "").trim(),
  };
}

function normalizeCollection(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((entry) => entry && typeof entry === "object")
    .map(normalizeEntry)
    .filter((entry) => entry.id);
}

async function loadModule(path) {
  if (!dictionaryModules[path]) {
    return [];
  }

  if (!moduleCache.has(path)) {
    moduleCache.set(
      path,
      dictionaryModules[path]().then((module) =>
        normalizeCollection(module.default)
      )
    );
  }

  return moduleCache.get(path);
}

async function loadEntries(searchDirection, normalizedQuery) {
  if (searchDirection === "en") {
    const firstLetter = normalizedQuery.match(/[a-z]/)?.[0];
    if (!firstLetter) {
      return [];
    }

    return loadModule(`../vocabularies/${firstLetter}.js`);
  }

  if (!allEntriesPromise) {
    const paths = Object.keys(dictionaryModules).sort((left, right) =>
      left.localeCompare(right)
    );

    allEntriesPromise = Promise.all(paths.map((path) => loadModule(path))).then(
      (groups) => groups.flat()
    );
  }

  return allEntriesPromise;
}

function rankEntry(entry, searchDirection, normalizedQuery) {
  const value =
    searchDirection === "en"
      ? normalizeTerm(entry.eng)
      : normalizeTerm(entry.uzb);

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

export async function searchDictionary(query, searchDirection = "en") {
  const normalizedQuery = normalizeTerm(query);
  if (!normalizedQuery) {
    return [];
  }

  const entries = await loadEntries(searchDirection, normalizedQuery);

  return entries
    .map((entry) => rankEntry(entry, searchDirection, normalizedQuery))
    .filter(Boolean)
    .sort(
      (left, right) =>
        left.score - right.score ||
        left.length - right.length ||
        left.entry.eng.localeCompare(right.entry.eng)
    )
    .slice(0, 24)
    .map(({ entry }) => entry);
}
