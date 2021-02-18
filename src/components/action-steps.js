import React from "react";

const ActionSteps = ({ items = [], current, addClass }) => (
    <div class={"action-steps" + __class(addClass)}>
        { items.map((item, index) => (
            <>
                <div class={"step" +
                    __class(index  < current   , "finished") +
                    __class(index == current-1 , "previous") +
                    __class(index == current   , "current")
                }>
                    {item}
                </div>
                { index+1 < items.length &&
                    <div class="interval"><s/><u/><b/><i/></div>
                }
            </>
        )) }
    </div>
);

export default ActionSteps;
