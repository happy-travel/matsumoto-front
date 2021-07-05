import React, { useState, useEffect } from "react";
import { API } from "core";
import { FieldCheckbox } from "components/form";

const generateLabel = str => {
    if (!str)
        return "Unknown";
    const split = str.split(/([A-Z])/);
    for (let i = 0; i < split.length; i++)
        if (split[i].match(/([A-Z])/))
            split[i]= " " + split[i];
    return split.join("");
};

const PermissionsSelector = ({ formik }) => {
    const [rolesList, setRolesList] = useState([]);

    useEffect(() => {
        API.get({
            url: API.AGENT_ALL_ROLES,
            success: setRolesList
        });
    }, []);

    return (
        <div className="permissions">
            { rolesList.map(role => (
                <div>
                    <div className="item">
                        <FieldCheckbox
                            formik={formik}
                            id={role.id}
                            label={role.name}
                        />
                    </div>
                    { role.permissions.map(permission => (
                        <div className="subitem" key={permission}>
                            <div className={"checkbox readonly" + __class(formik.values[role.id], "on")}>
                                { generateLabel(permission) }
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PermissionsSelector;