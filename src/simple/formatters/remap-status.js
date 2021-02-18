export const remapStatus = (status = "") => (
    {
        "WaitingForResponse" : "Awaiting Final Confirmation"
    }[status] || status.replace(/([A-Z])/g, " $1").trim());
