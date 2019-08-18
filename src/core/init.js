import UI from 'stores/ui-store';
import { API } from "core";

const init = () => {
    API.get({
        url: API.BASE_REGIONS,
        success: (result) =>
            UI.setRegions(result),
        after: () =>
            UI.setInitialized(true)
    });
    API.get({
        url: API.BASE_CURRENCIES,
        success: (result) =>
            UI.setCurrencies(result)
    });
};

window.getStarString = num => ({ //todo: rewrite this
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

window.field = id => {
    var elem = window.document.getElementById(id);
    if (elem && elem.value)
        return elem.value;
    return '';
};

window.addEventListener('mouseup', (event) => {
    var target = event.target;
	for (var i = 0; target && i < 30; i++){
	    if (target?.classList && (target.classList.contains('dropdown') || target.classList.contains('field')))
	        return;
	    target = target.parentNode;
	}
    UI.setOpenDropdown(null);
});

export default init;