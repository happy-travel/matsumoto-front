import i18n from 'i18next';

// Temporary hardcode

window.getStarString = num => ({
    "1": "OneStar",
    "2": "TwoStars",
    "3": "ThreeStars",
    "4": "FourStars",
    "5": "FiveStars"
}[num] || "FiveStars");

window.getStarNumber = str => ({
    "OneStar": 1,
    "TwoStars": 2,
    "ThreeStars": 3,
    "FourStars": 4,
    "FiveStars": 5
}[str] || 5);

window.cityArray = [["ABZ","ABERDEEN","GB"],
                    ["EATB","EASTBOURNE","GB"],
                    ["LGW","LONDON - GATWICK","GB"],
                    ["LJU","LJUBLJANA","SL"],
                    ["LON","LONDON","GB"],
                    ["PORJ","PORTOROZ","SL"],
                    ["READ","READING","GB"],
                    ["RIX","RIGA","LV"],
                    ["ROGS","ROGASKA SLATINA","SL"],
                    ["SHEF","SHEFFIELD","GB"]];

window.getCityCode = city => {
    city = city.trim();
    city = city.toUpperCase();

    for (var i = 0; i < window.cityArray.length; i++)
        if (city == window.cityArray[i][1])
            return window.cityArray[i][0];

    return 'LON';
};

window.field = id => {
    var elem = window.document.getElementById(id);
    if (elem && elem.value)
        return elem.value;
    return '';
};












// End of temporary hardcode





i18n.init({
        resources: {
            en: {
                translations: {
                    "Home": "THE HOME",
                }
            },
            it: {
                translations: {
                    "Home": "HOME THE",
                }
            }
        },
        fallbackLng: 'en',
        debug: true,

        // have a common namespace used around the full app
        ns: ['translations'],
        defaultNS: 'translations',

        keySeparator: true,

        interpolation: {
            escapeValue: false,
            formatSeparator: ','
        },

        react: {
            wait: true
        }
    });

export default i18n;