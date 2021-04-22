import "./base/reset.sass";
import "./images/flagpack/dist/flagpack.css"; // Comment this when you need to rebuild external site css bundle

export default [
    ...(r => r.keys().map(r))(require.context("./", false,  /\.(sass|scss)$/)),
    ...(r => r.keys().map(r))(require.context("./components", false,  /\.(sass|scss)$/)),
    ...(r => r.keys().map(r))(require.context("./block", false,  /\.(sass|scss)$/)),
    ...(r => r.keys().map(r))(require.context("./form", false,  /\.(sass|scss)$/)),
];

// import "./retail/site.sass"; // Uncomment this when you need to rebuild wordpress retail site css bundle
// import "./odawara/identity.sass"; // Uncomment this when you need to rebuild identity css bundle
