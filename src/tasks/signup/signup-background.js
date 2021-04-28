export const getAuthBlockStyle = () => {
    const dayOfYear = () => Math.round((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 1000 / 60 / 60 / 24);
    const backgrounds = ["bg01.svg", "bg02.svg", "bg03.svg", "bg04.svg", "bg05.svg", "bg06.svg"];
    return { backgroundImage: `url(/images/account/${backgrounds[dayOfYear() % backgrounds.length]})`};
};
