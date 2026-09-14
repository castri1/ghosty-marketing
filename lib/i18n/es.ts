import type { Dictionary } from './en';

/**
 * Spanish dictionary. Voice: the "simple mortal" (clear, warm, non-technical,
 * for someone who runs a company or a team). Written natively in the design
 * lab (~/AI/White Ghost/lib/i18n/es.ts) and carried here; pricing v2 and the
 * consent banner were added on this side. Typed as `Dictionary` (the English
 * shape) so any missing or extra key fails `tsc`.
 */

export const es: Dictionary = {
  meta: {
    home: {
      title: "White Ghost — tu equipo ya está creando con IA. Nosotros lo hacemos real.",
      description:
        "Tu gente usa Claude todos los días para crear herramientas y agentes, pero casi todo se queda atascado antes de que alguien lo pueda usar. White Ghost le da a toda tu empresa un solo lugar seguro para lanzar, compartir y controlar lo que crea.",
    },
    about: {
      title: "White Ghost — quiénes somos",
      description:
        "Nacimos resolviendo nuestro propio caos. Creemos que cualquiera en una empresa debería poder llevar una idea hasta una app o un agente útil, sin perder el control de su información.",
    },
    compareStack: {
      title: "White Ghost vs. armar tu propio stack (Vercel + Supabase + Railway)",
      description:
        "Para publicar lo que tu equipo crea con IA puedes armar tú mismo un stack técnico (Vercel + Supabase + Railway + accesos + permisos) o usar White Ghost: un solo lugar seguro y bajo control, sin necesidad de ser técnico.",
    },
    story: {
      title: "White Ghost — la historia",
      description:
        "Una historia en scroll: de un simple mortal con Claude en su computador a aplicaciones desplegadas de forma segura con White Ghost.",
    },
    compareHub: {
      title: "White Ghost vs. las alternativas — comparativas",
      description:
        "Cómo se compara White Ghost con armar tu propio stack y con herramientas como Vercel. Cuál te conviene según tu caso.",
    },
    compareVercel: {
      title: "White Ghost vs. Vercel — ¿cuál necesitas?",
      description:
        "Vercel publica apps para desarrolladores. White Ghost es donde toda tu empresa lanza, ve y controla lo que crea con la IA que ya tiene. Comparación lado a lado.",
    },
    pricing: {
      title: "White Ghost — precios",
      description:
        "Construye apps y agentes sin límite en todos los planes; el plan define cuántas quedan despiertas. Free, Solo US$19, Team US$299, Org US$699, Enterprise desde US$1.500 al mes. Usuarios ilimitados en los planes de equipo.",
    },
    security: {
      title: "White Ghost — seguridad y tus datos",
      description:
        "Tu información es de tu empresa: aislada, nunca usada para entrenar nada, y tuya para llevártela. Así cuida White Ghost tus datos.",
    },
    privacy: {
      title: "White Ghost — privacidad",
      description: "Cómo tratamos tu información en White Ghost.",
    },
    terms: {
      title: "White Ghost — términos",
      description: "Términos de uso de White Ghost.",
    },
    useCases: {
      title: "White Ghost — casos de uso por equipo",
      description:
        "Cómo usa White Ghost cada área de tu empresa: equipo comercial, operaciones y finanzas. Sin esperar a sistemas, sin ser técnico.",
    },
  },

  nav: {
    homeAria: "White Ghost — inicio",
    menuAria: "Principal",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    cta: "Empezar",
    signIn: { label: "Iniciar sesión", href: "/signin" },
    items: [
      {
        label: "Producto",
        groups: [
          {
            heading: "Plataforma",
            links: [
              { label: "Apps y agentes", href: "/#product" },
              { label: "Cómo funciona", href: "/#how" },
              { label: "Seguridad", href: "/security" },
            ],
          },
          {
            heading: "Casos de uso",
            links: [
              { label: "Equipo comercial", href: "/use-cases/commercial" },
              { label: "Finanzas", href: "/use-cases/finance" },
              { label: "Operaciones", href: "/use-cases/operations" },
              { label: "Todos los casos", href: "/use-cases" },
            ],
          },
        ],
      },
      { label: "Precios", href: "/pricing" },
      { label: "Comparar", href: "/compare" },
      {
        label: "Recursos",
        groups: [
          {
            heading: "Aprende",
            links: [
              { label: "Docs", href: "/docs" },
              { label: "Guías de deploy", href: "/deploy" },
              { label: "Glosario", href: "/glossary" },
              { label: "Blog", href: "/blog" },
              { label: "Changelog", href: "/changelog" },
            ],
          },
          {
            heading: "Empresa",
            links: [
              { label: "Quiénes somos", href: "/about" },
              { label: "La historia", href: "/story" },
              { label: "Contacto", href: "mailto:hello@whiteghost.ai" },
            ],
          },
        ],
      },
    ],
  },

  localeSwitcher: {
    aria: "Cambiar idioma",
    toEs: "ES",
    toEn: "EN",
  },
  consent: {
    text: "Usamos cookies de analítica para entender cómo se usa este sitio y mejorarlo. Si las rechazas, el sitio funciona igual. Detalles en nuestra",
    policyLabel: "Política de privacidad",
    accept: "Aceptar",
    decline: "Rechazar",
  },

  footer: {
    tagline:
      "Un solo lugar seguro para lanzar, compartir y controlar todo lo que tu equipo crea con IA.",
    rights: "todos los derechos reservados",
    columns: [
      {
        heading: "Producto",
        links: [
          { label: "Cómo funciona", href: "/#how" },
          { label: "Apps y agentes", href: "/#product" },
          { label: "Precios", href: "/pricing" },
          { label: "Seguridad", href: "/security" },
        ],
      },
      {
        heading: "Comparar",
        links: [
          { label: "vs. tu stack", href: "/compare/stack" },
          { label: "vs. Vercel", href: "/compare/vercel" },
          { label: "Casos de uso", href: "/use-cases" },
        ],
      },
      {
        heading: "Recursos",
        links: [
          { label: "Historia", href: "/story" },
          { label: "Docs", href: "/docs" },
          { label: "Blog", href: "/blog" },
          { label: "Novedades", href: "/changelog" },
          { label: "Glosario", href: "/glossary" },
        ],
      },
      {
        heading: "Empresa",
        links: [
          { label: "Quiénes somos", href: "/about" },
          { label: "Contacto", href: "mailto:hello@whiteghost.ai" },
          { label: "Privacidad", href: "/privacy" },
          { label: "Términos", href: "/terms" },
        ],
      },
    ],
  },

  intro: {
    brand: "WHITE GHOST®",
    caption: "AI HECHA REAL",
  },

  home: {
    hero: {
      badge: "Nuevo — tu equipo ya puede crear agentes de IA",
      titleLead: "Tu equipo ya está creando con IA.",
      titleEm: "Nosotros lo hacemos real.",
      body: "Tu gente usa Claude todos los días para crear herramientas y agentes, pero casi todo se queda atascado antes de que alguien lo pueda usar. White Ghost le da a toda tu empresa un solo lugar seguro para lanzar, compartir y controlar lo que crea.",
      ctaPrimary: "Empezar →",
      ctaSecondary: "Ver cómo funciona",
      scroll: "Baja",
      ticker: "Funciona con la IA que ya pagas",
    },
    marquee: {
      aria: "Funciona con la IA que ya usas: Claude, OpenAI, Gemini",
      items: ["Funciona con la IA que ya usas", "Claude", "OpenAI", "Gemini"],
    },
    problem: {
      eyebrow: "01 — El problema",
      titleLead: "Se están creando cosas geniales.",
      titleEm: "Y luego se quedan atascadas.",
      intro:
        "Los tableros, las herramientas y los agentes que tu gente crea con IA son de verdad útiles. Pero sin un hogar, no llegan a ningún lado, y tú te quedas adivinando.",
      pains: [
        {
          title: "Atrapado en un solo computador",
          body: "Alguien crea una herramienta brillante, y nunca sale de su escritorio. La persona que más la necesita ni se entera de que existe.",
        },
        {
          title: "Regado por todas partes",
          body: "Las cosas terminan en mil lugares distintos, bajo mil cuentas distintas. Nadie sabe qué existe ni dónde vive.",
        },
        {
          title: "Sin forma de saber qué es seguro",
          body: "No puedes ver quién creó qué, qué información toca, ni si los datos de tu empresa están protegidos. Así que todo se queda quieto.",
        },
      ],
    },
    how: {
      eyebrow: "02 — Cómo funciona",
      titleLead: "De la idea a estar funcionando,",
      titleEm: "en cinco pasos fáciles.",
      steps: [
        {
          title: "Responde unas preguntas simples.",
          body: "Dile a White Ghost qué quieres — un tablero, una herramienta, un agente — en palabras normales. Tu asistente instala y configura todo; tú nunca lees un log.",
          line: '"Necesito una herramienta simple para llevar las solicitudes de clientes."',
        },
        {
          title: "White Ghost lo deja listo.",
          body: "Todo se prepara detrás de cámaras: con la imagen de tu empresa y conectado a la información correcta.",
          line: "dejando todo listo… hecho ✓",
        },
        {
          title: "Tu equipo crea con la IA que ya usa.",
          body: "Siguen usando Claude, igual que hoy. Nada nuevo que aprender, nada extra que pagar por uso.",
          line: "el mismo Claude. el mismo plan. nada extra.",
        },
        {
          title: "Tú mantienes el control.",
          body: "Un solo tablero te muestra qué se creó, quién lo creó, qué se está usando y exactamente qué información puede tocar cada cosa.",
          line: "ve todo. pausa lo que quieras.",
        },
        {
          title: "Todos comparten.",
          body: "Cada app y agente vive en una biblioteca compartida, así cualquiera en tu empresa encuentra y usa lo que otros hicieron.",
          line: "una biblioteca, abierta para toda la empresa.",
        },
      ],
    },
    apps: {
      eyebrow: "03 — Dos poderes, un lugar",
      titleLead: "Apps y agentes,",
      titleEm: "lado a lado.",
      intro:
        "Ambos corren sobre la IA que tu empresa ya paga. Ambos viven en la misma biblioteca segura y compartida. Sin nuevas suscripciones, sin herramientas regadas.",
      powers: [
        {
          label: "Apps",
          title: "Las herramientas que tu equipo imagina, listas para todos.",
          body: "Tableros, controles, calculadoras, pequeños ayudantes: lo que tu gente imagine, White Ghost le da un hogar real donde toda la empresa lo puede usar.",
          points: [
            "Hechas en palabras simples, sin saber de tecnología",
            "Con la imagen de tu empresa desde el primer día",
            "En vivo en minutos, no en meses",
          ],
        },
        {
          label: "Agentes",
          title: "Agentes de IA que trabajan junto a tu gente.",
          body: "Tu equipo también puede crear agentes: ayudantes que responden preguntas, resuelven tareas y mantienen todo en movimiento. Hechos para trabajar como tú quieras.",
          points: [
            "Responden preguntas y resuelven tareas del día a día",
            "Hechos a la medida de cómo trabaja tu empresa",
            "Funcionan de maravilla, de día y de noche",
          ],
        },
      ],
    },
    control: {
      eyebrow: "04 — El centro de control",
      titleLead: "Un solo tablero.",
      titleEm: "Tranquilidad total.",
      intro:
        "Es la torre de control que ningún proveedor de IA va a construir para una empresa como la tuya: todo lo que crea tu gente con IA, visible y bajo tu control, en un solo lugar.",
      dashboard: {
        title: "tu empresa — todo de un vistazo",
        status: "todo en orden ▪ nada requiere tu atención",
        stats: [
          { value: "12", label: "apps y agentes en vivo" },
          { value: "38", label: "personas usándolos" },
          { value: "100%", label: "información bajo control" },
        ],
        rows: [
          { name: "Seguimiento de Solicitudes", by: "María · Operaciones", sees: "notas de clientes", uses: "214 usos esta semana" },
          { name: "Agente de Ventas", by: "James · Ventas", sees: "info de producto", uses: "163 usos esta semana" },
          { name: "Ayudante de Facturas", by: "Alex · Finanzas", sees: "registros de facturación", uses: "98 usos esta semana" },
        ],
        canSee: "puede ver:",
        live: "en vivo",
      },
      features: [
        {
          title: "Ve todo",
          body: "Cada app y agente de tu empresa, en una vista tranquila. Qué existe, quién lo hizo y cuánto se está usando.",
        },
        {
          title: "Sabe qué es seguro",
          body: "Ve exactamente qué información puede tocar cada cosa, y qué no. Sin adivinar, sin zonas grises.",
        },
        {
          title: "Controla todo",
          body: "Pausa lo que sea, cambia quién lo usa o ajusta qué puede ver. Un toque, listo. Siempre mandas tú.",
        },
      ],
    },
    costs: {
      eyebrow: "05 — Costos bajo control",
      titleLead: "Sin facturas",
      titleEm: "sorpresa.",
      intro:
        "Tu equipo crea con la IA que ya paga, con su propia cuenta. White Ghost no le pone recargo a tus tokens: solo te da los frenos para que nadie abra una cuenta de cinco cifras sin que nadie se diera cuenta.",
      cards: [
        {
          title: "Presupuestos y topes",
          body: "Pon un límite por equipo, por app o para toda la empresa. Cuando se llega al tope, se frena. Tú decides el techo.",
        },
        {
          title: "Alertas, no sorpresas",
          body: "Ve el consumo en vivo y recibe un aviso antes de que algo se dispare, no cuando ya llegó la factura.",
        },
        {
          title: "Tu propia cuenta de IA",
          body: "Cada quien crea con la IA que tu empresa ya paga (Claude, Codex, Gemini). Sin tokens revendidos, sin recargo escondido.",
        },
      ],
    },
    connect: {
      eyebrow: "06 — Conectado a tu stack",
      titleLead: "Conectado a lo que",
      titleEm: "tu empresa ya usa.",
      intro:
        "Las apps y los agentes sirven desde el primer día porque se conectan a tus sistemas de verdad, sin que nadie tenga que armar la plomería técnica. Y siempre al nivel de permisos de quien los usa.",
      tilesLabel: "Se conecta con",
      tiles: ["Shopify", "Tu CRM (HubSpot)", "Meta Ads", "Tu ERP", "Google Workspace", "Tus bases de datos"],
      note: "Conexión gobernada: cada persona solo ve lo que ya tiene permiso de ver. Nada se expone de más.",
    },
    data: {
      eyebrow: "07 — Seguridad, simple",
      titleLead: "Tu información",
      titleEm: "sigue siendo tuya.",
      intro:
        "Decidas como decidas usar White Ghost, una cosa nunca cambia: la información de tu empresa es de tu empresa. Punto.",
      options: [
        {
          label: "Para equipos que crecen",
          title: "Nosotros la cuidamos por ti.",
          body: "White Ghost cuida todo en un espacio protegido, hecho solo para tu empresa. Tu información nunca se comparte, nunca se mezcla con la de nadie y nunca se usa para entrenar nada.",
        },
        {
          label: "Para empresas más grandes",
          title: "O nunca sale de tus paredes.",
          body: "¿Prefieres tener todo en casa? White Ghost puede correr completamente dentro de la nube de tu propia empresa, así tu información se queda exactamente donde dicen tus políticas.",
        },
      ],
    },
    cta: {
      titleLead: "Pon en orden la IA",
      titleEm: "de tu empresa.",
      body: "Tu equipo ya está creando. Dales — y date — el único lugar seguro donde todo se junta.",
      ctaPrimary: "Empezar →",
      ctaSecondary: "Ver cómo funciona",
      note: "Sin nueva IA que comprar ▪ funcionando en días, no en meses",
    },
  },

  about: {
    eyebrow: "Quiénes somos",
    titleLead: "Nacimos resolviendo",
    titleEm: "nuestro propio caos.",
    intro:
      "White Ghost nació dentro de una empresa de logística para tiendas online en Latinoamérica. Cuando nuestra gente empezó a crear cosas increíbles con IA, nos topamos con el mismo problema que vive hoy cualquier empresa: todo quedaba atrapado en computadores sueltos, regado y sin control. Así que construimos el lugar que nos hacía falta.",
    missionTitle: "En qué creemos",
    mission:
      "Creemos que cualquier persona en una empresa — técnica o no — debería poder llevar una idea hasta una app o un agente útil y desplegado, sin sacar su información de control y sin comprar otra IA. White Ghost es el hogar seguro de todo lo que un equipo crea con la IA que ya tiene.",
    teamTitle: "El equipo",
    teamNote: "Fundadores (borrador para revisión).",
    team: [
      { name: "Alejandro Celis", role: "Cofundador" },
      { name: "Andrés Gómez", role: "Cofundador" },
      { name: "Daniel Castrillón", role: "Producto y arquitectura" },
      { name: "Felipe Jaramillo", role: "Cofundador" },
      { name: "Sebastián Román", role: "Cofundador" },
    ],
    ctaTitle: "¿Quieres verlo en tu empresa?",
    cta: "Empezar →",
  },

  compareStack: {
    hero: {
      eyebrow: "Comparar — White Ghost vs. tu stack",
      titleLead: "Vercel monta una app.",
      titleEm: "White Ghost monta tu empresa entera.",
      body: "Para publicar lo que tu equipo crea con IA, alguien técnico podría armar un stack: Vercel para el front, Supabase para los datos, Railway para el back, más accesos, permisos y vigilancia. White Ghost te da todo eso en un solo lugar seguro y bajo control, sin que nadie tenga que ser técnico.",
      ctaPrimary: "Empezar →",
      ctaSecondary: "Ver la comparación",
    },
    table: {
      eyebrow: "01 — Lado a lado",
      titleLead: "Armar tu stack",
      titleEm: "vs. White Ghost.",
      colStack: "Armar tu propio stack",
      colGhosty: "White Ghost",
      rows: [
        {
          capability: "Qué necesitas",
          stack: "Juntar y mantener varias herramientas: Vercel + Supabase + Railway + accesos + permisos.",
          ghosty: "Un solo lugar. White Ghost junta despliegue, datos, accesos y control.",
        },
        {
          capability: "Para quién es",
          stack: "Para desarrolladores que saben conectar cada pieza.",
          ghosty: "Para cualquiera en la empresa, sea técnico o no.",
        },
        {
          capability: "¿Trae su propia IA?",
          stack: "No. Y normalmente terminas pagando otra herramienta de IA aparte.",
          ghosty: "No: corre sobre la IA que ya pagas (Claude, Codex, Gemini). No compras otra IA.",
        },
        {
          capability: "Visibilidad y control",
          stack: "Repartido entre varios tableros técnicos. Difícil ver el todo.",
          ghosty: "Una torre de control: ve cada app y agente, qué toca, quién lo usa y cuánto cuesta. Apaga lo que sea.",
        },
        {
          capability: "Hecho para no técnicos",
          stack: "No. Sin un desarrollador, no arranca.",
          ghosty: "Sí: respondiendo preguntas en lenguaje simple, lo conviertes en una app o un agente.",
        },
        {
          capability: "Tu información",
          stack: "Repartida entre varios proveedores y cuentas.",
          ghosty: "Aislada por empresa, tu código en tu propio GitHub, y puedes salir limpio cuando quieras.",
        },
      ],
    },
    choice: {
      eyebrow: "02 — Cuándo elegir cada uno",
      titleLead: "Cada camino sirve",
      titleEm: "para algo distinto.",
      stackLabel: "Arma tu stack cuando",
      stackBody:
        "Tienes desarrolladores y quieres control total pieza por pieza, y no te importa juntar y mantener varias herramientas para lograrlo.",
      ghostyLabel: "Elige White Ghost cuando",
      ghostyBody:
        "Toda tu empresa ya está creando con IA y necesitas un solo lugar seguro para lanzarlo, verlo y controlarlo, sin comprar otra IA y sin que todos tengan que ser técnicos.",
    },
    faq: {
      eyebrow: "03 — Preguntas",
      titleLead: "Preguntas",
      titleEm: "comunes.",
      items: [
        {
          q: "¿Puedo usar White Ghost junto con Vercel o Supabase?",
          a: "Sí. Resuelven cosas distintas. Esas herramientas son geniales para que un desarrollador publique una app; White Ghost es donde toda una empresa lanza, ve y controla lo que crea con IA. Muchos equipos usarán ambos.",
        },
        {
          q: "¿White Ghost reemplaza mis herramientas de IA?",
          a: "No. White Ghost corre sobre la IA que tu empresa ya paga — Claude, Codex, Gemini. No compras otra IA: White Ghost es el hogar y el centro de control de lo que tu equipo crea con la que ya tienes.",
        },
        {
          q: "¿Mi código queda encerrado en White Ghost?",
          a: "No. Tu código vive en tu propia organización de GitHub y tus datos están aislados por empresa. Si algún día te vas, exportas la base de datos y el código ya es tuyo.",
        },
        {
          q: "¿Necesito ser técnico para usar White Ghost?",
          a: "No. Respondiendo lo que necesitas en lenguaje simple, lo conviertes en una app o un agente desplegado, sin saber de programación.",
        },
      ],
    },
    cta: {
      titleLead: "¿Ya estás creando con IA?",
      titleEm: "Tráelo a un solo lugar.",
      cta: "Empezar →",
      note: "Sin nueva IA que comprar ▪ funcionando en días, no en meses",
    },
  },

  compareHub: {
    eyebrow: "Comparar",
    titleLead: "¿Cómo se compara",
    titleEm: "White Ghost?",
    intro: "Depende de qué estás resolviendo. Aquí te lo ponemos claro, sin tecnicismos.",
    items: [
      {
        title: "White Ghost vs. armar tu stack",
        body: "Vercel + Supabase + Railway juntos vs. un solo lugar seguro y bajo control.",
        href: "/compare/stack",
        cta: "Ver comparación →",
      },
      {
        title: "White Ghost vs. Vercel",
        body: "Vercel publica una app de desarrollador; White Ghost es el hogar de todo lo que crea tu empresa.",
        href: "/compare/vercel",
        cta: "Ver comparación →",
      },
    ],
  },

  compareVercel: {
    hero: {
      eyebrow: "Comparar — White Ghost vs. Vercel",
      titleLead: "Vercel publica apps.",
      titleEm: "White Ghost pone tu IA bajo control.",
      body: "Vercel es donde los desarrolladores publican y alojan apps. White Ghost es el lugar seguro donde toda tu empresa — técnica o no — lanza, ve y controla lo que crea con la IA que ya tiene. No es la misma pelea. Así eliges.",
      ctaPrimary: "Empezar →",
      ctaSecondary: "Ver la comparación",
    },
    table: {
      eyebrow: "01 — Lado a lado",
      titleLead: "Vercel",
      titleEm: "vs. White Ghost.",
      colVercel: "Vercel",
      colGhosty: "White Ghost",
      rows: [
        {
          capability: "Para qué sirve",
          vercel: "Publicar y alojar webs y apps, rápido.",
          ghosty: "Un hogar seguro y compartido para todo lo que tu equipo crea con IA: apps y agentes.",
        },
        {
          capability: "Para quién es",
          vercel: "Desarrolladores y equipos de ingeniería.",
          ghosty: "Cualquiera en la empresa, técnico o no.",
        },
        {
          capability: "¿Trae su propia IA?",
          vercel: "No: traes tu código.",
          ghosty: "No: corre sobre la IA que ya pagas (Claude, Codex, Gemini). No compras otra IA.",
        },
        {
          capability: "Visibilidad y control",
          vercel: "Tableros a nivel de proyecto, pensados para desarrolladores.",
          ghosty: "Una torre de control: ve cada app y agente, qué toca, quién lo usa y cuánto cuesta. Apaga lo que sea.",
        },
        {
          capability: "Hecho para no técnicos",
          vercel: "Pensado para desarrolladores.",
          ghosty: "Sí: respondiendo preguntas en lenguaje simple, lo conviertes en una app o un agente.",
        },
        {
          capability: "Tu código y tus datos",
          vercel: "Tu código se queda en tu repo de Git.",
          ghosty: "Tu código en tu propio GitHub, datos aislados por empresa, y puedes salir limpio cuando quieras.",
        },
      ],
    },
    choice: {
      eyebrow: "02 — Cuándo elegir cada uno",
      titleLead: "Cada herramienta sirve",
      titleEm: "para algo distinto.",
      vercelLabel: "Elige Vercel cuando",
      vercelBody:
        "Eres desarrollador o un equipo de ingeniería y quieres el mejor lugar para publicar y escalar una web o app, con rendimiento y experiencia de desarrollador de primer nivel.",
      ghostyLabel: "Elige White Ghost cuando",
      ghostyBody:
        "Toda tu empresa ya está creando con IA y necesitas un solo lugar seguro para lanzarlo, verlo y controlarlo, sin comprar otra IA y sin que todos tengan que ser técnicos.",
    },
    faq: {
      eyebrow: "03 — Preguntas",
      titleLead: "Preguntas",
      titleEm: "comunes.",
      items: [
        {
          q: "¿Puedo usar White Ghost y Vercel a la vez?",
          a: "Sí. Resuelven cosas distintas. Vercel es genial para que un desarrollador publique apps; White Ghost es donde toda una empresa lanza, ve y controla lo que crea con IA. Muchos equipos usarán ambos.",
        },
        {
          q: "¿White Ghost reemplaza mis herramientas de IA?",
          a: "No. Corre sobre la IA que tu empresa ya paga — Claude, Codex, Gemini. No compras otra IA: White Ghost es el hogar y el centro de control de lo que tu equipo crea con la que ya tienes.",
        },
        {
          q: "¿Mi código queda encerrado?",
          a: "No. Tu código vive en tu propia organización de GitHub y tus datos están aislados por empresa. Si te vas, exportas la base de datos y el código ya es tuyo.",
        },
        {
          q: "¿Necesito ser técnico?",
          a: "No. Respondiendo lo que necesitas en lenguaje simple, lo conviertes en una app o un agente desplegado.",
        },
      ],
    },
    cta: {
      titleLead: "¿Ya estás creando con IA?",
      titleEm: "Tráelo a un solo lugar.",
      cta: "Empezar →",
      note: "Sin nueva IA que comprar ▪ funcionando en días, no en meses",
    },
  },

  pricing: {
    eyebrow: "Precios",
    titleLead: "Construye sin límites.",
    titleEm: "Paga por lo que está despierto.",
    intro:
      "Crea todas las apps y agentes que quieras, en todos los planes: construir nunca se restringe. Tu plan define cuántas pueden estar despiertas en producción al mismo tiempo y cuánta carga aguantan. La IA la pones tú; nunca revendemos tokens. La plataforma pregunta antes de que gastes; nunca cobra después.",
    foundingNote: "Precio de cliente fundador, congelado por 12 meses",
    journey: "Free → Solo → Team → Org → Enterprise",
    journeyNote: "un solo camino: construyes solo, se une tu equipo, lo adopta tu empresa",
    perMonth: "/mes",
    popular: "El más elegido",
    groupSolo: "Para una persona que construye",
    groupTeams: "Para equipos y organizaciones: usuarios ilimitados en todos los planes",
    tiers: [
      {
        name: "Free",
        who: "Empieza a construir. Todo funciona.",
        price: "US$0",
        period: "",
        cta: "Empezar gratis",
        popular: false,
        features: [
          "Construye apps y agentes sin límite",
          "3 apps despiertas (duerme una para despertar otra)",
          "Conecta tus apps entre sí",
          "Base de datos, secretos y modos de acceso",
          "Subdominio de la comunidad · un solo usuario",
        ],
      },
      {
        name: "Solo",
        who: "Para una persona que publica en serio",
        price: "US$19",
        period: "/mes",
        cta: "Pasar a Solo",
        popular: false,
        features: [
          "Construye sin límite · 10 apps despiertas",
          "Dominios propios · builds rápidos",
          "Previews por pull request · diseño con IA",
          "10 GB de archivos",
          "Un solo usuario",
        ],
      },
      {
        name: "Team",
        who: "Tu gente, construyendo junta",
        price: "US$299",
        period: "/mes",
        cta: "Crear tu equipo",
        popular: true,
        features: [
          "Primer mes a US$49, para probarlo en equipo",
          "Usuarios ilimitados · los usuarios finales no pagan",
          "Tu propio ambiente aislado",
          "Malla de empresa: apps y agentes conectados",
          "Tu dominio · tu marca",
          "Construye sin límite · 50 apps despiertas",
          "5M de solicitudes al mes · 50 GB de salida · 20 GB de archivos",
        ],
      },
      {
        name: "Org",
        who: "Toda tu empresa corre sobre esto",
        price: "US$699",
        period: "/mes",
        cta: "Pasar a Org",
        popular: false,
        features: [
          "Todo lo de Team",
          "Construye sin límite · 200 apps despiertas",
          "30M de solicitudes al mes · 300 GB de salida",
          "Base de datos con el doble de rendimiento",
          "100 GB de archivos · techos más altos",
        ],
      },
      {
        name: "Enterprise",
        who: "Organizaciones con exigencias de cumplimiento",
        price: "desde US$1.500",
        period: "/mes",
        cta: "Hablemos",
        popular: false,
        features: [
          "Límites a la medida · base de datos 4×",
          "SSO y revisión de seguridad",
          "Elección de región / residencia de datos",
          "SLA · soporte prioritario",
          "Facturación a empresa",
        ],
      },
    ],
    footnotes: [
      "Nunca limitado por funciones: todas funcionan en todos los planes; los planes solo dimensionan capacidad",
      "Anual: 2 meses gratis",
      "Tus llaves de IA, tus tarifas: sin tokens revendidos",
    ],

    gauge: {
      eyebrow: "Sabe dónde estás parado",
      title: "Un solo medidor. Cero matemáticas de facturación.",
      body:
        "Los proveedores de nube cobran en veinte unidades invisibles. White Ghost las junta en una sola barra que sí se puede leer: cuánto de tu plan estás usando, promediado sobre los últimos 3 días. Avisa al 90%, te dice exactamente qué app lo está empujando y sugiere el momento de subir de plan, antes de que algo se ponga lento.",
      planLabel: "EJEMPLO · PLAN TEAM",
      reading: "72% · subiendo",
      value: 72,
      alert: "alerta al 90%",
      driver: "Lo empuja: una tienda de ejemplo, más de 1.000 visitas al día esta semana",
      bars: [
        { label: "Tráfico", value: 84 },
        { label: "Apps despiertas", value: 62 },
        { label: "Archivos", value: 48 },
        { label: "Cómputo", value: 71 },
      ],
    },

    advanced: {
      eyebrow: "Precios avanzados",
      title: "O ajusta tu plan pieza por pieza",
      body:
        "La mayoría de los equipos simplemente sube de plan cuando el medidor lo dice. Si prefieres afinarlo, abre Avanzado y agrega exactamente lo que necesitas: se compra por adelantado, se confirma antes de cobrar, nunca es un contador.",
      colUnit: "Unidad",
      colPrice: "Precio /mes",
      colWhat: "Qué agrega",
      rows: [
        { unit: "Apps despiertas extra (paquete de 10)", price: "US$15", what: "Diez apps despiertas más allá de tu plan" },
        { unit: "Paquete de archivos", price: "US$15", what: "+100 GB de almacenamiento de archivos" },
        { unit: "Paquete de ancho de banda", price: "US$60", what: "+250 GB de transferencia" },
        { unit: "App siempre caliente", price: "US$99", what: "Sin arranques en frío para una app crítica" },
        { unit: "Base de datos 2×", price: "US$150", what: "El doble de cómputo y memoria detrás de tus datos (incluido en Org)" },
        { unit: "Base de datos 4×", price: "US$350", what: "El escalón pesado, el default de Enterprise" },
        { unit: "Soporte prioritario / SLA", price: "US$199", what: "Compromiso de tiempo de respuesta" },
      ],
    },

    agencies: {
      eyebrow: "Agencias",
      title: "Construye para tus clientes",
      body: "Corre cada cliente en su propio ambiente aislado, con tu marca, desde una sola consola.",
      price: "US$299 /mes + US$179 /mes por ambiente de cliente",
      points: [
        "Consola con tu marca",
        "Vista de todos tus clientes y soporte prioritario",
        "Cada cliente: ambiente aislado, 5 apps despiertas, 1M de solicitudes al mes",
      ],
      example:
        "Una agencia con 5 clientes paga US$1.194 al mes: una sola relación, cinco ambientes aislados, los datos de cada cliente completamente separados.",
    },

    pledge: {
      eyebrow: "El compromiso",
      title: "Tu factura nunca te va a sorprender",
      items: [
        {
          title: "Preguntamos antes de que gastes",
          body: "Llegar a un límite bloquea con una invitación a subir de plan; nunca se cobra después del hecho.",
        },
        {
          title: "Construir nunca es el límite",
          body: "Crea, itera y conserva todas las apps que hagas. Lo que los planes dimensionan es la capacidad: duerme una app cuando quieras para despertar otra.",
        },
        {
          title: "Tu IA, tus tarifas",
          body: "Tus apps y agentes corren sobre la cuenta de IA que ya pagas. Sin tokens revendidos, sin recargos escondidos, sin cuentas de créditos.",
        },
      ],
    },

    ctaTitle: "¿Listo para empezar?",
    cta: "Empezar →",
    note: "Sin nueva IA que comprar ▪ usuarios ilimitados en Team, Org y Enterprise",
  },

  security: {
    eyebrow: "Seguridad y tus datos",
    titleLead: "Tu información",
    titleEm: "es de tu empresa.",
    intro:
      "Sin tecnicismos: esto es lo que hacemos para que estés tranquilo con lo que tu gente crea.",
    points: [
      { title: "Aislado por empresa", body: "Todo lo tuyo vive en un espacio protegido, solo para tu empresa. Nunca se mezcla con el de nadie más." },
      { title: "Nunca entrenamos con tus datos", body: "Tu información es tuya. No la compartimos ni la usamos para entrenar ningún modelo." },
      { title: "Tu código, en tu GitHub", body: "Lo que tu equipo crea vive en la organización de GitHub de tu empresa. Es tuyo desde el día uno." },
      { title: "Puedes llevártelo", body: "Si algún día te vas, sales limpio: exportas la base de datos y el código ya está en tu repo. Sin quedar encerrado." },
      { title: "O nunca sale de tus paredes", body: "Las empresas más grandes pueden correr White Ghost dentro de su propia nube, para que la información se quede donde dicen sus políticas." },
      { title: "Tú decides quién entra", body: "Cada app y agente está privado por defecto. Tú apruebas quién lo usa y qué información puede tocar." },
    ],
    ctaTitle: "¿Quieres verlo en tu empresa?",
    cta: "Únete a la lista de espera →",
  },

  legal: {
    draftNote: "Borrador. No es asesoría legal; pendiente de revisión.",
    updated: "Última actualización: junio 2026",
    privacy: {
      eyebrow: "Privacidad",
      title: "Política de privacidad",
      intro: "Cómo tratamos la información cuando usas White Ghost.",
      sections: [
        { heading: "Qué recogemos", body: "Los datos de contacto que nos das (como tu correo y el nombre de tu empresa) y datos de uso básicos para operar el servicio." },
        { heading: "Cómo lo usamos", body: "Para darte acceso, operar el servicio y comunicarnos contigo. No vendemos tu información ni la usamos para entrenar modelos." },
        { heading: "Tu información de empresa", body: "Lo que tu equipo crea y los datos que conecta viven aislados por empresa y son tuyos. Puedes exportarlos y llevártelos." },
        { heading: "Contacto", body: "¿Dudas de privacidad? Escríbenos a hello@whiteghost.ai." },
      ],
    },
    terms: {
      eyebrow: "Términos",
      title: "Términos de uso",
      intro: "Las reglas básicas para usar White Ghost.",
      sections: [
        { heading: "El servicio", body: "White Ghost es un entorno para lanzar y administrar apps y agentes que tu equipo crea con la IA que tu empresa ya paga." },
        { heading: "Tu cuenta y tu contenido", body: "Eres responsable de tu cuenta y de lo que tu equipo crea. Tu código y tus datos son tuyos." },
        { heading: "Disponibilidad", body: "Estamos en etapa temprana; el servicio puede cambiar mientras lo construimos contigo." },
        { heading: "Contacto", body: "¿Preguntas? Escríbenos a hello@whiteghost.ai." },
      ],
    },
  },

  useCases: {
    eyebrow: "Casos de uso",
    titleLead: "Una herramienta",
    titleEm: "para cada equipo.",
    intro:
      "Lo mismo de fondo, distinto según tu día a día. Mira cómo lo usa cada área de tu empresa, sin esperar a sistemas y sin ser técnico.",
    exploreLabel: "Ver caso →",
    backLabel: "← Todos los casos",
    flowTitle: "Cómo funciona",
    resultLabel: "El resultado",
    ctaTitle: "¿Listo para tu equipo?",
    cta: "Únete a la lista de espera →",
    note: "Sin nueva IA que comprar ▪ funcionando en días",
    roles: [
      {
        slug: "commercial",
        label: "Equipos comerciales",
        blurb: "Tableros de ventas, seguimiento de clientes y agentes que responden dudas de producto.",
        title: "Para tu equipo comercial,",
        titleEm: "sin esperar a sistemas.",
        problem:
          "Tu gente comercial vive pidiendo reportes y herramientas que el área técnica no alcanza a hacer. Mientras tanto, la información de clientes anda en hojas sueltas.",
        steps: [
          { title: "Dilo en palabras", body: "\"Quiero un tablero para ver mi pipeline\" o \"un agente que responda dudas de producto al equipo\"." },
          { title: "White Ghost lo arma", body: "Conectado a tu CRM y a la información correcta, con la imagen de tu empresa." },
          { title: "Todo el equipo lo usa", body: "Cada vendedor lo usa con la IA que ya tiene; tú ves quién lo usa y qué información toca." },
        ],
        result: "Tu equipo deja de esperar y vende con mejores herramientas, hechas por ellos mismos.",
      },
      {
        slug: "operations",
        label: "Operaciones",
        blurb: "Seguimiento de pedidos, alertas y paneles operativos en un solo lugar, no en mil archivos.",
        title: "Para operaciones,",
        titleEm: "todo bajo control.",
        problem:
          "Mil hojas de cálculo y tableros sueltos por todos lados. Nadie sabe cuál es la versión buena ni quién la actualiza.",
        steps: [
          { title: "Dilo en palabras", body: "\"Necesito un panel de pedidos con alertas cuando algo se atrasa\"." },
          { title: "White Ghost lo arma", body: "Conectado a tus sistemas, en un espacio seguro y bajo control." },
          { title: "Una sola fuente de verdad", body: "Todo el equipo ve lo mismo; tú decides quién entra y qué puede ver." },
        ],
        result: "Una sola fuente de verdad, sin perseguir archivos ni adivinar.",
      },
      {
        slug: "finance",
        label: "Finanzas",
        blurb: "Ayudantes de facturación, reportes y conciliaciones con tu información protegida.",
        title: "Para finanzas,",
        titleEm: "con tu información protegida.",
        problem:
          "Datos sensibles repartidos en archivos personales y correos. Reportes que se arman a mano cada mes.",
        steps: [
          { title: "Dilo en palabras", body: "\"Quiero un ayudante que arme el reporte mensual\" o \"que concilie facturas\"." },
          { title: "White Ghost lo arma", body: "Con los datos aislados y seguros, sin sacarlos de control." },
          { title: "Tú controlas el acceso", body: "Decides exactamente quién ve qué; nada queda expuesto en archivos sueltos." },
        ],
        result: "Reportes al día sin exponer datos delicados ni depender de una sola persona.",
      },
    ],
  },

  story: {
    intro: {
      eyebrow: "White Ghost — una historia en scroll",
      titleLead: "Cualquiera en tu empresa puede crear software.",
      titleEm: "Esta es su historia.",
      scrollHint: "Haz scroll y sigue el camino",
    },
    ch1: {
      label: "Cap. 01 — El protagonista",
      titleLead: "Un simple mortal.",
      titleEm: "Cero conocimiento técnico.",
      titleTail: "",
      body: "No es desarrollador. No es “el de sistemas”. Es una persona normal de tu empresa, con el stack de AI que la compañía le dio instalado en su computador: Claude. La única herramienta de AI que necesita.",
      tools: [
        { name: "Claude", desc: "chat para las consultas de todos los días" },
        { name: "Claude Cowork", desc: "su agente para tareas y trabajos del día a día" },
        { name: "Claude Code", desc: "para crear aplicaciones" },
      ],
      toolsNote: "▸ una sola herramienta de AI. instalada en su computador.",
    },
    ch2: {
      label: "Cap. 02 — El freno",
      titleLead: "Crea una aplicación…",
      titleEm: "y no tiene dónde ponerla.",
      titleTail: "",
      body: "¿Un servidor? ¿Vercel? ¿Railway? ¿Backend, frontend? Ni idea. La producción de creatividad se frena. Y entonces pasa lo peor: dashboards en HTML con información delicada de la empresa, compartidos por todos lados.",
      files: [
        "ventas_FINAL_v3.html",
        "nomina_2026.html → whatsapp",
        "clientes(copia).html → gmail personal",
        "dashboard(1).html → usb",
      ],
      chaosNote: "⚠ se vuelve un caos",
    },
    ch3: {
      label: "Cap. 03 — Aparece White Ghost",
      titleLead: "Un ecosistema",
      titleEm: "seguro",
      titleTail: " para tu empresa.",
      body: "Tus empleados ya trabajan con una sola herramienta de AI. White Ghost les da el lugar donde desplegar lo que crean, de forma segura, controlando quién entra y quién no.",
      badges: ["despliegue seguro ✓", "control de acceso ✓", "tu empresa, tus reglas ✓"],
    },
    ch4: {
      label: "Cap. 04 — El wizard",
      titleLead: "Tú respondes preguntas.",
      titleEm: "White Ghost hace el trabajo pesado.",
      titleTail: "",
      body: "Al crear una aplicación, un wizard sencillo pregunta lo que importa — y White Ghost arma todo en una nube segura.",
      wizardHeader: "white ghost · nueva aplicación",
      rows: [
        { q: "¿Quieres base de datos?", a: "sí" },
        { q: "¿Conectar Shopify o VTEX?", a: "sí" },
        { q: "¿HubSpot u otro CRM?", a: "sí" },
        { q: "¿Datos de tu empresa? ¿Tu ERP?", a: "sí" },
        { q: "¿Tu Google Workspace?", a: "sí" },
        { q: "¿Login de seguridad o pública?", a: "login" },
      ],
      create: "▸ crear",
      doneText: "white ghost hace el trabajo pesado…",
      doneOk: "nube segura ✓",
    },
    ch5: {
      label: "Cap. 05 — Crear sin frenos",
      titleLead: "Su propia herramienta.",
      titleEm: "Sin tokens extra, sin cargos sorpresa.",
      titleTail: "",
      body: "Crea dashboards con datos reales, accede a información segura y desarrolla con las últimas prácticas gracias a los skills que White Ghost le da. El resultado: una aplicación espectacular.",
      chips: [
        "skill · ui-design ✓",
        "skill · data-viz ✓",
        "skill · dev-best-practices ✓",
        "0 tokens adicionales",
        "0 extra cargos",
      ],
      resultNote: "▸ resultado: una aplicación espectacular.",
    },
    ch6: {
      label: "Cap. 06 — «Desplegar»",
      titleLead: "Una palabra, y la aplicación",
      titleEm: "cobra vida.",
      titleTail: "",
      body: "Le dice a Claude Code “desplegar” y White Ghost despliega el front end, el back end y todo lo necesario para compartirla en el espacio de trabajo seguro, con la seguridad requerida.",
      cmd: "desplegar",
      labels: ["frontend", "backend", "datos", "seguridad"],
      shared: "compartida en tu espacio de trabajo seguro",
    },
    outro: {
      titleLead: "Todo el mundo feliz, colaborando con",
      titleEm: "una sola herramienta de AI.",
      ctaPrimary: "Empieza con White Ghost →",
      ctaSecondary: "Ver el producto",
      note: "sin nueva AI que comprar ▪ seguro por diseño",
    },
  },

};
