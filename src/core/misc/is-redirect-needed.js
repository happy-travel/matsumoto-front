const noRedirectPages =
    ["/contact", "/terms", "/privacy", "/about", "/signup/", "/pay", "/logout"];

export default () => noRedirectPages.every(
    item => window.location.href.indexOf(item) == -1
);