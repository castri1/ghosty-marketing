import type { Metadata } from 'next';
import Link from 'next/link';
import { GhostMark } from '@/components/GhostMark';
import { signupUrl } from '@/lib/console-url';
import { pageMeta, siteUrl } from '@/lib/site';

const TITLE = 'Cómo publicar una app hecha con Codex';
const TITLE_TAG = 'Publicar una app hecha con Codex';
const DESCRIPTION =
  'Codex escribe código normal. ChatGPT Sites lo aloja en OpenAI. Para una app en tu repositorio, con las reglas de acceso que elijas, publícala con White Ghost.';
const PATH = '/es/publicar/codex';
const REVISADO = 'Revisada por el equipo de White Ghost, septiembre de 2026';

const REQUISITOS = [
  'La carpeta donde Codex estuvo trabajando, con la app corriendo en tu computador (el link de localhost).',
  'Una cuenta de GitHub. Es el "Google Drive de los programadores": ahí queda tu código, sigue siendo tuyo y lo puedes bajar en .zip cuando quieras.',
  'Una app en Node o en Python. Un archivo HTML suelto todavía no es una app; Codex lo convierte en una en pocos minutos.',
  'Una cuenta de White Ghost. Con el plan gratis alcanza para la primera: 3 apps despiertas, una persona, todas las funciones.',
  'Codex CLI (o la extensión de Codex) abierto en esa carpeta. Él hace la parte técnica; tú apruebas.',
];

const PROMPT =
  'Instala el CLI de ghosty (npm install -g ghosty-cli), inicia sesión con ghosty login y corre ghosty init en esta carpeta para crear la app y su repositorio. Sube el código y corre ghosty deploy hasta que la app quede en vivo. Usa salida --json y dime la URL final.';

const PASOS = [
  {
    name: 'Instalar el CLI una sola vez (o que lo haga tu asistente)',
    text: 'npm install -g ghosty-cli. Todos los comandos aceptan --json y terminan con una línea de "listo" que el asistente sabe leer, así que Codex CLI y otros agentes pueden llevar todo el flujo.',
    check: 'ghosty --version muestra un número de versión.',
  },
  {
    name: 'Iniciar sesión',
    text: 'ghosty login. Sin contraseñas: link al correo, Google, GitHub o passkey.',
    check: 'El comando termina con la línea de "listo" y tu correo; en console.whiteghost.ai apareces con la sesión iniciada.',
  },
  {
    name: 'Crear la app',
    text: 'ghosty init hace unas pocas preguntas y crea un repositorio normal en tu cuenta de GitHub. Trae el código que escribió Codex, o sigue construyendo dentro de la estructura que te da.',
    check: 'La app aparece en el panel de la consola y el repositorio aparece en tu cuenta de GitHub.',
  },
  {
    name: 'Seguir construyendo con tu asistente',
    text: 'ghosty dev corre la app en tu computador. Cada app trae instrucciones de arranque que le enseñan a Codex, a Claude Code y a otros asistentes sus convenciones.',
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
    q: '¿Un sitio de Codex se puede compartir en público?',
    a: 'Sí, desde que ChatGPT Sites salió de beta en julio de 2026: los suscriptores de pago pueden publicar sitios visibles para cualquiera. La diferencia que queda es el control: con White Ghost la app vive en tu propia cuenta de GitHub y tú eliges entre pública, un código de invitación compartido, los miembros de tu espacio o el inicio de sesión de la propia app, sin que la app dependa de un plan de ChatGPT.',
  },
  {
    q: '¿White Ghost funciona con Codex, o solo con Claude?',
    a: 'Es agnóstico del asistente. Las apps son repositorios normales y el CLI de ghosty es una herramienta de línea de comandos común con salida --json, así que Codex CLI, Claude Code, Cursor, OpenCode y otros asistentes lo pueden manejar.',
  },
  {
    q: '¿Puedo sacar una app de ChatGPT Sites?',
    a: 'El código que escribió Codex es tuyo: vuélvelo un repositorio, corre ghosty init en esa carpeta y publica. Desde ahí la app vive en tu propia cuenta de GitHub, con base de datos, archivos y reglas de acceso que tú controlas.',
  },
  {
    q: '¿Qué recibe una empresa además del hosting?',
    a: 'Un ambiente aislado por empresa (su propia base de datos, dominios y pipeline de build) más la administración del equipo: quién puede construir, quién puede ver, y todas las apps en un solo lugar.',
  },
];

const OPCIONES = [
  {
    option: 'ChatGPT Sites (Codex)',
    bestFor: 'Suscriptores de pago de ChatGPT que quieren publicar un sitio rápido en el hosting de OpenAI',
    tradeoff:
      'La app vive con OpenAI, crearla exige un plan de pago y el control de acceso más allá de público o espacio de trabajo es limitado',
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
    bestFor: 'Apps que abre quien tú decidas, sin cuenta de IA, en un repositorio que es tuyo',
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

/** Gemela en español de /deploy/codex: respuesta primero, en el vocabulario del simple mortal. */
export default function PublicarCodex() {
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
          Codex escribe código normal. Si lo que quieres es un sitio rápido dentro del mundo de
          OpenAI, ChatGPT Sites lo aloja. Si quieres una app en tu propio repositorio, con base de
          datos y con las reglas de acceso que tú elijas, la publicas con White Ghost: un solo CLI
          que Codex maneja por ti, y la app queda en vivo en una URL permanente.
        </p>

        <div className="md-prose">
          <h2>Qué necesitas antes de empezar</h2>
          <ul>
            {REQUISITOS.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <h2>Pídeselo a Codex</h2>
          <p>Pega esto en Codex, parado en la carpeta de tu app:</p>
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

          <h2>Qué recibes después de publicar</h2>
          <p>
            Cada app viene con un historial de despliegues (cada build guarda su commit, sus tiempos
            y su log, con botón de Redeploy), un feed de logs en vivo, analítica con peticiones y
            errores por día, y una URL de preview viva por cada pull request abierto. Los secretos se
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

          <h2>Dónde puede vivir una app de Codex: el mapa honesto</h2>
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
              <Link href="/es/publicar/claude-code">Cómo publicar una app hecha con Claude Code</Link>
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
        <a className="btn" href={signupUrl('es/publicar/codex')}>
          Empezar gratis
        </a>
      </section>
    </>
  );
}
