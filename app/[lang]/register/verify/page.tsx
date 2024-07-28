import { getDictionary } from "../../dictionaries";
import RegisterVerifyMain from "./main";

export async function generateStaticParams() {
    return [{ lang: 'en-US' }, { lang: 'zh-CN' }]
}

export default async function VerifyPage({params}: { params: { lang: string } }) {
    const { lang } = params;
    const dict = await getDictionary(lang);
   
    return (
        <RegisterVerifyMain dict={dict} />
    )
}