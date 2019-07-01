import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import App from './app';
//*move
import RegionStore from 'stores/region-store'
//*/move

Sentry.init({dsn: "https://21e4194b435946e0b2e20444d6948d25@sentry.dev.happytravel.com/4"});

ReactDOM.render(<App />, document.getElementById('app'));

//todo: move this part to inits


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
            RegionStore.setRegions(result);
            RegionStore.setInitialized(true);
        },
        (error) => {
            console.warn(error);
            RegionStore.setInitialized(true);
        }
    );