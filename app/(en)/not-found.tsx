import { NotFoundView } from '@/components/wg/NotFoundView';
import { en } from '@/lib/i18n/en';

/** English 404 (paths outside /es). */
export default function NotFound() {
  return <NotFoundView dict={en.notFound} />;
}
