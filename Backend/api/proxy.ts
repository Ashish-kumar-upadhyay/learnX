import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';

function firstQueryValue(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // When routed via vercel.json, we forward the original subpath as ?path=...
  // Reconstruct the intended Express URL so the app's `/api/*` routes match.
  const path = (firstQueryValue(req.query.path as any) ?? '').replace(/^\/+/, '');
  req.url = `/api/${path}`.replace(/\/+$/, '') || '/api';
  return app(req, res);
}
