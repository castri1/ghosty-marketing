import type { Metadata } from 'next';
import Link from 'next/link';
import { GhostMark } from '@/components/GhostMark';
import { signupUrl } from '@/lib/console-url';
import { pageMeta, siteUrl } from '@/lib/site';

const TITLE = "Por qué tu equipo no puede abrir tu link de localhost (y cómo compartirlo de verdad)";
const DESCRIPTION = "Un link de localhost solo abre en tu computador. Por qué pasa, cuándo basta un túnel y cómo publicar una app hecha con Claude Code para que tu equipo la abra cuando quiera.";
const PATH = "/es/localhost";
/** <title> corto; el TITLE largo sigue siendo el H1. */
const TITLE_TAG = "Cómo compartir una app que solo abre en localhost";

const STEPS = [{"name": "Crea la app", "text": "En la carpeta donde Claude Code estuvo trabajando, escribe ghosty init. Eso crea un repositorio en tu propia cuenta de GitHub y registra la app."}, {"name": "Deja que el asistente haga la parte técnica", "text": "Cada app de White Ghost tiene botones de Open in Claude Code y Open in Codex, y una opción Copy the instructions: un prompt listo con la URL de la app y la del repositorio. Lo pegas y Claude Code mueve el proyecto a su sitio y lo sube."}, {"name": "Cada subida queda en vivo", "text": "No hay un paso aparte de publicar. En una app real con frontend y backend los builds han tardado 53 segundos y 1 minuto 27 segundos. Si algo se daña, ghosty rollback o el botón Redeploy sobre cualquier build anterior devuelve la versión buena."}, {"name": "Decide quién puede abrirla", "text": "Pública, un código de invitación compartido (un solo código para todos, trátalo como una contraseña compartida) o un inicio de sesión que tú le programas a la app. El modo queda dentro del código, así que cambiarlo después es editar y volver a subir."}, {"name": "Comparte una dirección permanente", "text": "La app recibe su propia URL, que no cambia y no depende de tu computador. Si tienes un dominio propio, lo apuntas a la app y el certificado se emite y renueva solo."}];

const FAQ = [{"q": "Hice algo con Claude Code y se abre en localhost:3000. ¿Cómo se lo mando a mi jefe?", "a": "Ese link no se puede mandar: localhost quiere decir \"este computador\", así que solo abre en el tuyo. Para una demo rápida, abre un túnel temporal con una herramienta como ngrok y manda la URL que te da. Para algo que tu jefe va a seguir usando, publica la app: con White Ghost escribes ghosty init en la carpeta del proyecto, dejas que Claude Code la suba y compartes la URL permanente que recibe."}, {"q": "¿Puedo mandar el link de localhost por WhatsApp para que mi equipo lo abra?", "a": "Mandarlo sí puedes, pero a nadie le va a abrir. Una dirección de localhost apunta al celular o al portátil de quien la lee, no a tu computador. Manda una URL pública: la de un túnel para una demo corta, o la dirección propia de la app una vez publicada."}, {"q": "¿Cómo comparto lo que hice en Claude Code con mi equipo?", "a": "Publicándolo en un lugar que no sea tu computador. Con White Ghost: ghosty init en la carpeta, botón Open in Claude Code en la página de la app para que el asistente mueva el código y lo suba, y cada subida queda en vivo en una URL permanente. Tú eliges si el link es público, pide un código de invitación compartido o exige un inicio de sesión que tú programas."}, {"q": "Claude Code me hizo una herramienta en mi computador. ¿Cuál es la forma más fácil de ponerla en internet para que otros la usen? No soy programador.", "a": "Publicarla en una plataforma, no abrir un túnel. El túnel depende de que tu computador siga prendido y de que la app esté corriendo. El plan gratis de ngrok sí te da un dominio de desarrollo fijo por cuenta (la dirección ya no cambia en cada reinicio), pero muestra una página de aviso antes de entrar, limita los datos a 1 GB al mes y no permite usar tu propio dominio. Publicada, la app tiene dirección fija, corre sin ti y puedes controlar quién entra."}, {"q": "Claude Code terminó mi app pero no sé qué significa \"deploy\". ¿Qué hago ahora?", "a": "\"Deploy\" significa copiar la app a un computador que está siempre prendido, en un centro de datos, con una dirección pública permanente. Hasta que no lo hagas, la app solo existe en tu máquina. En White Ghost es un comando (ghosty init) y después el asistente sube el código; cada subida queda publicada sola."}];

