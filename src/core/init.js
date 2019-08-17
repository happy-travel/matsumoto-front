import CommonStore from 'stores/common-store';
import API from 'core/api';

const init = () => {
    API.get({
        url: API.BASE_REGIONS,
        success: (result) => {
            CommonStore.setRegions(result);
        },
        after: () => {
            CommonStore.setInitialized(true);
        }
    });
    API.get({
        url: API.BASE_CURRENCIES,
        success: (result) => {
            CommonStore.setCurrencies(result);
        }
    });
};

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

window.field = id => {
    var elem = window.document.getElementById(id);
    if (elem && elem.value)
        return elem.value;
    return '';
};

window.serialize = (form) => {
	var result = {};
	for (var i = 0; i < form.elements.length; i++) {
		var field = form.elements[i];
		if (!field.id || ['button', 'submit', 'reset'].indexOf(field.type) >= 0)
		    continue;
		if (field.type == 'select-multiple')
			for (var j = 0; j < field.options.length; j++) {
				if (!field.options[j].selected)
				    continue;
				result[field.name] = field.options[j].value;
			}
		else
			result[field.name] = field.value;
		// todo : field.type == 'file', 'checkbox', 'radio'
	}
	return result;
};

window.addEventListener('mouseup', (event) => {
    var target = event.target;
	for (var i = 0; target && i < 30; i++){
	    if (target && target.classList && (target.classList.contains('dropdown') ||
                                           target.classList.contains('field'))) //todo: get safe
	        return;
	    target = target.parentNode;
	}
    CommonStore.setOpenDropdown(null);
});

export default init;