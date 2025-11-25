import { NextResponse } from 'next/server';
import { upstreamApiUrl } from '@/config/api';

const forwardRequest = async (req, { params }) => {
  const pathSegments = params?.path || [];
  const upstreamPath = pathSegments.join('/');

  const requestUrl = new URL(req.url);
  const search = requestUrl.search || '';
  const targetUrl = `${upstreamApiUrl}/${upstreamPath}${search}`;

  const headers = new Headers(req.headers);
  headers.delete('host');

  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.arrayBuffer();
  }

  const upstreamResponse = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
    cache: 'no-store',
  });

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.delete('content-security-policy');
  responseHeaders.delete('content-security-policy-report-only');
  responseHeaders.delete('x-frame-options');

  const responseBody = await upstreamResponse.arrayBuffer();

  return new NextResponse(responseBody, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
};

export const GET = forwardRequest;
export const POST = forwardRequest;
export const PUT = forwardRequest;
export const PATCH = forwardRequest;
export const DELETE = forwardRequest;
export const OPTIONS = forwardRequest;

