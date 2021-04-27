export const accommodationStoreCacheShorter = (values) => {
    const short = JSON.parse(JSON.stringify(values));
    if (short?.search?.result?.length > 10) {
        short.search.result = short.search.result.slice(0, 10);
        short.search.page = 0;
        short.search.hasMoreSearchResults = true;
    }
    return short;
};
