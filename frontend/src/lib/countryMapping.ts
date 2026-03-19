type CountryEntry = [code: string, fr: string, en: string];
type LanguageEntry = [flagCode: string, fr: string, en: string];

const COUNTRIES: CountryEntry[] = [
  ["AF", "Afghanistan", "Afghanistan"],
  ["ZA", "Afrique du Sud", "South Africa"],
  ["AL", "Albanie", "Albania"],
  ["DZ", "Algérie", "Algeria"],
  ["DE", "Allemagne", "Germany"],
  ["AD", "Andorre", "Andorra"],
  ["AO", "Angola", "Angola"],
  ["AG", "Antigua-et-Barbuda", "Antigua and Barbuda"],
  ["SA", "Arabie Saoudite", "Saudi Arabia"],
  ["AR", "Argentine", "Argentina"],
  ["AM", "Arménie", "Armenia"],
  ["AU", "Australie", "Australia"],
  ["AT", "Autriche", "Austria"],
  ["AZ", "Azerbaïdjan", "Azerbaijan"],
  ["BS", "Bahamas", "Bahamas"],
  ["BH", "Bahreïn", "Bahrain"],
  ["BD", "Bangladesh", "Bangladesh"],
  ["BB", "Barbade", "Barbados"],
  ["BE", "Belgique", "Belgium"],
  ["BZ", "Belize", "Belize"],
  ["BJ", "Bénin", "Benin"],
  ["BT", "Bhoutan", "Bhutan"],
  ["BY", "Biélorussie", "Belarus"],
  ["MM", "Birmanie", "Myanmar"],
  ["BO", "Bolivie", "Bolivia"],
  ["BA", "Bosnie-Herzégovine", "Bosnia and Herzegovina"],
  ["BW", "Botswana", "Botswana"],
  ["BR", "Brésil", "Brazil"],
  ["BN", "Brunéi", "Brunei"],
  ["BG", "Bulgarie", "Bulgaria"],
  ["BF", "Burkina Faso", "Burkina Faso"],
  ["BI", "Burundi", "Burundi"],
  ["CV", "Cabo Verde", "Cape Verde"],
  ["KH", "Cambodge", "Cambodia"],
  ["CM", "Cameroun", "Cameroon"],
  ["CA", "Canada", "Canada"],
  ["CL", "Chili", "Chile"],
  ["CN", "Chine", "China"],
  ["CY", "Chypre", "Cyprus"],
  ["CO", "Colombie", "Colombia"],
  ["KM", "Comores", "Comoros"],
  ["CG", "Congo", "Congo"],
  ["KP", "Corée du Nord", "North Korea"],
  ["KR", "Corée du Sud", "South Korea"],
  ["CR", "Costa Rica", "Costa Rica"],
  ["CI", "Côte d'Ivoire", "Ivory Coast"],
  ["HR", "Croatie", "Croatia"],
  ["CU", "Cuba", "Cuba"],
  ["DK", "Danemark", "Denmark"],
  ["DJ", "Djibouti", "Djibouti"],
  ["DM", "Dominique", "Dominica"],
  ["EG", "Égypte", "Egypt"],
  ["AE", "Émirats Arabes Unis", "United Arab Emirates"],
  ["EC", "Équateur", "Ecuador"],
  ["ER", "Érythrée", "Eritrea"],
  ["ES", "Espagne", "Spain"],
  ["EE", "Estonie", "Estonia"],
  ["SZ", "Eswatini", "Eswatini"],
  ["US", "États-Unis", "United States"],
  ["ET", "Éthiopie", "Ethiopia"],
  ["FJ", "Fidji", "Fiji"],
  ["FI", "Finlande", "Finland"],
  ["FR", "France", "France"],
  ["GA", "Gabon", "Gabon"],
  ["GM", "Gambie", "Gambia"],
  ["GE", "Géorgie", "Georgia"],
  ["GH", "Ghana", "Ghana"],
  ["GR", "Grèce", "Greece"],
  ["GD", "Grenade", "Grenada"],
  ["GT", "Guatemala", "Guatemala"],
  ["GN", "Guinée", "Guinea"],
  ["GW", "Guinée-Bissau", "Guinea-Bissau"],
  ["GQ", "Guinée équatoriale", "Equatorial Guinea"],
  ["GY", "Guyana", "Guyana"],
  ["HT", "Haïti", "Haiti"],
  ["HN", "Honduras", "Honduras"],
  ["HU", "Hongrie", "Hungary"],
  ["MH", "Îles Marshall", "Marshall Islands"],
  ["SB", "Îles Salomon", "Solomon Islands"],
  ["IN", "Inde", "India"],
  ["ID", "Indonésie", "Indonesia"],
  ["IQ", "Irak", "Iraq"],
  ["IR", "Iran", "Iran"],
  ["IE", "Irlande", "Ireland"],
  ["IS", "Islande", "Iceland"],
  ["IL", "Israël", "Israel"],
  ["IT", "Italie", "Italy"],
  ["JM", "Jamaïque", "Jamaica"],
  ["JP", "Japon", "Japan"],
  ["JO", "Jordanie", "Jordan"],
  ["KZ", "Kazakhstan", "Kazakhstan"],
  ["KE", "Kenya", "Kenya"],
  ["KG", "Kirghizistan", "Kyrgyzstan"],
  ["KI", "Kiribati", "Kiribati"],
  ["KW", "Koweït", "Kuwait"],
  ["LA", "Laos", "Laos"],
  ["LS", "Lesotho", "Lesotho"],
  ["LV", "Lettonie", "Latvia"],
  ["LB", "Liban", "Lebanon"],
  ["LR", "Liberia", "Liberia"],
  ["LY", "Libye", "Libya"],
  ["LI", "Liechtenstein", "Liechtenstein"],
  ["LT", "Lituanie", "Lithuania"],
  ["LU", "Luxembourg", "Luxembourg"],
  ["MK", "Macédoine du Nord", "North Macedonia"],
  ["MG", "Madagascar", "Madagascar"],
  ["MY", "Malaisie", "Malaysia"],
  ["MW", "Malawi", "Malawi"],
  ["MV", "Maldives", "Maldives"],
  ["ML", "Mali", "Mali"],
  ["MT", "Malte", "Malta"],
  ["MA", "Maroc", "Morocco"],
  ["MU", "Maurice", "Mauritius"],
  ["MR", "Mauritanie", "Mauritania"],
  ["MX", "Mexique", "Mexico"],
  ["FM", "Micronésie", "Micronesia"],
  ["MD", "Moldavie", "Moldova"],
  ["MC", "Monaco", "Monaco"],
  ["MN", "Mongolie", "Mongolia"],
  ["ME", "Monténégro", "Montenegro"],
  ["MZ", "Mozambique", "Mozambique"],
  ["NA", "Namibie", "Namibia"],
  ["NR", "Nauru", "Nauru"],
  ["NP", "Népal", "Nepal"],
  ["NI", "Nicaragua", "Nicaragua"],
  ["NE", "Niger", "Niger"],
  ["NG", "Nigéria", "Nigeria"],
  ["NO", "Norvège", "Norway"],
  ["NZ", "Nouvelle-Zélande", "New Zealand"],
  ["OM", "Oman", "Oman"],
  ["UG", "Ouganda", "Uganda"],
  ["UZ", "Ouzbékistan", "Uzbekistan"],
  ["PK", "Pakistan", "Pakistan"],
  ["PW", "Palaos", "Palau"],
  ["PS", "Palestine", "Palestine"],
  ["PA", "Panama", "Panama"],
  ["PG", "Papouasie-Nouvelle-Guinée", "Papua New Guinea"],
  ["PY", "Paraguay", "Paraguay"],
  ["NL", "Pays-Bas", "Netherlands"],
  ["PE", "Pérou", "Peru"],
  ["PH", "Philippines", "Philippines"],
  ["PL", "Pologne", "Poland"],
  ["PT", "Portugal", "Portugal"],
  ["QA", "Qatar", "Qatar"],
  ["CF", "République centrafricaine", "Central African Republic"],
  ["CG", "République du Congo", "Republic of the Congo"],
  ["DO", "République Dominicaine", "Dominican Republic"],
  ["RO", "Roumanie", "Romania"],
  ["GB", "Royaume-Uni", "United Kingdom"],
  ["RU", "Russie", "Russia"],
  ["RW", "Rwanda", "Rwanda"],
  ["KN", "Saint-Christophe-et-Niévès", "Saint Kitts and Nevis"],
  ["SM", "Saint-Marin", "San Marino"],
  ["VC", "Saint-Vincent-et-les-Grenadines", "Saint Vincent and the Grenadines"],
  ["LC", "Sainte-Lucie", "Saint Lucia"],
  ["SV", "Salvador", "El Salvador"],
  ["WS", "Samoa", "Samoa"],
  ["ST", "Sao Tomé-et-Principe", "São Tomé and Príncipe"],
  ["SN", "Sénégal", "Senegal"],
  ["RS", "Serbie", "Serbia"],
  ["SC", "Seychelles", "Seychelles"],
  ["SL", "Sierra Leone", "Sierra Leone"],
  ["SG", "Singapour", "Singapore"],
  ["SK", "Slovaquie", "Slovakia"],
  ["SI", "Slovénie", "Slovenia"],
  ["SO", "Somalie", "Somalia"],
  ["SD", "Soudan", "Sudan"],
  ["SS", "Soudan du Sud", "South Sudan"],
  ["LK", "Sri Lanka", "Sri Lanka"],
  ["SE", "Suède", "Sweden"],
  ["CH", "Suisse", "Switzerland"],
  ["SR", "Suriname", "Suriname"],
  ["SY", "Syrie", "Syria"],
  ["TJ", "Tadjikistan", "Tajikistan"],
  ["TZ", "Tanzanie", "Tanzania"],
  ["TD", "Tchad", "Chad"],
  ["CZ", "Tchéquie", "Czechia"],
  ["TH", "Thaïlande", "Thailand"],
  ["TL", "Timor oriental", "East Timor"],
  ["TG", "Togo", "Togo"],
  ["TO", "Tonga", "Tonga"],
  ["TT", "Trinité-et-Tobago", "Trinidad and Tobago"],
  ["TN", "Tunisie", "Tunisia"],
  ["TM", "Turkménistan", "Turkmenistan"],
  ["TR", "Turquie", "Turkey"],
  ["TV", "Tuvalu", "Tuvalu"],
  ["UA", "Ukraine", "Ukraine"],
  ["UY", "Uruguay", "Uruguay"],
  ["VU", "Vanuatu", "Vanuatu"],
  ["VA", "Vatican", "Vatican City"],
  ["VE", "Venezuela", "Venezuela"],
  ["VN", "Vietnam", "Vietnam"],
  ["YE", "Yémen", "Yemen"],
  ["ZM", "Zambie", "Zambia"],
  ["ZW", "Zimbabwe", "Zimbabwe"],
];

