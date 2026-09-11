import type { Metadata } from 'next';
import { GhostMark } from '@/components/GhostMark';
import { consoleUrl } from '@/lib/console-url';
import { pageMeta, siteUrl } from '@/lib/site';

const TITLE = "Cómo compartir lo que hiciste en Claude Code con tu equipo";
const DESCRIPTION = "Tres formas de compartir una app hecha con Claude Code, desde un zip hasta una herramienta publicada con login. Cuál te sirve y cómo hacer la última sin saber de Git ni de servidores.";
const PATH = "/es/compartir/claude-code";

const STEPS = [{"name": "Crea la app", "text": "En la carpeta donde Claude Code estuvo trabajando, escribe ghosty init. Eso crea un repositorio en tu propia cuenta de GitHub y registra la app. Necesitas cuenta de GitHub; ahí vive tu código y sigue siendo tuyo."}, {"name": "Entrégale el resto al asistente", "text": "Cada app de White Ghost tiene botones de Open in Claude Code y Open in Codex, y una opción Copy the instructions: un prompt listo con la URL de la app y la del repositorio. Lo pegas y Claude Code mueve el proyecto a su sitio, agrega el modo de acceso que elegiste y lo sube."}, {"name": "Cada subida queda en vivo", "text": "No hay un paso aparte de publicar. En una app real con frontend y backend los builds han tardado 53 segundos y 1 minuto 27 segundos. ghosty rollback, o el botón Redeploy sobre cualquier build anterior, devuelve la versión buena."}, {"name": "Manda un solo link", "text": "La URL de la app es permanente. Si tienes un dominio propio, lo apuntas a la app y el certificado se emite y renueva solo. Cuando Claude Code cambie algo, vuelves a subir y todos ven la versión nueva en la misma dirección."}];

const FAQ = [{"q": "¿Cómo comparto lo que hice en Claude Code con mi equipo?", "a": "Publicándolo en un lugar que no sea tu computador. Con White Ghost: ghosty init en la carpeta, botón Open in Claude Code en la página de la app para que el asistente mueva el código y lo suba, y cada subida queda en vivo en una URL permanente. Tú eliges si el link es público, pide un código de invitación compartido o exige un inicio de sesión que tú programas."}, {"q": "¿Cómo comparto un artefacto de Claude con mi equipo sin que necesiten cuenta de Claude?", "a": "Conviértelo en una app publicada en vez de un artefacto compartido. El link de un artefacto es una foto dentro del producto de IA; una app publicada es una página web normal. En White Ghost escribes ghosty init, dejas que Claude Code mueva el código del artefacto a la app y la suba, y tu equipo la abre en una URL permanente sin ninguna cuenta de Claude."}, {"q": "Hice un dashboard con Claude Code para mi equipo. ¿Cómo lo publico para que solo la gente de mi empresa lo pueda abrir?", "a": "Publicándolo con un modo de acceso. En White Ghost la respuesta honesta para \"solo la gente de mi empresa\" es tu propio inicio de sesión: la app pide un login que tú le programas con ayuda de Claude Code. El código de invitación compartido es más simple, pero es un solo código para todos, así que trátalo como una contraseña compartida."}, {"q": "¿Cómo pongo en línea con contraseña una herramienta que hice con IA para que solo mi equipo la vea?", "a": "Eligiendo el modo de código de invitación compartido al crear la app en White Ghost: a quien abra el link se le pide el código que tú le pasaste. Es un código para todo el equipo, no contraseñas por persona. Para cuentas con nombre, usa el modo de inicio de sesión propio."}, {"q": "¿Mi equipo necesita cuenta de Claude o de alguna IA para usar la app?", "a": "No. Una app publicada en White Ghost es una página web normal en una URL normal. Lo único que pueden necesitar es el código de invitación o el inicio de sesión que tú elegiste."}];

