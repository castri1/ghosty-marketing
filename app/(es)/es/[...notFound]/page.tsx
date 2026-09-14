import { notFound } from 'next/navigation';

/** Any unknown /es/... path renders the branded Spanish 404 (app/(es)/not-found.tsx). */
export default function EsNotFound() {
  notFound();
}
