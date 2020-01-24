import React from "react";
import { hotelStars, dateFormat } from "core";
import { Link } from "react-router-dom";
import moment from "moment";

export const Dual = ({ first, second, a, b, addClass }) => (
    <div class={"dual" + (addClass ? " " + addClass : '')}>
        <div class="first">
            { first || a }
        </div>
        <div class="second">
            { second || b }
        </div>
    </div>
);

export const Highlighted = ({ str, highlight }) => {
    highlight = encodeURIComponent(highlight);
    return highlight ?
        <span dangerouslySetInnerHTML={
            {__html: str?.replace?.(new RegExp(escapeRegExp(highlight), 'gi'), (s) => ("<b>"+ s +"</b>"))}
    } /> : <span>{str}</span>;
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

export const Deadline = ({ date, t }) => (
    date ? (
        moment().isBefore(date) ? <div class="info green">
            {t("Deadline")} – {dateFormat.a(date)}
        </div> :
        <div class="info warning">
            {t("Within deadline")} – {dateFormat.a(date)}
        </div>
    ) :
    <div class="info green">
        {t("FREE Cancellation - Without Prepayment")}
    </div>
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

export const escapeRegExp = str => {
    return str?.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};
