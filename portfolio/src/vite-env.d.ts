/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Form service URL that accepts a JSON POST (Formspree, Web3Forms, or your own API). */
  readonly VITE_CONTACT_ENDPOINT?: string;
  /** Access key for services that need one in the body, such as Web3Forms. */
  readonly VITE_CONTACT_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
