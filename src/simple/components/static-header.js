import React from "react";
import { Link } from "react-router-dom";

export const StaticHeader = () => (
    <header>
        <section>
            <div class="logo-wrapper">
                <Link to="/" class="logo" />
            </div>
        </section>
    </header>
);