export const metadata: Metadata = pageMeta({
  title: `${TITLE} — White Ghost`,
  description: DESCRIPTION,
  path: PATH,
  locale: "es",
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

/** Pilar en español para las preguntas de 'cómo comparto esto con mi equipo' (q35, q37, q38, q45): respuesta primero, preguntas literales como FAQ. */
export default function Page() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: "es",
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      inLanguage: "es",
      name: TITLE,
      description: DESCRIPTION,
      step: STEPS.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'White Ghost', item: siteUrl("/es") },
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
        <p className="kicker">Guía para compartir</p>
        <h1>{TITLE}</h1>
        <p className="lede">Publicándolo. Mandar la carpeta, un zip o un link de localhost le deja a tus compañeros una copia o un link muerto, no una herramienta que puedan abrir todos los días. Una app publicada vive en una sola dirección permanente, se actualiza cada vez que Claude Code cambia algo y tú decides quién puede abrirla. En White Ghost eso es un comando y el asistente hace el resto.</p>

        <div className="md-prose">
          <h2>Las tres formas de compartir, con honestidad</h2>
          <table>
            <thead>
              <tr>
                <th>Forma</th>
                <th>Qué recibe tu equipo</th>
                <th>Qué se rompe</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>La carpeta o un zip</td>
                <td>Una copia del código que cada uno tiene que correr</td>
                <td>Todos necesitan las herramientas instaladas; cada cambio es volver a mandarlo; no hay datos compartidos</td>
              </tr>
              <tr>
                <td>Un link de localhost o de un túnel</td>
                <td>Una ventana a la app que corre en tu portátil</td>
                <td>Se muere cuando tu computador se duerme; la URL gratis del túnel cambia al reiniciar; cualquiera con la URL entra</td>
              </tr>
              <tr>
                <td>Una app publicada</td>
                <td>Una URL permanente, una base de datos, un solo lugar donde actualizar</td>
                <td>La mayoría de plataformas esperan Git, terminal y configuración de builds. White Ghost es la que está hecha para quien no tiene nada de eso</td>
              </tr>
            </tbody>
          </table>

          <h2>Quién puede abrirla: los tres modos de acceso</h2>
          <ul>
            <li><strong>Pública.</strong> Cualquiera con el link.</li>
            <li><strong>Código de invitación compartido.</strong> La gente necesita un código que tú les pasas. Es un solo código para todos, no una lista de invitados con nombre, así que trátalo como una contraseña compartida.</li>
            <li><strong>Tu propio inicio de sesión.</strong> La app pide un login que tú le programas, por ejemplo con ayuda de Claude Code. Es el modo para "solo la gente de mi empresa".</li>
          </ul>
          <p>
            El modo queda dentro del código de la app, así que cambiarlo después es editar y volver
            a subir, no mover un interruptor. Quien la usa nunca necesita cuenta en ninguna
            plataforma de IA.
          </p>

          <h2>De tu portátil a tu equipo, en cuatro pasos</h2>
          <ol>
            {STEPS.map((step) => (
              <li key={step.name}>
                <strong>{step.name}.</strong> {step.text}
              </li>
            ))}
          </ol>
          <h2>Lo que la herramienta de tu equipo recibe gratis</h2>
          <p>
            Una base de datos PostgreSQL administrada (para que todos trabajen sobre los mismos
            datos y no sobre copias), almacenamiento de archivos que se agrega cuando tu código lo
            necesita, secretos que pegas una vez en la consola y nunca en el código, integraciones
            con servicios como Slack, Stripe u OpenAI sin pegar llaves de API, tareas programadas,
            analítica con solicitudes y errores por día, y una URL de preview por cada pull request
            abierto para revisar un cambio antes de que salga.
          </p>
          <p>
            Esto aplica igual en Colombia, México o Chile: la plataforma no cambia por país.
          </p>
          <h2>Límites, dichos con claridad</h2>
          <ul>
            <li>White Ghost corre apps en Node y en Python. Un archivo HTML suelto va dentro de una app web pequeña; Claude Code lo hace en minutos.</li>
            <li>La app se apaga cuando nadie la usa, así que la primera visita después de un rato tarda un momento en despertar.</li>
            <li>El código de invitación compartido no es una lista de invitados: no se puede revocar a una sola persona. Si eso importa, usa tu propio inicio de sesión.</li>
            <li>Los links de preview de cada pull request son URLs públicas; no pongas datos de producción en un preview.</li>
          </ul>

          <h2>Las preguntas que la gente hace de verdad</h2>
          {FAQ.map((item) => (
            <div key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </article>

      <section className="closing">
        <GhostMark className="ghost-mark" />
        <h2>Tu equipo merece una herramienta, no una copia de una.</h2>
        <p>Si construyes por tu cuenta puedes empezar hoy. El acceso a la beta es gratis.</p>
        <a className="btn" href={consoleUrl('/signup')}>
          Entrar a la beta
        </a>
      </section>
    </>
  );
}
