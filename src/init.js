import CommonStore from 'stores/common-store';

const init = () => {
    fetch("https://edo-api.dev.happytravel.com/api/1.0/locations/regions?languageCode=en",
        {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(
            (result) => {
                CommonStore.setRegions(result);
                CommonStore.setInitialized(true);
            },
            (error) => {
                console.warn(error);
                CommonStore.setInitialized(true);
            }
        );

    window.safe = val => val;
};

export default init;