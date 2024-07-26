import 'server-only'

type Dictionary = {
    [key: string]: () => Promise<any>;
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
    name: string,
    login: string,
    register: string,
    nav: {
        about: string,
        products: string
    },
    errors: {
        input: {
            nickname: {
                required: string,
                minlength: string,
                maxlength: string
            },
            email: {
                required: string,
                invalid: string,
                exist: string
            },
            password: {
                required: string,
                minlength: string,
                maxlength: string,
                invalid: string
            }
        }
    }
}