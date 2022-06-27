const get_props = (verb) => {
  let special_sym = ['д', 'з', 'л', 'н', 'с', 'т'];
  let stem = '', group = 0, pattern_num = 0;
  if (verb.slice(-3) == 'ыны') {
    stem = verb.slice(0, -3);
    group = 1;
    if (verb.slice(-4) == 'ьыны') {
      stem = verb.slice(0, -4);
      pattern_num = 1;
    } else if (special_sym.includes(verb.slice(-4, -3))) {
      pattern_num = 2;
    }
  } else if (['аны', 'яны'].includes(verb.slice(-3))) {
    stem = verb.slice(0, -2);
    group = 2;
    pattern_num = 3;
  }
  return [stem, group, pattern_num];
};

const get_tense_form = (tense, stem, pattern_num) => {
  let tense_patterns = {
    'present': [
      ['исько', 'иськод', 'е', 'иськом(ы)', 'иськоды', 'о'],
      ['исько', 'иськод', 'е', 'иськом(ы)', 'иськоды', 'ё'],
      ['ӥсько', 'ӥськод', 'э', 'ӥськом(ы)', 'ӥськоды', 'о'],
      ['сько', 'ськод', 'ськоз', 'ськом(ы)', 'ськоды', 'ськозы']
    ],
    'past': [
      ['и', 'ид', 'из', 'им(ы)', 'иды', 'изы'],
      ['и', 'ид', 'из', 'им(ы)', 'иды', 'изы'],
      ['ӥ', 'ӥд', 'ӥз', 'ӥм(ы)', 'ӥды', 'ӥзы'],
      ['й', 'д', 'з', 'м(ы)', 'ды', 'зы']
    ],
    'future': [
      ['о', 'од', 'оз', 'ом(ы)', 'оды', 'озы'],
      ['ё', 'ёд', 'ёз', 'ём(ы)', 'ёды', 'ёзы'],
      ['о', 'од', 'оз', 'ом(ы)', 'оды', 'озы'],
      ['ло', 'лод', 'лоз', 'лом(ы)', 'лоды', 'лозы']
    ]
  };
  let personal_pronounses = ['Мон', 'Тон', 'Со', 'Ми', 'Тӥ', 'Соос'];
  let result = [];
  tense_patterns[tense][pattern_num].forEach((pattern, idx) => {
    result.push(personal_pronounses[idx] + ' ' + stem + pattern);
  });
  return result;
};

const main = (verb) => {
  const [stem, group, pattern_num] = get_props(verb);
  if (group == 0) {
    return ({ status: 'error', message: "Given argument isn't udmurt verb" });
  }
  let result = {};
  for (tense of ['present', 'past', 'future']) {
    let capTense = tense.charAt(0).toUpperCase() + tense.slice(1);
    result[capTense] = [];
    for (form of get_tense_form(tense, stem, pattern_num)) {
      result[capTense].push(form);
    }
  }
  return result;
};

const enter_press = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    const verb = verbInput.value.toLowerCase();
    let result = main(verb);
    resultContainer.innerHTML = '';
    if (result.status == 'error') {
      resultContainer.innerHTML = result.message;
    } else {
      for (tense in result) {
        let tense_container = document.createElement('div');
        tense_container.classList.add('tense');
        let tense_title_container = document.createElement('div');
        tense_title_container.classList.add('tense-title');
        tense_title_container.innerHTML = tense;
        tense_container.appendChild(tense_title_container);
        resultContainer.appendChild(tense_container);
        for (form of result[tense]) {
          let form_container = document.createElement('div');
          form_container.classList.add('form');
          form_container.innerHTML = form;
          tense_container.appendChild(form_container);
        }
      }
    }
    resultContainer.focus();
  }
};

const verbInput = document.querySelector('.verb-input');
verbInput.value = 'карыны';
verbInput.addEventListener('keydown', enter_press);
const resultContainer = document.querySelector('.result');
const clear = document.querySelector('.clear-button');
clear.addEventListener('click', () => {
  verbInput.value = '';
  resultContainer.innerHTML = '';
  verbInput.focus();
});