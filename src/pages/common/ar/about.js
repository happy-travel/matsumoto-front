import React from "react";
import { useTranslation } from "react-i18next";

export default function () {
    const { t } = useTranslation();
    return (
        <div class="confirmation block document">
            <section>
                <h1>معلومات عنا</h1>
                <p> يسعد شركة<b>HappyTravelDotCom </b>لخدمات السفر أن تعلن عن تقديم خدماتها بالجملة من مقرها الرئيسي في دبي لكلٍ من وكلاء </p>

                <p>السفر ومنظمي الرحلات السياحية حول العالم بأفضل الأسعار.</p>

                <p>
                    نعدكم بتوفير خدمات ممتازة في أكثر من 2000 عقار ومحل إقامة حول العالم بفضل قاعدة البيانات العالمية الفريدة لدينا والتي
                    تغطي جميع الدول حول العالم، أينما كنتم أو أردتم التوجه ستجدوننا معكم في باريس وجزر المالديف ولندن ودبي، بمجرد أن
                    هبط طائرتكم بالسلامة، ستجدوننا على بعد خطوات منكم على أتم استعداد لتقديم أفضل الخدمات بأقل الأسعار.
                </p>

                <p><i>أينما تكونوا، خدماتنا في انتظاركم.</i></p>

                <p>
                    يعمل على منصتنا الإلكترونية فريق من أكفء الخبراء بخبرة تزيد عن 15 عاماً في هذا المجال على أتم الاستعداد لتقديم
                    المساعدة ويد العون لكم. في شركتنا <b>HappyTravelDotCom</b>، السفر ليس فقط مجال عملنا بل شغفنا الأول، ورضاكم هو هدفنا الذي
                    نسعى إليه.
                </p>

                <p>
                    لذا قمنا بتصميم موقعنا ليكون عنواناً لنا ويد عون لكم. حيث قام بتصميمه أفضل متخصصي تكنولوجيا المعلومات ليلبي
                    احتياجاتكم وفقاً لتفضيلاتكم الشخصية. كل هذا وأكثر بأسعار لا مثيل لها فقط مع <b>HappyTravelDotCom</b> .
                </p>

                <p>
                    نقدم لكم موقع وتطبيق<b>HappyTravelDotCom</b>  المتاحين باللغة العربية والإنجليزية والروسية.
                    للتمتع بتجربة سفر فريدة ورائعة،<b>HappyTravelDotCom</b>  لديها الحل.
                </p>

                <p>
                    يسعدنا تلقي أسئلتكم واستفساراتكم على مدار 24 ساعة طوال أيام الأسبوع. لا ترددوا أبداً في التواصل معنا.
                </p>
            </section>
        </div>
    );
};
