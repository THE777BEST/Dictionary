export function createWordId(word = {}) {
  return [word.eng, word.type, word.uzb, word.tran]
    .map((part) => String(part ?? "").trim().toLowerCase())
    .join("|");
}

export function toFavoriteWord(word = {}) {
  return {
    ant: Array.isArray(word.ant) ? word.ant : [],
    examples: Array.isArray(word.examples) ? word.examples : [],
    id: createWordId(word),
    eng: String(word.eng ?? ""),
    pronunciation: String(word.pronunciation ?? ""),
    syn: Array.isArray(word.syn) ? word.syn : [],
    type: String(word.type ?? ""),
    uzb: String(word.uzb ?? ""),
    tran: String(word.tran ?? ""),
  };
}
