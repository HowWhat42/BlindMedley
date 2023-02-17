export const textFormater = (text: string) => {
  text = text.toLowerCase();

  // Remove parentheses and content inside
  text = text.replace(/ *\([^)]*\) */g, "");

  // Remove everything after "feat."
  if (text.includes("feat.")) text = text.split("feat.")[0]!;

  // Remove everything after "ft."
  if (text.includes("ft.")) text = text.split("ft.")[0]!;

  // Remove everything after " - "
  if (text.includes(" - ")) text = text.split(" - ")[0]!;

  // Remove ponctuation
  text = text.replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g, "");

  // Remove spaces
  text = text.replace(/\s{2,}/g, " ");

  // Convert french characters
  text = text.replace(/é/g, "e");
  text = text.replace(/è/g, "e");
  text = text.replace(/ê/g, "e");
  text = text.replace(/à/g, "a");
  text = text.replace(/â/g, "a");
  text = text.replace(/î/g, "i");
  text = text.replace(/ï/g, "i");
  text = text.replace(/ô/g, "o");
  text = text.replace(/ö/g, "o");
  text = text.replace(/ù/g, "u");
  text = text.replace(/û/g, "u");
  text = text.replace(/ç/g, "c");

  return text;
};

export const levenshtein = (a: string, b: string) => {
  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }

  if (a.length > b.length) {
    const tmp = a;
    a = b;
    b = tmp;
  }

  const row = [];
  for (let i = 0; i <= a.length; i++) {
    row[i] = i;
  }

  for (let i = 1; i <= b.length; i++) {
    let prev = i;
    for (let j = 1; j <= a.length; j++) {
      let val = 0;
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        val = row[j - 1]!;
      } else {
        val = Math.min(row[j - 1]! + 1, prev + 1, row[j]! + 1);
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[a.length] = prev;
  }

  return row[a.length];
};
