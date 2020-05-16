import React from "react";
import { hotelStars } from "core";
import { Link } from "react-router-dom";
import { plural, price, dateFormat } from "core";

export const Dual = ({ first, second, a, b, addClass, nonEmpty }) => (
    (!nonEmpty || b) ? <div class={"dual" + (addClass ? " " + addClass : '')}>
        <div class="first">
            { first || a }
        </div>
        <div class="second">
            { second || b }
        </div>
    </div> : null
);

export const Highlighted = ({ str, highlight }) => {
    if (!highlight || !str || !highlight.trim)
        return <span>{str || ""}</span>;

    highlight = highlight.trim().replace(/[\W_]+/g," ").split(' ');

    for (var i = 0; i < highlight.length; i++)
        if (highlight[i])
            str = str.replace(new RegExp(highlight[i], 'gi'), (s) => ("<b>" + s + "</b>"));

    return <span dangerouslySetInnerHTML={{__html: str}} />;
};

export const Stars = ({ count }) => {
    var result = hotelStars.indexOf(count);
    if (parseInt(count) >= 1) result = parseInt(count);
    if (result < 1) return null;

    return (
        <span class="stars">
            {[...Array(result)].map(() => <i/>)}
        </span>
    );
};

export const MealPlan = ({ room, t }) => {
    if (!room?.boardBasis)
        return null;
    if ("NotSpecified" == room.boardBasis)
        return <span>{room.mealPlan}</span>;
    if ("RoomOnly" == room.boardBasis)
        return <span>{t("No Breakfast")}</span>;
    return <span>{t(room.boardBasis)}</span>;
};

export const Expandable = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: !!this.props.open };
    }
    render() {
        return (
            <React.Fragment>
                <div class={"item" + (this.state.open ? " open" : "")}
                     onClick={() => this.setState({ open : !this.state.open })}>
                    {this.props.header}
                </div>
                { this.state.open ? this.props.content : null }
            </React.Fragment>
        );
    }
};

export const Loader = ({ page, white }) => (
    <div class={"loader" + (page ? " full-page" : "") + (white ? " white" : "")}><div class="x">
        <div class="a" /><div class="b" /><div />
    </div></div>
);

export const Header = () => (
    <header>
        <section>
            <div class="logo-wrapper">
                <Link to="/" class="logo" />
            </div>
        </section>
    </header>
);

export const groupAndCount = arr => {
    const count = {},
          result = [];
    for (let i = 0; i < arr.length; i++) {
        if(count.hasOwnProperty(arr[i].type))
            count[arr[i].type]++;
        else
            count[arr[i].type] = 1;
    }

    for (let item in count)
        result.push(count[item] + " x " + item);

    return result.join(", ");
};

export const CancelButton = ({ formik, className, children }) => {
    return <button className={className} onClick={(e) => {
        e.preventDefault();
        formik.resetForm();
    }}>
        {children}
    </button>
};
    
export const PassengersCount = ({ t, adults, children, separator }) => {
    return <React.Fragment>
        { adults ? plural(t, adults, "Adult") : "" }
        {(adults && children) ?
            (undefined !== separator ?
                separator :
                (" " + t("and") + " ")) :
            ""}
        { children ? plural(t, children, "Children") : "" }
        </React.Fragment>;
};

export const RoomPrices = ({ t, prices }) => {
    if (!(prices && prices.length))
        return null;

    if (prices.length == 1 || !prices[0].fromDate)
        return <React.Fragment>
            {price(prices[0])}
        </React.Fragment>;

    return <React.Fragment>
        {prices.map(item => (
            <div>
                {dateFormat.c(item.fromDate)} – {dateFormat.c(item.toDate)}: {price(item)}
            </div>
        ))}
    </React.Fragment>;
};