/// <reference types="vite/client" />
declare module "*.svg?raw" { const src: string; export default src; }
/* true только в режиме notes (локальный показ с заметками ведущего) */
declare const __NOTES__: boolean;
