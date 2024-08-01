import 'server-only'

type Dictionary = {
    [key: string]: () => Promise<Dict>;
};

const dictionaries: Dictionary = {
    "en-US": () => import('./dictionaries/en-US.json').then((module) => module.default),
    "zh-CN": () => import('./dictionaries/zh-CN.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
  const dict = dictionaries[locale];

  return dict();
}

export type Dict = {
    name?: string,
    login?: string,
    register?: string,
    me?: {
        avatar?:{
            openEditor?: string,
            uploadHint?: string,
            confirm?: string,
            invalidUrl?: string
        }
    },
    nav?: {
        about?: string,
        products?: string
    },
    loginPage?: {
        formTitle?: string,
        submit?: string,
        success?: string,
        emailOrPwdFailed?: string,
        email?: string,
        password?: string,
    },
    registerPage?: {
        verify?: {
            pending?: string,
            success?: string,
            failed?: string,
            noToken?: string
        },
        toVerify?: {
            message?: string
        },
        email?: string,
        password?: string,
    },
    errors?: {
        input?: {
            nickname?: {
                required?: string,
                minlength?: string,
                maxlength?: string
            },
            email?: {
                required?: string,
                invalid?: string,
                exist?: string
            },
            password?: {
                required?: string,
                minlength?: string,
                maxlength?: string,
                invalid?: string
            }
        },
        server?: string,
        unkown?: string,
        turnsliteFailed?: string
    },
    registerSuccess?: string
}