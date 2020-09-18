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
            addClass
        } = this.props;

        return (
            <div class="sorter"
                 data-dropdown={dropdownId}
                 onClick={() => View.setOpenDropdown(dropdownId)}>
                <button class={"button-expand" + addClass}>
                    {text}
                </button>
                { View.isDropdownOpen(dropdownId) && <div class="usual dropdown">
                    {options.map(item =>
                        <div class="item" onClick={() => sorter(item.order)}>
                            {item.title}
                        </div>
                    )}
                </div> }
            </div>
        );
    }
}

export default SorterDropdown;