import { getDictionary } from "../dictionaries";
import AvatarEditable from "./AvatarEditable";

export default async function MePage({params}: {params: { lang: string }}){
    const { lang } = params;
    const dict = await getDictionary(lang);

    return (
        <div className="w-screen flex justify-center">
            <div className="w-full max-w-screen-xl">
                <div className="mt-8">
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <AvatarEditable className="w-64 h-64" dict={dict} />
                            <div>
                                nickName
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}