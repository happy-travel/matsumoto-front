import { API } from "core";

export const loadDirectPaymentServiceData = () => API.get({ external_url: API.DIRECT_LINK_PAY.SETTINGS });
