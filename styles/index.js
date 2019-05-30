import './base/reset.sass';

export default (r => r.keys().map(r))(require.context('./', false, /\.(sass|scss)$/));
