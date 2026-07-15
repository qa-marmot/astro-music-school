import type { APIRoute } from 'astro';
import { isDemo, siteContent } from '../data/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const body = isDemo
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${siteContent.siteUrl}/sitemap-index.xml\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
