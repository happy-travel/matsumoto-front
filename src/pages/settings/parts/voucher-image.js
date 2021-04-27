import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "components/simple";
import { API } from "core";

const VoucherImage = ({ route, title, text }) => {
    const [image, setImage] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const load = () => {
        API.get({
            url: route,
            success: setImage,
            after: () => setLoaded(true)
        });
    };

    useEffect(() => {
        load();
    }, []);

    const remove = () => {
        API.delete({
            url: route,
            after: setImage(null)
        });
    };

    const submit = (e) => {
        e.preventDefault();
        API.put({
            url: route,
            formDataBody: new FormData(document.getElementById("formElem"+text)),
            success: load
        });
    };

    const { t } = useTranslation();

    if (!loaded)
        return <Loader />;

    return (
        <div className="voucher-image">
            {title}
            {image?.url ?
                <>
                    <div className="box">
                        <img src={image.url} alt={image.fileName} />
                    </div>
                    <span className="link" onClick={remove}>{t("Remove")}</span>
                </> :
                <>
                    <div className="box">
                        <form id={"formElem"+text} onSubmit={submit}>
                            <label className="button file-upload">
                                {t("Upload Image")}
                                <input type="file" name="file" accept="image/*" onChange={submit} />
                            </label>
                        </form>
                    </div>
                    {text}
                </>
            }
        </div>
    );
};

export default VoucherImage;