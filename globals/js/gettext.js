/**
 * Created by Purexo on 20/06/2017.
 *
 * @see http://www.unicode.org/cldr/charts/31/supplemental/language_plural_rules.html
 */
const gettext = (function (background) {
  const RANGE_TEXT_SEPARATOR = '-';
  
  const LANGS = {
    fr: 'fr',
    en: 'en',
  };
  
  const TYPES = {
    CARDINAL: 'cardinal',
    ORDINAL: 'ordinal',
    RANGE: 'range',
    RANGE_TO_CARDINAL_CATEGORY: 'range-cardinal-category'
  };
  
  const CATEGORIES = {
    ONE: 'one',
    TWO: 'two',
    FEW: 'few',
    OTHER: 'other',
    ONE_ONE: 'one+one',
    ONE_OTHER: 'one+other',
    OTHER_ONE: 'other+one',
    OTHER_OTHER: 'other+other',
  };
  
  const PLURAL = {
    /**
     * French Rules
     */
    [LANGS.fr]: {
      [TYPES.CARDINAL](count) {
          count = Math.abs(count);
          
          return count <= 1 ? CATEGORIES.ONE : CATEGORIES.OTHER;
      },
  
      [TYPES.ORDINAL](count) {
        count = Math.abs(count);
  
        return count === 1 ? CATEGORIES.ONE : CATEGORIES.OTHER;
      },
      
      [TYPES.RANGE](range) {
        let [a, b] = range;
        a = Math.abs(Number(a));
        b = Math.abs(Number(b));
  
        const a_cardinality = PLURAL[LANGS.FR][TYPES.CARDINAL](a);
        const b_cardinality = PLURAL[LANGS.FR][TYPES.CARDINAL](b);
        
        if (a_cardinality === CATEGORIES.ONE && b_cardinality === CATEGORIES.ONE) {
          return CATEGORIES.ONE_ONE;
        }
        
        if (a_cardinality === CATEGORIES.ONE && b_cardinality === CATEGORIES.OTHER) {
          return CATEGORIES.ONE_OTHER;
        }
  
        if (a_cardinality === CATEGORIES.OTHER && b_cardinality === CATEGORIES.OTHER) {
          return CATEGORIES.OTHER_OTHER;
        }
      },
      
      [TYPES.RANGE_TO_CARDINAL_CATEGORY]: {
        [CATEGORIES.ONE_ONE]: CATEGORIES.ONE,
        [CATEGORIES.ONE_OTHER]: CATEGORIES.OTHER,
        [CATEGORIES.OTHER_OTHER]: CATEGORIES.OTHER,
      }
    },
  
    /**
     * English Rules
     */
    [LANGS.en]: {
      [TYPES.CARDINAL](count) {
        count = Math.abs(count);
  
        return count === 1 ? CATEGORIES.ONE : CATEGORIES.OTHER;
      },
  
      [TYPES.ORDINAL](count) {
        count = Math.abs(count);
        
        if ((count % 10 === 1) && (count % 100 !== 11)) {
          return CATEGORIES.ONE;
        }
        
        if ((count % 10 === 2) && (count % 100 !== 12)) {
          return CATEGORIES.TWO;
        }
        
        if ((count % 10 === 3) && (count % 100 !== 13)) {
          return CATEGORIES.FEW;
        }
        
        return CATEGORIES.OTHER;
      },
  
      [TYPES.RANGE](range) {
        let [a, b] = range;
        a = Math.abs(Number(a));
        b = Math.abs(Number(b));
        
        const a_cardinality = PLURAL[LANGS.EN][TYPES.CARDINAL](a);
        const b_cardinality = PLURAL[LANGS.EN][TYPES.CARDINAL](b);
  
        if (a_cardinality === CATEGORIES.ONE && b_cardinality === CATEGORIES.OTHER) {
          return CATEGORIES.ONE_OTHER;
        }
  
        if (a_cardinality === CATEGORIES.OTHER && b_cardinality === CATEGORIES.ONE) {
          return CATEGORIES.OTHER_ONE;
        }
  
        if (a_cardinality === CATEGORIES.OTHER && b_cardinality === CATEGORIES.OTHER) {
          return CATEGORIES.OTHER_OTHER;
        }
      },
  
      [TYPES.RANGE_TO_CARDINAL_CATEGORY]: {
        [CATEGORIES.ONE_OTHER]: CATEGORIES.OTHER,
        [CATEGORIES.OTHER_ONE]: CATEGORIES.OTHER,
        [CATEGORIES.OTHER_OTHER]: CATEGORIES.OTHER,
      }
    }
  };
  
  let lang = background.browser.i18n.getUILanguage().slice(0, 2).toLowerCase();
  if (Object.getOwnPropertyNames(LANGS).map(code => LANGS[code]).indexOf(lang) === -1) {
    lang = LANGS.en;
  }
  
  function gettext(messageName, substitutions, {count=undefined, type=undefined}={}) {
    if (type) {
      let categorie;
      if (type !== TYPES.RANGE) {
        categorie = PLURAL[lang][type](count);
        substitutions.count = count;
      } else {
        categorie = PLURAL[lang][TYPES.RANGE_TO_CARDINAL_CATEGORY](PLURAL[lang][type](count));
        substitutions.start_range = count[0];
        substitutions.end_range = count[1];
      }
      messageName = `${messageName}_${type}_${categorie}`;
    }
  
    return background.browser.i18n.getMessage(messageName, substitutions);
  }
  
  gettext.LANGS = LANGS;
  gettext.TYPES = TYPES;
  gettext.CATEGORIES = CATEGORIES;
  gettext.PLURAL = PLURAL;
  gettext.RANGE_TEXT_SEPARATOR = RANGE_TEXT_SEPARATOR;
  
  return gettext;
})();