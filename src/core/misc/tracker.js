import { windowSessionStorage } from "../misc/window-storage";

const TRACKING_KEY = "_lastVisitedPage",
      AUTH_PATH = "/auth/",
      EXCLUDED_PATHS = [AUTH_PATH, "/signup/", "/logout"],

      authRoutes = () => window.location.href.indexOf(AUTH_PATH) >= 0,
      routeThatCanBeLastVisited = () => EXCLUDED_PATHS.every(item => window.location.href.indexOf(item) == -1);

export const lastPage = () => windowSessionStorage.get(TRACKING_KEY) || "/";

export default () => {
    if (authRoutes()) return;

    windowSessionStorage.set(
        TRACKING_KEY,
        routeThatCanBeLastVisited()
            ? window.location.pathname + window.location.search
            : "/"
    );
};
