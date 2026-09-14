import type { Metadata } from 'next';
import Link from 'next/link';
import { GhostMark } from '@/components/GhostMark';
import { signupUrl } from '@/lib/console-url';
import { pageMeta, siteUrl } from '@/lib/site';

const TITLE = 'Cómo publicar una app hecha con Claude Code';
const TITLE_TAG = 'Publicar una app hecha con Claude Code';
const DESCRIPTION =
  'Claude Code escribe apps normales. Tienes opciones: armar tu propio stack, un link de artefacto o una plataforma administrada como White Ghost. Cómo elegir y publicarla.';
const PATH = '/es/publicar/claude-code';
const REVISADO = 'Revisada por el equipo de White Ghost, septiembre de 2026';

const REQUISITOS = [
  'La carpeta donde Claude Code estuvo trabajando, con la app corriendo en tu computador (el link de localhost).',
  'Una cuenta de GitHub. Es el "Google Drive de los programadores": ahí queda tu código, sigue siendo tuyo y lo puedes bajar en .zip cuando quieras.',
  'Una app en Node o en Python. Un archivo HTML suelto todavía no es una app; Claude Code lo convierte en una en pocos minutos.',
  'Una cuenta de White Ghost. Con el plan gratis alcanza para la primera: 3 apps despiertas, una persona, todas las funciones.',
  'Claude Code abierto en esa carpeta. Él hace la parte técnica; tú apruebas.',
];

const PROMPT =
  'Instala el CLI de ghosty (npm install -g ghosty-cli), inicia sesión con ghosty login y corre ghosty init en esta carpeta para crear la app y su repositorio. Sube el código y corre ghosty deploy hasta que la app quede en vivo. Usa salida --json y dime la URL final.';

const PASOS = [
  {
    name: 'Instalar el CLI una sola vez (o que lo haga tu asistente)',
    text: 'npm install -g ghosty-cli. Todos los comandos aceptan --json y terminan con una línea de "listo" que el asistente sabe leer, así que Claude Code puede llevar todo el flujo.',
    check: 'ghosty --version muestra un número de versión.',
  },
  {
    name: 'Iniciar sesión',
    text: 'ghosty login. Sin contraseñas: link al correo, Google, GitHub o passkey.',
    check: 'El comando termina con la línea de "listo" y tu correo; en console.whiteghost.ai apareces con la sesión iniciada.',
  },
  {
    name: 'Crear la app',
    text: 'ghosty init hace unas pocas preguntas (nombre, qué hace, lenguaje del backend, si necesita base de datos) y crea un repositorio normal en tu cuenta de GitHub.',
    check: 'La app aparece en el panel de la consola y el repositorio aparece en tu cuenta de GitHub.',
  },
  {
    name: 'Seguir construyendo con Claude Code',
    text: 'ghosty dev corre la app en tu computador mientras le sigues pidiendo cambios al asistente. Cada app trae instrucciones de arranque que le enseñan al asistente sus convenciones.',
    check: 'El link de localhost abre la app con tus últimos cambios.',
  },
  {
    name: 'Publicar',
    text: 'Cada git push dispara el build y la salida a producción; en una app real completa los builds han tardado 53 segundos y 1 minuto 27 segundos. Corre ghosty deploy para ver hasta que la versión nueva esté viva en su propia URL, con el modo de acceso incluido.',
    check: 'La pestaña Deploys muestra el build en verde y la URL de la app abre desde tu celular con el Wi-Fi apagado.',
  },
];

const LIMITES = [
  'Plan gratis: 3 apps despiertas y una persona. Solo (US$19 al mes) sube a 10 apps despiertas, dominios propios y 10 GB de archivos. Los planes de equipo traen usuarios ilimitados.',
  'La app se apaga cuando nadie la usa, así que la primera visita después de un rato tarda un momento en despertar.',
  'Necesitas cuenta de GitHub: ahí vive el código, y te puedes ir con él cuando quieras.',
  'El modo de acceso (pública, código de invitación compartido o tu propio inicio de sesión) es parte del código de la app: cambiarlo después implica editar y volver a publicar.',
  'Los links de preview de cada pull request son URLs públicas; no pongas datos reales detrás de un preview.',
  'Todavía no hay procesos de fondo ni WebSockets: las tareas largas se corren como llamadas HTTP programadas, no como procesos siempre encendidos.',
];

