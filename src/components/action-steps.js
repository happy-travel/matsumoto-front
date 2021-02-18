import React from "react";

const ActionSteps = ({ items = [], current, className }) => (
    <div className={"action-steps" + __class(className)}>
        { items.map((item, index) => (
            <React.Fragment key={index}>
                <div className={"step" +
                    __class(index  < current   , "finished") +
                    __class(index == current-1 , "previous") +
                    __class(index == current   , "current")
                }>
                    {item}
                </div>
                { index+1 < items.length &&
                    <div className="interval"><s/><u/><b/><i/></div>
                }
            </React.Fragment>
        )) }
    </div>
);

export default ActionSteps;
