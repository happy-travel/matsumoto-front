import { windowLocalStorage } from "core/misc/window-storage";
import settings from "settings";

const getLocale = () => windowLocalStorage.get("locale") || settings.default_culture;

export default getLocale;
