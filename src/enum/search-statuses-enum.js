const statuses = {
    STARTED: "local_Started",
    CREATED: "local_Created",
    PARTIALLY_COMPLETED: "PartiallyCompleted",
    PENDING: "Pending",
    RUNNING: "Running",
    COMPLETED: "Completed",
    FAILED: "Failed",
    TIMEOUT: "local_Timeout",
    BROKEN: "local_Broken"
};

const finishedStatuses = [statuses.COMPLETED, statuses.FAILED, statuses.TIMEOUT, statuses.BROKEN];
const readyToLoadStatuses = [statuses.PARTIALLY_COMPLETED, statuses.COMPLETED, statuses.FAILED];
const pendingStatuses = [statuses.PENDING, statuses.RUNNING, statuses.PARTIALLY_COMPLETED, statuses.CREATED];
const noResponseStatuses = [statuses.STARTED, statuses.CREATED];

export const SEARCH_STATUSES = {
    ...statuses,
    isFinished: (status) => finishedStatuses.includes(status),
    isReadyToLoad: (status) => readyToLoadStatuses.includes(status),
    isPending: (status) => pendingStatuses.includes(status),
    isHasResponse: (status) => !!status && !noResponseStatuses.includes(status),
};
