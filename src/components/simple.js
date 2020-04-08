import React from "react";
import { hotelStars } from "core";
import { Link } from "react-router-dom";

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
    if (!highlight || !str)
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
    return <span>{
        "RO" == room.boardBasisCode ? t("Room only") : room.mealPlan
    }</span>
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
