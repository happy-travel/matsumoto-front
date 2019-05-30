import React from 'react';
import { Route } from "react-router-dom";

import main from './pages/main';
import search from './pages/search';
import third from './pages/third';

const Routes = () => (
    <React.Fragment>
        <Route exact path="/" component={main} />
        <Route path="/search" component={search} />
        <Route path="/third" component={third} />
    </React.Fragment>
);

export default Routes;
