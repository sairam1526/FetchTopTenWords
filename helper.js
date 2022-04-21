export const getJSONformatForWordsList = (lookupData = []) => {
  return lookupData.map((data) => {
    const [currData] = data.def;
    if (!currData) return { text: '', pos: '', syn: [] };
    let lookupObj = {
      text: currData.text,
      pos: currData.pos,
      syn: [],
    };
    currData.tr.forEach((translate) => {
      if (translate.hasOwnProperty('syn')) {
        lookupObj.syn = [...translate.syn, ...lookupObj.syn];
      }
    });
    return lookupObj;
  });
};

export const createObject = (word, dict) => {
  if (!word.trim()) return;
  const _word = word.toLowerCase();
  if (dict.hasOwnProperty(_word)) {
    dict[_word]++;
  } else {
    dict[_word] = 1;
  }
};