const FAQ = [
  {
    q: '¿Claude Code puede publicar la app solo?',
    a: 'Sí. El CLI de ghosty está hecho para que lo maneje un agente: inicia sesión con un flujo que apruebas una sola vez, todos los comandos aceptan --json y los comandos largos terminan con una línea de "listo" que el asistente sabe leer. Le puedes pedir a Claude Code que instale, cree y publique sin salir de la conversación.',
  },
  {
    q: '¿La gente que abre mi app necesita cuenta de Claude?',
    a: 'No. Una app publicada con White Ghost vive en una URL normal con las reglas de acceso que tú elijas: pública, un código de invitación compartido, los miembros de tu espacio o el inicio de sesión de la propia app. Nadie necesita cuenta en ninguna plataforma de IA.',
  },
  {
    q: '¿Y si una publicación daña algo?',
    a: 'Corres ghosty rollback, o abres la pestaña Deploys y le das Redeploy a cualquier build anterior. Cada build del historial guarda su commit, sus tiempos y su log.',
  },
  {
    q: '¿Una app hecha con Claude Code es un tipo especial de app?',
    a: 'No. Claude Code escribe aplicaciones web normales. Por eso en principio sirve cualquier hosting; la pregunta real es cuánta infraestructura (base de datos, control de acceso, actualizaciones) quieres armar tú mismo.',
  },
  {
    q: '¿Qué pasa con la base de datos y los archivos?',
    a: 'Cada app recibe una base de datos PostgreSQL administrada, y almacenamiento de archivos que activas por app, con links de descarga firmados que vencen. Las credenciales de las integraciones las inyecta la plataforma de forma segura, así que las llaves de los proveedores nunca quedan en el repositorio.',
  },
  {
    q: '¿Me puedo ir después?',
    a: 'Sí. El código vive en tu propia cuenta de GitHub desde el primer día: te vas cuando quieras y te llevas el código, los datos y el historial.',
  },
];

const OPCIONES = [
  {
    option: 'Artefactos de Claude',
    bestFor: 'Mostrar un prototipo ya mismo',
    tradeoff:
      'Es una captura del trabajo, no una aplicación: una sola pantalla, sin backend ni base de datos, y las políticas de retención o los interruptores de compartir pueden matar el link',
  },
  {
    option: 'Vercel / Netlify / Cloudflare',
    bestFor: 'Ingenieros que publican software público de producción',
    tradeoff: 'Tú armas hosting, base de datos, autenticación y permisos',
  },
  {
    option: 'Railway / Render / Fly.io',
    bestFor: 'Apps que necesitan servidores y procesos siempre encendidos',
    tradeoff: 'La misma armada, más infraestructura que operar',
  },
  {
    option: 'White Ghost',
    bestFor: 'Personas y equipos que publican apps reales con el asistente de IA que ya tienen',
    tradeoff: 'Plataforma administrada: menos control de infraestructura que armar tu propio stack',
  },
];

export const metadata: Metadata = pageMeta({
  title: `${TITLE_TAG} — White Ghost`,
  description: DESCRIPTION,
  path: PATH,
  locale: 'es',
});

// TTL acotado en el CDN: ver app/page.tsx (CAS-127).
export const revalidate = 3600;

