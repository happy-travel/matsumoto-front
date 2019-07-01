import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import App from './app';
//*move
import CommonStore from 'stores/common-store'
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
            CommonStore.setRegions(result);
            CommonStore.setInitialized(true);
        },
        (error) => {
            console.warn(error);
            CommonStore.setInitialized(true);
        }
    );

window.safe = val => val;