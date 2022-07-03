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
      ['{}исько / уг {}иськы', '{}иськод / уд {}иськы', '{}е / уг {}ы', '{}иськом(ы) / ум {}иське', '{}иськоды / уд {}иське', '{}о / уг {}о'],
      ['{}исько / уг {}иськы', '{}иськод / уд {}иськы', '{}е / уг {}ьы', '{}иськом(ы) / ум {}иське', '{}иськоды / уд {}иське', '{}ё / уг {}ё'],
      ['{}ӥсько / уг {}ӥськы', '{}ӥськод / уд {}ӥськы', '{}э / уг {}ы', '{}ӥськом(ы) / ум {}ӥське', '{}ӥськоды / уд {}ӥське', '{}о / уг {}о'],
      ['{}сько / уг {}ськы', '{}ськод / уд {}ськы', '{} / уг {}', '{}ськом(ы) / ум {}ське', '{}ськоды / уд {}ське', '{}ло / уг {}ло'],
    ],
    'past': [
      ['{}и / ӧй {}ы', '{}ид / ӧд {}ы', '{}из / ӧз {}ы', '{}им(ы) / ӧм {}е', '{}иды / ӧд {}е', '{}изы / ӧз {}е'],
      ['{}и / ӧй {}ьы', '{}ид / ӧд {}ьы', '{}из / ӧз {}ьы', '{}им(ы) / ӧм {}е', '{}иды / ӧд {}е', '{}изы / ӧз {}е'],
      ['{}ӥ / ӧй {}ы', '{}ӥд / ӧд {}ы', '{}ӥз / ӧз {}ы', '{}ӥм(ы) / ӧм {}э', '{}ӥды / ӧд {}э', '{}ӥзы / ӧз {}э'],
      ['{}й / ӧй {}', '{}д / ӧд {}', '{}з / ӧз {}', '{}м(ы) / ӧм {}лэ', '{}ды / ӧд {}лэ', '{}зы / ӧз {}лэ']
    ],
    'future': [
      ['{}о / уг {}ы', '{}од / уд {}ы', '{}оз / уз {}ы', '{}ом(ы) / ум {}е', '{}оды / уд {}е', '{}озы / уз {}е'],
      ['{}ё / уг {}ьы', '{}ёд / уд {}ьы', '{}ёз / уз {}ьы', '{}ём(ы) / ум {}е', '{}ёды / уд {}е', '{}ёзы / уз {}е'],
      ['{}о / уг {}ы', '{}од / уд {}ы', '{}оз / уз {}ы', '{}ом(ы) / ум {}э', '{}оды / уд {}э', '{}озы / уз {}э'],
      ['{}ло / уг {}', '{}лод / уд {}', '{}лоз / уз {}', '{}лом(ы) / ум {}лэ', '{}лоды / уд {}лэ', '{}лозы / уз {}лэ']
    ]
  };
  let personal_pronounses = ['Мон', 'Тон', 'Со', 'Ми', 'Тӥ', 'Соос'];
  let result = [];
  tense_patterns[tense][pattern_num].forEach((pattern, idx) => {
    result.push(personal_pronounses[idx] + ' ' + pattern.replaceAll('{}', stem));
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