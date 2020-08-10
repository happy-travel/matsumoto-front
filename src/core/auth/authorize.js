import settings from "settings";
import { UserManager } from "oidc-client";

let host = settings.auth_callback_host;

window.auth_host = host;

const config = {
    authority: settings.identity_url,
    post_logout_redirect_uri: host,
    redirect_uri: host + "/auth/callback",
    silent_redirect_uri: host + "/auth/silent",
    client_id: settings.auth_client_id,
    response_type: "code",
    scope: "edo openid email",
    automaticSilentRenew: true,
    loadUserInfo: true,
    filterProtocolClaims: true,
    accessTokenExpiringNotificationTime: 4
};

export default new UserManager(config);
