import React from "react";
import FlagIconFactory from "react-flag-icon-css";

const FlagIcon = FlagIconFactory(React, { useCssModules: false });

const Flag = ({ code }) => (
    <span class="flag">
        <FlagIcon code={ code } />
    </span>
);

export default Flag;
