import { NotFoundView } from '@/components/wg/NotFoundView';
import { es } from '@/lib/i18n/es';

/** 404 en español (/es y todo lo que cuelga de ahí). */
export default function NotFoundEs() {
  return <NotFoundView dict={es.notFound} />;
}
