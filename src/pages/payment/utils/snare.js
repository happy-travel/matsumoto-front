export const snare = () => {
    window.io_bbout_element_id = "device_fingerprint";
    window.io_install_stm = false;
    window.io_exclude_stm = 0;
    window.io_install_flash = false;
    window.io_enable_rip = true;

    var script = document.createElement("script");
    script.src = "https://mpsnare.iesnare.com/snare.js";
    script.async = true;
    document.body.appendChild(script);
};
