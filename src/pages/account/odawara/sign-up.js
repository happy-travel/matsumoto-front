import React, { Component }  from 'react';

/* Note: this page is not used now. It exists only for dev proposes. Real layout placed in Odawara auth project */
class SignUp extends Component {
    render() {
        if (!__localhost) return null;

        return (

<div class="account block sign-up-page">
    <section>
        <div class="logo-wrapper">
            <div class="logo"></div>
        </div>
        <div class="middle-section">
            <div class="breadcrumbs">
                <a asp-page="./Login" asp-route-returnUrl="@Model.ReturnUrl">Log In</a><span class="small-arrow-right"></span>
                Registration<span class="small-arrow-right"></span>
                Company Information
                <div class="back-button">
                    <a asp-page="./Login" asp-route-returnUrl="@Model.ReturnUrl">
                        <span class="small-arrow-left"></span> Back
                    </a>
                </div>
            </div>

            <div class="action-steps action-steps-another-bg">
                <div class="step current">
                    Log In Information
                </div>
                <div class="interval"><s></s><u></u><b></b><i></i></div>
                <div class="step">
                    Agent Information
                </div>
                <div class="interval"><s></s><u></u><b></b><i></i></div>
                <div class="step">
                    Company Information
                </div>
            </div>
            <h1>
                Get started with a new account
            </h1>
            <p>
                Create a free HappyTravel.com account and start booking today.<br/>
                Already have an account? <a asp-page="./Login" asp-route-returnUrl="@Model.ReturnUrl" class="link">Log In Here.</a>
            </p>
            <form method="post">
                <div class="form">
                    <div>
                        <div class="row">
                            <div class="field">
                                <div class="label">
                                    <span class="required"><label asp-for="RegisterInput.Email"></label></span>
                                </div>
                                <div class="auth-input">
                                    <input placeholder="Enter your email"  asp-for="RegisterInput.Email"/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="field">
                                <div class="label">
                                    <span class="required"><label asp-for="RegisterInput.UserName"></label></span>
                                </div>
                                <div class="auth-input">
                                    <input placeholder="Username" asp-for="RegisterInput.UserName"/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="field">
                                <div class="label">
                                    <span class="required"><label asp-for="RegisterInput.Password"></label></span>
                                </div>
                                <div class="auth-input">
                                    <input placeholder="Choose your password" asp-for="RegisterInput.Password"/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="field">
                                <div class="label">
                                    <span class="required"><label asp-for="RegisterInput.ConfirmPassword"></label></span>
                                </div>
                                <div class="auth-input">
                                    <input placeholder="Please repeat your password" asp-for="RegisterInput.ConfirmPassword"/>
                                </div>
                            </div>
                        </div>
                        <div class="error-field">
                            <div asp-validation-summary="All"></div>
                        </div>
                        <div class="row">
                            <div class="field">
                                <div class="inner">
                                    <button type="submit" class="button">Continue Registration</button>
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