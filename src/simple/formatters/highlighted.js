import React from "react";

export const Highlighted = ({ str, highlight }) => {
    if (!highlight || !str || !highlight.trim)
        return <span>{str || ""}</span>;

    highlight = highlight.trim().replace(/[\W_]+/g," ").split(' ');

    for (var i = 0; i < highlight.length; i++)
        if (highlight[i])
            str = str.replace(new RegExp(highlight[i], 'gi'), (s) => ("<>" + s + "</>"));
    str = str.replace(new RegExp("<>", 'gi'), "<b>");
    str = str.replace(new RegExp("</>", 'gi'), "</b>");

    return <span dangerouslySetInnerHTML={{__html: str}} />;
};