/** Gemela en español de /deploy/claude-code: respuesta primero, en el vocabulario del simple mortal. */
export default function PublicarClaudeCode() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: 'es',
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      inLanguage: 'es',
      name: TITLE,
      description: DESCRIPTION,
      step: PASOS.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.name,
        text: `${s.text} Cómo comprobarlo: ${s.check}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'White Ghost', item: siteUrl('/es') },
        { '@type': 'ListItem', position: 2, name: TITLE, item: siteUrl(PATH) },
      ],
    },
  ];

  return (
    <>
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
      ))}

      <article className="docs-article">
        <p className="kicker">Guía para publicar · {REVISADO}</p>
        <h1>{TITLE}</h1>
        <p className="lede">
          Claude Code escribe aplicaciones web normales, así que tienes opciones reales: armar tú
          mismo un stack de desarrollador, un link temporal de artefacto o una plataforma
          administrada. Con White Ghost todo el flujo es un solo CLI que Claude Code maneja por ti,
          y la app queda en vivo con una URL permanente, una base de datos y las reglas de acceso
          que elijas. Se hace en una conversación.
        </p>

        <div className="md-prose">
          <h2>Qué necesitas antes de empezar</h2>
          <ul>
            {REQUISITOS.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <h2>Pídeselo a Claude Code</h2>
          <p>Pega esto en la conversación de Claude Code, parado en la carpeta de tu app:</p>
          <pre>
            <code>{PROMPT}</code>
          </pre>
          <p>
            Te va a pedir que apruebes el inicio de sesión una vez (se abre un link en tu navegador)
            y que confirmes las respuestas de la entrevista corta. Lo demás lo hace solo. Los pasos
            de abajo son lo que está haciendo, con cómo comprobar cada uno.
          </p>

          <h2>De la carpeta en tu computador a una URL en vivo, en cinco pasos</h2>
          <ol>
            {PASOS.map((step) => (
              <li key={step.name}>
                <strong>{step.name}.</strong> {step.text} <em>Cómo comprobarlo:</em> {step.check}
              </li>
            ))}
          </ol>

          <h2>O empieza en la consola y mándale el trabajo a Claude Code</h2>
          <p>
            El puente funciona en los dos sentidos. El Overview de cada app tiene un botón "Open in
            Claude Code" y otro "Copy the instructions": un prompt ya armado que lleva la URL de la
            app y la del repositorio, para que el asistente retome el trabajo con todo el contexto.
            No tienes que explicarle el proyecto.
          </p>

          <h2>Qué recibes después de publicar</h2>
          <p>
            Publicar no es el final del flujo. Cada app viene con un historial de despliegues (cada
            build guarda su commit, sus tiempos y su log, con botón de Redeploy), un feed de logs en
            vivo, analítica con peticiones y errores por día en ventanas de 7 o 30 días, y una URL de
            preview viva por cada pull request abierto, actualizada en cada push. Los secretos se
            aplican sin volver a publicar, las tareas programadas pueden llamar a tus endpoints con
            un temporizador y el dominio propio viene con el certificado emitido y renovado solo.
          </p>

          <h2>Límites y costo</h2>
          <ul>
            {LIMITES.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p>
            El detalle de los planes está en la <Link href="/es/pricing">página de precios</Link>.
          </p>

          <h2>Dónde puede vivir una app de Claude Code: el mapa honesto</h2>
          <table>
            <thead>
              <tr>
                <th>Opción</th>
                <th>Para qué sirve mejor</th>
                <th>El precio que pagas</th>
              </tr>
            </thead>
            <tbody>
              {OPCIONES.map((row) => (
                <tr key={row.option}>
                  <td>
                    <strong>{row.option}</strong>
                  </td>
                  <td>{row.bestFor}</td>
                  <td>{row.tradeoff}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Las preguntas que la gente hace de verdad</h2>
          {FAQ.map((item) => (
            <div key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}

          <h2>Relacionado</h2>
          <ul>
            <li>
              <Link href="/es/localhost">Por qué tu equipo no puede abrir tu link de localhost (y cómo compartirlo de verdad)</Link>
            </li>
            <li>
              <Link href="/es/compartir/claude-code">Cómo compartir lo que hiciste en Claude Code con tu equipo</Link>
            </li>
            <li>
              <Link href="/es/blog/tu-app-necesita-base-de-datos">Tu app hecha con IA necesita una base de datos. ¿Dónde vive?</Link>
            </li>
          </ul>
        </div>
      </article>

      <section className="closing">
        <GhostMark className="ghost-mark" />
        <h2>Tu app merece más que un link temporal.</h2>
        <p>Empieza en el plan gratis: 3 apps despiertas, una persona, todas las funciones incluidas.</p>
        <a className="btn" href={signupUrl('es/publicar/claude-code')}>
          Empezar gratis
        </a>
      </section>
    </>
  );
}
