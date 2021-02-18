import { createBrowserHistory } from "history";
const reactHistory = createBrowserHistory();

export default reactHistory;

export const redirect = (path) => reactHistory.push(path);
