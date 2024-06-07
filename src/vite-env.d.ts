/// <reference types="vite/client" />
declare interface Window {
    setClipboard: (str: string) => void;
    toTS: (obj: any) => Promise<string>;
    jstt: {
        compile: (a: any, b: string, c: any) => Promise<string>;
    }
}