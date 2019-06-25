import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import App from './app';

Sentry.init({dsn: "https://21e4194b435946e0b2e20444d6948d25@sentry.dev.happytravel.com/4"});

ReactDOM.render(<App />, document.getElementById('app'));
