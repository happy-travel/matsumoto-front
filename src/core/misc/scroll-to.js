export const scrollTo = (element, to, duration = 600) => {
    if (element?.scrollTop === undefined)
        return;
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20,
        easeInOutQuad = function (t, b, c, d) {
            t /= d/2;
            if (t < 1)
                return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        },
        animateScroll = () => {
            currentTime += increment;
            element.scrollTop = easeInOutQuad(currentTime, start, change, duration);
            if (currentTime < duration)
                setTimeout(animateScroll, increment);
        };
    animateScroll();
};
