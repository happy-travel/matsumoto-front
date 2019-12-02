import './base/reset.sass';
import './images/flagpack/dist/flagpack.css';

export default (r => r.keys().map(r))(require.context('./', false, /\.(sass|scss)$/));
