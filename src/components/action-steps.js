import React from 'react';
import { useTranslation } from "react-i18next";

const ActionSteps = ({ items = [], current }) => {
    var { t } = useTranslation();

    return (
        <div class="action-steps">
            { items.map((item, index) => (
                <React.Fragment>
                    <div class={
                        "step" +
                        (index  < current   ? " finished" : '') +
                        (index == current-1 ? " previous" : '') +
                        (index == current   ? " current"  : '')
                    }>
                        {t(item)}
                    </div>
                    { index+1 < items.length &&
                        <div class="interval"><s/><u/><b/><i/></div>
                    }
                </React.Fragment>
            )) }
        </div>
    );
};

export default ActionSteps;
