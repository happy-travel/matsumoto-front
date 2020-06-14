import './base/reset.sass';
import './images/flagpack/dist/flagpack.css'; // Comment this when you need to rebuild wordpress retail site css bundle

export default (r => r.keys().map(r))(require.context('./', false, /\.(sass|scss)$/));

// import './retail/site.sass'; // Uncomment this when you need to rebuild wordpress retail site css bundle
