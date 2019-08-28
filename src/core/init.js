import UI from "stores/ui-store";
import { API } from "core";
import Authorize from "./auth/authorize";

const init = () => {
    API.get({
        url: API.USER,
        success: (result) => {
            if ("Could not find customer" == result.detail) {
                var nextURL = "https://dev.happytravel.com/signup/user";
                if ("localhost" == window.location.hostname)
                    nextURL = "http://localhost:4000/signup/user";

                if (window.location.href.indexOf("/signup/") < 0)
                    window.location.href = nextURL;
                //todo: make normal redirect
            }
            if (result?.email)
                UI.setUser(result);
        },
        error: () => {
            Authorize.signinRedirect();
        }
    });
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
    
    window.addEventListener("mouseup", (event) => {
        var target = event.target;
        for (var i = 0; target && i < 30; i++){
            if (target?.classList && (target.classList.contains("dropdown") || target.classList.contains("field")))
                return;
            target = target.parentNode;
        }
        UI.setOpenDropdown(null);
    });

};

export default init;