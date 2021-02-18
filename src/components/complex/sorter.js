import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import View from "stores/view-store";

const dropdownId = "SorterDropdown";

@observer
class SorterDropdown extends React.Component {
    render() {
        const { t } = useTranslation();
        var {
            sorter,
            text,
            options,
            className
        } = this.props;

        return (
            <div className="sorter"
                 data-dropdown={dropdownId}
                 onClick={() => View.setOpenDropdown(dropdownId)}>
                <button className={"button-expand" + className}>
                    {text}
                </button>
                { View.isDropdownOpen(dropdownId) && <div className="usual dropdown">
                    {options.map(item =>
                        <div
                            className="item"
                            onClick={() => sorter(item.order)}
                            key={item.order}
                        >
                            {item.title}
                        </div>
                    )}
                </div> }
            </div>
        );
    }
}

export default SorterDropdown;