const LANGUAGES: LanguageEntry[] = [
  ["FR", "Français", "French"],
  ["GB", "Anglais", "English"],
  ["ES", "Espagnol", "Spanish"],
  ["PT", "Portugais", "Portuguese"],
  ["DE", "Allemand", "German"],
  ["IT", "Italien", "Italian"],
  ["NL", "Néerlandais", "Dutch"],
  ["LU", "Luxembourgeois", "Luxembourgish"],
  ["DK", "Danois", "Danish"],
  ["SE", "Suédois", "Swedish"],
  ["NO", "Norvégien", "Norwegian"],
  ["IS", "Islandais", "Icelandic"],
  ["FI", "Finnois", "Finnish"],
  ["EE", "Estonien", "Estonian"],
  ["LV", "Letton", "Latvian"],
  ["LT", "Lituanien", "Lithuanian"],
  ["PL", "Polonais", "Polish"],
  ["CZ", "Tchèque", "Czech"],
  ["SK", "Slovaque", "Slovak"],
  ["SI", "Slovène", "Slovenian"],
  ["HU", "Hongrois", "Hungarian"],
  ["RO", "Roumain", "Romanian"],
  ["BG", "Bulgare", "Bulgarian"],
  ["HR", "Croate", "Croatian"],
  ["RS", "Serbe", "Serbian"],
  ["BA", "Bosnien", "Bosnian"],
  ["ME", "Monténégrin", "Montenegrin"],
  ["MK", "Macédonien", "Macedonian"],
  ["AL", "Albanais", "Albanian"],
  ["GR", "Grec", "Greek"],
  ["MT", "Maltais", "Maltese"],
  ["IE", "Irlandais", "Irish"],
  ["GB", "Gallois", "Welsh"],
  ["ES", "Basque", "Basque"],
  ["ES", "Catalan", "Catalan"],
  ["ES", "Galicien", "Galician"],
  ["UA", "Ukrainien", "Ukrainian"],
  ["BY", "Biélorusse", "Belarusian"],
  ["RU", "Russe", "Russian"],
  ["AM", "Arménien", "Armenian"],
  ["GE", "Géorgien", "Georgian"],
  ["AZ", "Azéri", "Azerbaijani"],
  ["KZ", "Kazakh", "Kazakh"],
  ["KG", "Kirghize", "Kyrgyz"],
  ["TJ", "Tadjik", "Tajik"],
  ["TM", "Turkmène", "Turkmen"],
  ["UZ", "Ouzbek", "Uzbek"],
  ["MN", "Mongol", "Mongolian"],
  ["TR", "Turc", "Turkish"],
  ["TR", "Kurde", "Kurdish"],
  ["SA", "Arabe", "Arabic"],
  ["IL", "Hébreu", "Hebrew"],
  ["IR", "Persan", "Persian"],
  ["AF", "Pachto", "Pashto"],
  ["AF", "Dari", "Dari"],
  ["PK", "Ourdou", "Urdu"],
  ["IN", "Hindi", "Hindi"],
  ["BD", "Bengali", "Bengali"],
  ["IN", "Pendjabi", "Punjabi"],
  ["IN", "Gujarati", "Gujarati"],
  ["IN", "Marathi", "Marathi"],
  ["IN", "Tamoul", "Tamil"],
  ["IN", "Télougou", "Telugu"],
  ["IN", "Kannada", "Kannada"],
  ["IN", "Malayalam", "Malayalam"],
  ["NP", "Népalais", "Nepali"],
  ["LK", "Singhalais", "Sinhala"],
  ["MM", "Birman", "Burmese"],
  ["TH", "Thaï", "Thai"],
  ["LA", "Lao", "Lao"],
  ["KH", "Khmer", "Khmer"],
  ["VN", "Vietnamien", "Vietnamese"],
  ["ID", "Indonésien", "Indonesian"],
  ["MY", "Malais", "Malay"],
  ["PH", "Tagalog", "Tagalog"],
  ["KR", "Coréen", "Korean"],
  ["JP", "Japonais", "Japanese"],
  ["CN", "Mandarin", "Mandarin"],
  ["HK", "Cantonais", "Cantonese"],
  ["CN", "Tibétain", "Tibetan"],
  ["TZ", "Swahili", "Swahili"],
  ["ET", "Amharique", "Amharic"],
  ["ER", "Tigrigna", "Tigrinya"],
  ["SO", "Somali", "Somali"],
  ["NG", "Haoussa", "Hausa"],
  ["NG", "Yoruba", "Yoruba"],
  ["NG", "Igbo", "Igbo"],
  ["ZA", "Zoulou", "Zulu"],
  ["ZA", "Xhosa", "Xhosa"],
  ["ZA", "Afrikaans", "Afrikaans"],
  ["SN", "Wolof", "Wolof"],
  ["SN", "Peul", "Fulani"],
  ["ML", "Bambara", "Bambara"],
  ["CD", "Lingala", "Lingala"],
  ["RW", "Kinyarwanda", "Kinyarwanda"],
  ["BI", "Kirundi", "Kirundi"],
  ["ZW", "Shona", "Shona"],
  ["MG", "Malgache", "Malagasy"],
  ["HT", "Créole haïtien", "Haitian Creole"],
  ["MU", "Créole mauricien", "Mauritian Creole"],
  ["WS", "Samoan", "Samoan"],
  ["TO", "Tongan", "Tongan"],
  ["FJ", "Fidjien", "Fijian"],
  ["NZ", "Maori", "Maori"],
  ["VU", "Bislama", "Bislama"],
  ["PG", "Tok Pisin", "Tok Pisin"],
  ["CA", "Inuktitut", "Inuktitut"],
  ["US", "Navajo", "Navajo"],
  ["PE", "Quechua", "Quechua"],
  ["BO", "Aymara", "Aymara"],
  ["PY", "Guarani", "Guarani"],
];

