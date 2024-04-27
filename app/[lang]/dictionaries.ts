import 'server-only'

type Dictionary = {
    [key: string]: () => Promise<any>;
};

const dictionaries: Dictionary = {
    "en-UK": () => import('./dictionaries/en-UK.json').then((module) => module.default),
    "zh-CN": () => import('./dictionaries/zh-CN.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
    if (typeof dictionaries[locale] === 'function') {
        return dictionaries[locale]()
      } else {
        throw new Error(`Dictionary not found for locale: ${locale}`);
      }
}
