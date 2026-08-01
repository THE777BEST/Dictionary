import { splitExamples, splitTerms, stripHtml } from "./dictionary.js";

function pickFirst(list, fallback = "") {
  return Array.isArray(list) && list.length > 0 ? list[0] : fallback;
}

function unique(list) {
  return [...new Set(list.filter((item) => String(item).trim().length > 0))];
}

function buildLocalExamples(entry) {
  const examples = unique(entry.examples ?? splitExamples(entry.raw?.exam));
  if (examples.length > 0) {
    return examples.slice(0, 3);
  }

  const eng = String(entry.eng ?? "").trim();
  const uzb = String(entry.uzb ?? "").trim();
  if (!eng && !uzb) {
    return [];
  }

  return [
    eng && uzb
      ? `${eng} can be used when talking about ${uzb.toLowerCase()}.`
      : eng || uzb,
  ];
}

function buildLocalDefinition(entry, locale = "en") {
  const eng = String(entry.eng ?? "").trim();
  const uzb = String(entry.uzb ?? "").trim();
  const firstSynonym = pickFirst(entry.syn ?? splitTerms(entry.raw?.syn));

  if (!eng && !uzb) {
    return "";
  }

  if (locale === "uz") {
    const base = uzb || eng;
    const related = firstSynonym ? ` Yaqin ma'nodagi so'z: ${firstSynonym}.` : "";
    return `${base} uchun AI izohi.${related}`;
  }

  const related = firstSynonym ? ` Related idea: ${firstSynonym}.` : "";
  return `${eng || uzb} means ${uzb || eng}.${related}`.trim();
}

async function fetchRemoteAiProfile(entry, locale = "en") {
  const endpoint = import.meta.env.VITE_AI_ENDPOINT;
  if (!endpoint) {
    return null;
  }

  try {
    const response = await fetch(endpoint, {
      body: JSON.stringify({
        entry: {
          eng: entry.eng,
          syn: entry.syn,
          tran: entry.tran,
          type: entry.type,
          uzb: entry.uzb,
        },
        locale,
      }),
      headers: {
        "Content-Type": "application/json",
        ...(import.meta.env.VITE_AI_API_KEY
          ? { Authorization: `Bearer ${import.meta.env.VITE_AI_API_KEY}` }
          : {}),
      },
      method: "POST",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      antonyms: unique(
        Array.isArray(data.antonyms) ? data.antonyms.map(stripHtml) : []
      ),
      definition: String(data.definition ?? "").trim(),
      examples: unique(
        Array.isArray(data.examples) ? data.examples.map(stripHtml) : []
      ),
      pronunciation: String(data.pronunciation ?? "").trim(),
      synonyms: unique(
        Array.isArray(data.synonyms) ? data.synonyms.map(stripHtml) : []
      ),
      source: "remote",
    };
  } catch {
    return null;
  }
}

export async function getAiInsights(entry, locale = "en") {
  const remote = await fetchRemoteAiProfile(entry, locale);
  if (remote) {
    return remote;
  }

  return {
    antonyms: unique(entry.ant ?? splitTerms(entry.raw?.ant)),
    definition: buildLocalDefinition(entry, locale),
    examples: buildLocalExamples(entry),
    pronunciation: entry.pronunciation || "",
    source: "local",
    synonyms: unique(entry.syn ?? splitTerms(entry.raw?.syn)),
  };
}
