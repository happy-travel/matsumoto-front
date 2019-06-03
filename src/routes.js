import React from 'react';
import { Route } from "react-router-dom";

import main from './pages/main';
import variants from './pages/variants';
import third from './pages/third';

const Routes = () => (
    <React.Fragment>
        <Route exact path="/" component={main} />
        <Route path="/search" component={variants} />
        <Route path="/third" component={third} />
    </React.Fragment>
);

export default Routes;
