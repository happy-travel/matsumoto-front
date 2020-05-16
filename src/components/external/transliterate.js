let BWC = {}; // Buckwalter Transliteration

class BWChar {
    constructor(ar, bw) { this.ar = ar; this.bw = bw; }
}

class BWMaptable {

    constructor(from, to, table) {
        this.from = from;
        this.to = to;
        this.table = table;
    }

    name() { return this.from + "2" + this.to; }
}


BWC.defaultChar = "?";

BWC.chartable = [
    new BWChar("ا", "A"), // bare alif
    new BWChar("ب", "b"),
    new BWChar("ت", "t"),
    new BWChar("ث", "v"),
    new BWChar("ج", "j"),
    new BWChar("ح", "H"),
    new BWChar("خ", "x"),
    new BWChar("د", "d"), // dal
    new BWChar("ذ", "*"),
    new BWChar("ر", "r"),
    new BWChar("ز", "z"),
    new BWChar("س", "s"),
    new BWChar("ش", "$"),
    new BWChar("ص", "S"),
    new BWChar("ض", "D"),
    new BWChar("ط", "T"),
    new BWChar("ظ", "Z"),
    new BWChar("ع", "E"),
    new BWChar("غ", "g"),
    new BWChar("ف", "f"),
    new BWChar("ق", "q"),
    new BWChar("ك", "k"),
    new BWChar("ل", "l"),
    new BWChar("م", "m"),
    new BWChar("ن", "n"),
    new BWChar("ه", "h"),
    new BWChar("و", "w"),
    new BWChar("ي", "y"),
    new BWChar("ة", "p"), //teh marbuta

    new BWChar("\u064E", "a"), // fatha
    new BWChar("\u064f", "u"), // damma
    new BWChar("\u0650", "i"), // kasra
    new BWChar("\u064B", "F"), // fathatayn
    new BWChar("\u064C", "N"), // dammatayn
    new BWChar("\u064D", "K"), // kasratayn
    new BWChar("\u0651", "~"), // shadda
    new BWChar("\u0652", "o"), // sukun

    new BWChar("\u0621", "'"), // lone hamza
    new BWChar("\u0623", ">"), // hamza on alif
    new BWChar("\u0625", "<"), // hamza below alif
    new BWChar("\u0624", "&"), // hamza on wa
    new BWChar("\u0626", "}"), // hamza on ya

    new BWChar("\u0622", "|"), // madda on alif
    new BWChar("\u0671", "{"), // alif al-wasla
    new BWChar("\u0670", "`"), // dagger alif
    new BWChar("\u0649", "Y"), // alif maqsura

    // punctuation
    new BWChar("\u060C", ","),
    new BWChar("\u061B", ";"),
    new BWChar("\u061F", "?"),

    // http://www.qamus.org/transliteration.htm
    new BWChar("\u067e", "P"), // peh
    new BWChar("\u0686", "J"), // tcheh
    new BWChar("\u06a4", "V"), // veh
    new BWChar("\u06af", "G"), // gaf
    //new BWChar("\u0640", "_"), // tatweel
];

BWC.post_normalise_bw = function(s) {
    return s.replace(/([aiuoFKN])(~)/g, "$2$1", s);
};

BWC.post_normalise_ar = function(s) {
    let res = s.normalize('NFC');
    return res;
};

BWC.pre_normalise_ar = function(s) {
    let res = s;
    res = res.replace('\uFEAA','\u062F');   // DAL FINAL FORM => DAL
    res = res.replace("\u06BE", "\u0647");  // HEH DOACHASHMEE => HEH
    res = res.replace('\u200F', '');         // RTL MARK
    return res;
};

BWC.pre_normalise_bw = function(s) {
    return s;
};

BWC.post_normalise = function(outputName, orth) {
    if (outputName === "bw")
        return BWC.post_normalise_bw(orth);
    else
        return BWC.post_normalise_ar(orth);
};

BWC.pre_normalise = function(inputName, orth) {
    if (inputName === "bw")
        return BWC.pre_normalise_bw(orth);
    else
        return BWC.pre_normalise_ar(orth);
};

BWC.makeA2BMap = function() {
    let map = {};
    for (let i = 0; i < BWC.chartable.length; i++) {
        let ch = BWC.chartable[i];
        map[ch.ar] = ch.bw;
    }
    return new BWMaptable("ar", "bw", map);
};

BWC.makeB2AMap = function() {
    let map = {};
    for (let i = 0; i < BWC.chartable.length; i++) {
        let ch = BWC.chartable[i];
        map[ch.bw] = ch.ar;
    }
    return new BWMaptable("bw", "ar", map);
};

BWC.a2bMap = BWC.makeA2BMap();
BWC.b2aMap = BWC.makeB2AMap();

class BWResult {
    constructor(output) { this.output = output; }
}

BWC.convert = function(maptable, input) {
    input = BWC.pre_normalise(maptable.from, input);
    let res = [];
    for (let i = 0; i < input.length; i++) {
        let sym = input[i],
            sym2 = maptable.table[sym];

        if (sym.length > 0 && (sym2 === undefined || sym2 === null))
            res.push(sym);
        else
            res.push(sym2);
    }

    let mapped = res.join("");
    mapped = BWC.post_normalise(maptable.to, mapped);

    return new BWResult(mapped);
};

BWC.b2a = function(s) {
    return BWC.convert(BWC.b2aMap, s, true).output;
};

BWC.a2b = function(s) {
    return BWC.convert(BWC.a2bMap, s, true).output;
};

let cyr_to_latin = str => {
    if (!str) return "";
    var ru = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i',
        'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh',
        'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya'
    }, n_str = [];

    str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');

    for ( var i = 0; i < str.length; ++i ) {
        n_str.push(
            ru[ str[i] ]
            || ru[ str[i].toLowerCase() ] == undefined && str[i]
            || ru[ str[i].toLowerCase() ].replace(/^(.)/, function ( match ) { return match.toUpperCase() })
        );
    }

    return n_str.join('');
};

export default event => {
    event.target.value = cyr_to_latin(BWC.a2b(event.target.value)) || "";
};
