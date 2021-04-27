import { getParams } from "core";
import { windowSessionStorage } from "core/misc/window-storage";

const INVITATION_KEY = "_auth__invCode";

export const initInvite = () => {
    if (window.location.pathname.length > 1) // not index page
        return;

    const params = getParams();
    if (!params.code) // not after auth
        return;

    if (params.invCode)
        windowSessionStorage.set(INVITATION_KEY, params.invCode);
};

export const forgetInvite = () => windowSessionStorage.remove(INVITATION_KEY);

export const getInvite = () => windowSessionStorage.get(INVITATION_KEY);
