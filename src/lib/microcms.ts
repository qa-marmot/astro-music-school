import { createClient } from 'microcms-js-sdk';

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

export const hasMicroCMSConfig = Boolean(serviceDomain && apiKey);

export const client = hasMicroCMSConfig
  ? createClient({ serviceDomain: serviceDomain!, apiKey: apiKey! })
  : null;
