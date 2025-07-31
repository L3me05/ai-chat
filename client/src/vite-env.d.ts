// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_AUTH0_DOMAIN: string
    readonly VITE_AUTH0_CLIENT_ID : string
    readonly VITE_AUTH0_AUDIENCE : string
    // aggiungi altre variabili d'ambiente qui se necessario
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}


declare module "*.css" {
    const content: Record<string, string>;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}