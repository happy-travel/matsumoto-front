import settings from "settings";
import { UserManager } from "oidc-client";

let host = settings.auth_callback_host;

window.auth_host = host;

const config = {
    authority: settings.identity_url,
    client_id: settings.identity_client_id,
    scope: settings.identity_scope,
    post_logout_redirect_uri: host,
    redirect_uri: host + "/auth/callback",
    silent_redirect_uri: host + "/auth/silent",
    response_type: "code",
    automaticSilentRenew: true,
    loadUserInfo: true,
    filterProtocolClaims: true,
    accessTokenExpiringNotificationTime: 4
};

export default new UserManager(config);
