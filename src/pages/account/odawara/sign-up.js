import React, { Component }  from 'react';

/* Note: this page is not used now. It exists only for dev proposes. Real layout placed in Odawara auth project */
class SignUp extends Component {
    render() {
        if (!__localhost) return null;

        return (

<div className="account block sign-up-page">
    <section>
        <div className="logo-wrapper">
            <div className="logo"></div>
        </div>
        <div className="middle-section">
            <div className="breadcrumbs">
                <a asp-page="./Login" asp-route-returnUrl="@Model.ReturnUrl">Log In</a><span className="small-arrow-right"></span>
                Registration<span className="small-arrow-right"></span>
                Company Information
                <div className="back-button">
                    <a asp-page="./Login" asp-route-returnUrl="@Model.ReturnUrl">
                        <span className="small-arrow-left"></span> Back
                    </a>
                </div>
            </div>

            <div className="action-steps action-steps-another-bg">
                <div className="step current">
                    Login Information
                </div>
                <div className="interval"><s></s><u></u><b></b><i></i></div>
                <div className="step">
                    Agent Information
                </div>
                <div className="interval"><s></s><u></u><b></b><i></i></div>
                <div className="step">
                    Company Information
                </div>
            </div>
            <h1>
                Get started with a new account
            </h1>
            <p>
                Create a free Happytravel.com account and start booking today.<br/>
                Already have an account? <a asp-page="./Login" asp-route-returnUrl="@Model.ReturnUrl" className="link">Log In Here.</a>
            </p>
            <form method="post">
                <div className="form">
                    <div>
                        <div className="row">
                            <div className="field">
                                <div className="label">
                                    <span className="required"><label asp-for="RegisterInput.Email"></label></span>
                                </div>
                                <div className="auth-input">
                                    <input placeholder="Enter your email"  asp-for="RegisterInput.Email"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="field">
                                <div className="label">
                                    <span className="required"><label asp-for="RegisterInput.UserName"></label></span>
                                </div>
                                <div className="auth-input">
                                    <input placeholder="Username" asp-for="RegisterInput.UserName"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="field">
                                <div className="label">
                                    <span className="required"><label asp-for="RegisterInput.Password"></label></span>
                                </div>
                                <div className="auth-input">
                                    <input placeholder="Choose your password" asp-for="RegisterInput.Password"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="field">
                                <div className="label">
                                    <span className="required"><label asp-for="RegisterInput.ConfirmPassword"></label></span>
                                </div>
                                <div className="auth-input">
                                    <input placeholder="Please repeat your password" asp-for="RegisterInput.ConfirmPassword"/>
                                </div>
                            </div>
                        </div>
                        <div className="error-field">
                            <div asp-validation-summary="All"></div>
                        </div>
                        <div className="row">
                            <div className="field">
                                <div className="inner">
                                    <button type="submit" className="button">Continue Registration</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </section>
</div>

        );
    }
}

export default SignUp;