import React, { Component }  from 'react';

/* Note: this page is not used now. It exists only for dev proposes. Real layout placed in Odawara auth project */
class SignIn extends Component {
    render() {
        if (!__localhost) return null;

        return (

<div className="account block">
    <div className="picture"></div>
    <div className="menu">
        <div className="place">
            <div className="logo"></div>
        </div>
        <form method="post">
            <div className="form">
                <div className="title">
                    <b>Log</b> In
                </div>
                <div>
                    <div className="row">
                        <div className="field">
                            <div className="label">
                                <span><label asp-for="Input.UserName"></label></span>
                            </div>
                            <div className="auth-input">
                                <input placeholder="Enter username" asp-for="Input.UserName"/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="field">
                            <div className="label">
                                <span><label asp-for="Input.Password"></label></span>
                            </div>
                            <div className="auth-input">
                                <input placeholder="Enter password" asp-for="Input.Password"/>
                            </div>
                        </div>
                    </div>
                    <div className="error-field">
                        <div asp-validation-summary="All"></div>
                    </div>
                    <div className="row">
                        <div className="field">
                            <div className="inner">
                                <button type="submit" className="button">Log In</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div className="place">
            Don`t have an account? <a asp-page="./Register" asp-route-returnUrl="@Model.ReturnUrl" className="link">Create new one</a>
        </div>
    </div>
</div>

        );
    }
}

export default SignIn;