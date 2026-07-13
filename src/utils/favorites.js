export function createWordId(word = {}) {
  return [word.eng, word.type, word.uzb, word.tran]
    .map((part) => String(part ?? "").trim().toLowerCase())
    .join("|");
}

export function toFavoriteWord(word = {}) {
  return {
    ant: word.ant ?? [],
    exam: word.exam ?? "",
    examples: word.examples ?? [],
    id: createWordId(word),
    pronunciation: String(word.pronunciation ?? ""),
    syn: word.syn ?? [],
    eng: String(word.eng ?? ""),
    type: String(word.type ?? ""),
    uzb: String(word.uzb ?? ""),
    tran: String(word.tran ?? ""),
  };
}
