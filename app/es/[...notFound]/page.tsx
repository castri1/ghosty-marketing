import { notFound } from 'next/navigation';

/** Any unknown /es/... path renders the branded 404 (app/not-found.tsx). */
export default function EsNotFound() {
  notFound();
}
