import React, { Component }  from 'react';

/* Note: this page is not used now. It exists only for dev proposes. Real layout placed in Odawara auth project */
class SignIn extends Component {
    render() {
        if ("localhost" != window.location.hostname) return null;
        // comment the following line, when you need the page
        return <div style={{ padding: "20px" }}>Page is disabled. Edit sources to see the content.</div>;

        return (

<div class="account block sign-in-page">
    <div class="picture"></div>
    <div class="menu">
        <div class="place">
            <div class="logo"></div>
        </div>
        <form method="post">
            <div class="form">
                <div class="title">
                    <b>Log</b> In
                </div>
                <div>
                    <div class="row">
                        <div class="field">
                            <div class="label">
                                <span><label asp-for="Input.UserName"></label></span>
                            </div>
                            <div class="auth-input">
                                <input placeholder="Username" asp-for="Input.UserName"/>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="field">
                            <div class="label">
                                <span><label asp-for="Input.Password"></label></span>
                            </div>
                            <div class="auth-input">
                                <input placeholder="**********" asp-for="Input.Password"/>
                            </div>
                        </div>
                    </div>
                    <div class="error-field">
                        <div asp-validation-summary="All"></div>
                    </div>
                    <div class="row">
                        <div class="field">
                            <div class="inner">
                                <button type="submit" class="button">Log in</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="place">
            Don`t have an account? <a asp-page="./Register" asp-route-returnUrl="@Model.ReturnUrl" class="link">Create new one</a>
        </div>
    </div>
</div>

        );
        /*
            Layout for "Are you supplier?" block
            <div class="supplier">
                <span class="icon icon-supplier" />
                Are you supplier?
            </div>
        */
    }
}

export default SignIn;