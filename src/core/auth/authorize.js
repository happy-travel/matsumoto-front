import { UserManager } from "oidc-client";

let host = "https://dev.happytravel.com";

if ("localhost" == window.location.hostname)
    host = "http://localhost:4000";

const config = {
    authority: "https://identity.dev.happytravel.com/",
    post_logout_redirect_uri: host,
    redirect_uri: host + "/auth/callback",
    silent_redirect_uri: host + "/auth/silent",
    client_id: "client",
    response_type: "code",
    scope: "edo openid",
    automaticSilentRenew: true,
    loadUserInfo: true,
    filterProtocolClaims: true,
    accessTokenExpiringNotificationTime: 4
};

export default new UserManager(config);