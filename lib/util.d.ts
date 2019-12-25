import { Obj, WindowHandler } from '../src/types';
export declare const uriParams: {
    parse(paramString: string): Obj<string>;
    stringify(params: object): string;
};
export declare const windowCloserListener: (popupWindow: Window, windowHandler: WindowHandler) => Promise<void>;
