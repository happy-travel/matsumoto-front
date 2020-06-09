import React, { Component }  from 'react';

/* Note: this page is not used now. It exists only for dev proposes. Real layout placed in Odawara auth project */
class Confirmation extends Component {
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
                Confirmation
                <div class="back-button">
                    <a asp-page="./Login" asp-route-returnUrl="@Model.ReturnUrl">
                        <span class="small-arrow-left"></span> Back
                    </a>
                </div>
            </div>

            <h1>
                Account confirmation
            </h1>
            <p>We have sent an email with a confirmation link to your email address.<br/> Please allow 5-10 minutes for this message to arrive.</p>
        </div>
    </section>
</div>

        );
    }
}

export default Confirmation;