export const metadata: Metadata = pageMeta({
  title: `${TITLE_TAG} — White Ghost`,
  description: DESCRIPTION,
  path: PATH,
  locale: "es",
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

/** Pilar en español para las preguntas de localhost (q33 a q36, q39): respuesta primero, con las preguntas literales como FAQ. */
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
        <p className="lede">Porque un link que empieza por http://localhost solo funciona en el computador donde está corriendo la app: localhost es el nombre con el que cada computador se llama a sí mismo. Para una demo de diez minutos, abre un túnel. Para algo que tu equipo va a seguir usando, publica la app para que viva sola, con dirección permanente y una regla de acceso.</p>

        <div className="md-prose">
          <h2>Por qué el link no le abre a nadie más</h2>
          <p>
            Cuando Claude Code te dice "tu app está corriendo en http://localhost:3000", quiere
            decir que hay un programita sirviendo la app en este computador, por la puerta número
            3000. De ahí salen dos cosas. La dirección depende de quién la lea: localhost en tu
            máquina es tu máquina, localhost en la de tu compañero es la de él. Y la app existe solo
            mientras tu computador la corre: cierras la terminal o el portátil se duerme y la app
            desaparece, incluso para ti.
          </p>

          <h2>Túnel o publicación: cuál necesitas</h2>
          <table>
            <thead>
              <tr>
                <th>Quieres...</th>
                <th>Usa</th>
                <th>El detalle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mostrarlo en una llamada en los próximos cinco minutos</td>
                <td>Un túnel (ngrok, Cloudflare Tunnel, localtunnel)</td>
                <td>El link solo funciona mientras tu portátil esté despierto y la app corriendo; el plan gratis muestra una página de aviso antes de entrar y limita los datos del mes; cualquiera con la URL entra</td>
              </tr>
              <tr>
                <td>Que tu equipo lo abra mañana desde el celular sin que tú estés conectado</td>
                <td>Publicarla</td>
                <td>Vercel, Netlify, Railway o Render dan por hecho que sabes de Git, terminal y configuración de builds</td>
              </tr>
              <tr>
                <td>Que solo entre el equipo, o que pida login, y actualizarla cada vez que Claude Code cambia algo</td>
                <td>Publicarla en White Ghost</td>
                <td>Hecha para quien no quiere leer nunca un log de build; necesita cuenta de GitHub, donde tu código sigue siendo tuyo</td>
              </tr>
            </tbody>
          </table>

          <h2>De localhost a un link que tu equipo sí puede abrir</h2>
          <ol>
            {STEPS.map((step) => (
              <li key={step.name}>
                <strong>{step.name}.</strong> {step.text}
              </li>
            ))}
          </ol>
          <h2>Qué más viene incluido</h2>
          <p>
            Casi todo lo que se construye con un asistente necesita más que una página. Una app de
            White Ghost incluye una base de datos PostgreSQL administrada, almacenamiento de
            archivos que se agrega cuando tu código lo necesita, secretos que pegas una vez en la
            consola, tareas programadas, un historial de deploys con sus logs y una URL de preview
            por cada pull request abierto. La consola lista las nueve piezas que administra por ti.
          </p>
          <p>
            Esto aplica igual en Colombia, México o Chile: la plataforma no cambia por país. Lo
            único que cambia es dónde compras el dominio, si quieres uno propio.
          </p>
          <h2>Relacionado</h2>
          <ul>
            <li>
              <Link href="/es/blog/no-puedes-mandar-link-localhost">Paso a paso: de localhost:3000 a un link que tu jefe sí abre</Link>
            </li>
            <li>
              <Link href="/es/compartir/claude-code">Cómo compartir lo que hiciste en Claude Code con tu equipo</Link>
            </li>
          </ul>
          <h2>Límites, dichos con claridad</h2>
          <ul>
            <li>White Ghost corre apps en Node y en Python. Un archivo HTML suelto no es una app por sí solo; Claude Code lo convierte en una en pocos minutos.</li>
            <li>La app se apaga cuando nadie la usa, así que la primera visita después de un rato tarda un momento en despertar.</li>
            <li>Necesitas cuenta de GitHub: el código se guarda en tu cuenta y lo puedes bajar en .zip cuando quieras.</li>
            <li>Los links de preview de cada pull request son URLs públicas; no pongas datos de producción detrás de un preview.</li>
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
        <h2>Tu app merece más que un link que se muere con tu portátil.</h2>
        <p>Empieza en el plan gratis: 3 apps despiertas, una persona, todas las funciones incluidas.</p>
        <a className="btn" href={signupUrl('es/localhost')}>
          Empezar gratis
        </a>
      </section>
    </>
  );
}
