import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Loader } from "components/simple";
import { API } from "core";

@observer
class VoucherImage extends React.Component {
    componentDidMount() {
        this.load();
    }

    load = () => {
        var { route } = this.props;
        API.get({
            url: route,
            success: image => this.setState({ image }),
            after: () => this.setState({ loaded: true })
        });
    }

    remove = () => {
        var { route } = this.props;
        API.delete({
            url: route,
            after: () => this.setState({ image: null })
        });
    }

    submit = (e) => {
        e.preventDefault();

        var { route, text } = this.props;
        API.put({
            url: route,
            formDataBody: new FormData(document.getElementById("formElem"+text)),
            success: () => this.load()
        });
    }

    render() {
        var { t } = useTranslation(),
            { route, title, text } = this.props,
            image = this?.state?.image;

        if (!this?.state?.loaded)
            return <Loader />;

        return (
            <div className="voucher-image">
                {title}
                {image?.url ?
                    <>
                        <div className="box">
                            <img src={image.url} alt={image.fileName} />
                        </div>
                        <span className="link" onClick={this.remove}>{t("Remove")}</span>
                    </> :
                    <>
                        <div className="box">
                            <form id={"formElem"+text} onSubmit={this.submit}>
                                <label className="button file-upload">
                                    {t("Upload Image")}
                                    <input type="file" name="file" accept="image/*" onChange={this.submit} />
                                </label>
                            </form>
                        </div>
                        {text}
                    </>
                }
            </div>
        );
    }
}

export default VoucherImage;