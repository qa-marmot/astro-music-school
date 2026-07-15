/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_CONTENT_MODE?: 'demo' | 'production';
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_SITE_NAME?: string;
  readonly PUBLIC_FORM_ENDPOINT?: string;
  readonly MICROCMS_SERVICE_DOMAIN?: string;
  readonly MICROCMS_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
