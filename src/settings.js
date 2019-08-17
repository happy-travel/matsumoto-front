let _ = Object.create(null);

_.default_culture = "en";

_.edo_url = "https://edo-api.dev.happytravel.com/";
_.edo_v1  = "/api/1.0";
_.edo     = (culture) => _.edo_url + culture + _.edo_v1;

export default _;