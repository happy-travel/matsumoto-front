import React from 'react';

const ActionSteps = ({ items = [], current, addClass }) => (
    <div class={"action-steps" + addClass ? (" " + addClass) : ''}>
        { items.map((item, index) => (
            <React.Fragment>
                <div class={
                    "step" +
                    (index  < current   ? " finished" : '') +
                    (index == current-1 ? " previous" : '') +
                    (index == current   ? " current"  : '')
                }>
                    {item}
                </div>
                { index+1 < items.length &&
                    <div class="interval"><s/><u/><b/><i/></div>
                }
            </React.Fragment>
        )) }
    </div>
);

export default ActionSteps;