// ─────────────────────────────────────────────────────────────
//  Helpers internes
// ─────────────────────────────────────────────────────────────

const normalize = (v: string) =>
  String(v)
    .normalize("NFC")
    .replace(/[\u2018\u2019`´]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

function buildLookup<T>(
  entries: T[],
  keyFn: (e: T) => string,
  valFn: (e: T) => string
): Map<string, string> {
  const map = new Map<string, string>();
  for (const e of entries) {
    const key = normalize(keyFn(e));
    if (!map.has(key)) map.set(key, valFn(e)); // premier trouvé gagne
  }
  return map;
}

// ─────────────────────────────────────────────────────────────
//  PAYS — exports publics
// ─────────────────────────────────────────────────────────────

export const FR_COUNTRY_NAMES = COUNTRIES.map(([, fr]) => fr);
export const EN_COUNTRY_NAMES = COUNTRIES.map(([, , en]) => en);

const countryCodeByFr = buildLookup(
  COUNTRIES,
  ([, fr]) => fr,
  ([code]) => code
);
const countryCodeByEn = buildLookup(
  COUNTRIES,
  ([, , en]) => en,
  ([code]) => code
);

export function getCountryCode(name: string): string | null {
  const key = normalize(name);
  return countryCodeByFr.get(key) ?? countryCodeByEn.get(key) ?? null;
}

// ─────────────────────────────────────────────────────────────
//  LANGUES — exports publics
// ─────────────────────────────────────────────────────────────

export const FR_LANGUAGE_NAMES = LANGUAGES.map(([, fr]) => fr);
export const EN_LANGUAGE_NAMES = LANGUAGES.map(([, , en]) => en);

const flagCodeByFrLang = buildLookup(
  LANGUAGES,
  ([, fr]) => fr,
  ([flag]) => flag
);
const flagCodeByEnLang = buildLookup(
  LANGUAGES,
  ([, , en]) => en,
  ([flag]) => flag
);

export function getLanguageFlagCode(name: string): string | null {
  const key = normalize(name);
  return flagCodeByFrLang.get(key) ?? flagCodeByEnLang.get(key) ?? null;
}

/** Traduit un nom de langue vers "fr" ou "en". */
export function translateLanguageName(
  name: string,
  targetLang: "fr" | "en"
): string {
  const key = normalize(name);

  if (targetLang === "fr") {
    // Déjà en FR ?
    const idxFr = LANGUAGES.findIndex((e) => normalize(e[1]) === key);
    if (idxFr !== -1) return LANGUAGES[idxFr][1];
    // Cherche côté EN
    const idxEn = LANGUAGES.findIndex((e) => normalize(e[2]) === key);
    return idxEn !== -1 ? LANGUAGES[idxEn][1] : name;
  }

  // Déjà en EN ?
  const idxEn = LANGUAGES.findIndex((e) => normalize(e[2]) === key);
  if (idxEn !== -1) return LANGUAGES[idxEn][2];
  // Cherche côté FR
  const idxFr = LANGUAGES.findIndex((e) => normalize(e[1]) === key);
  return idxFr !== -1 ? LANGUAGES[idxFr][2] : name;
}