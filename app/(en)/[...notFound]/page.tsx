import { notFound } from 'next/navigation';

/** Any unknown path outside /es renders the branded English 404 (app/(en)/not-found.tsx). */
export default function EnNotFound() {
  notFound();
}
