export const languages = { en: 'English', es: 'Español' } as const

export type Lang = keyof typeof languages

const workBase: Record<Lang, string> = { en: '/work', es: '/es/proyectos' }

export const caseUrl = (lang: Lang, slug: string) => `${workBase[lang]}/${slug}`

export const homeUrl = (lang: Lang) => (lang === 'en' ? '/' : '/es/')

export const ui = {
  en: {
    'nav.work': 'Work',
    'nav.webs': 'Websites',
    'nav.about': 'About',
    'nav.resume': 'Resume',
    'nav.cta': 'Email me',
    'nav.switch': 'ES',
    'nav.switchLabel': 'Leer en español',
    'nav.home': 'Luis Ticona, home',
    'case.outcome': 'Outcome',
    'case.role': 'Role',
    'case.team': 'Team',
    'case.duration': 'Duration',
    'case.tools': 'Tools',
    'case.close.title': 'This was the trailer.',
    'case.close.body': "I'd love to walk you through the full story, dead ends included.",
    'case.close.button': 'Email me',
    'case.close.back': 'Back to all work',
    'todo.label': 'Pending',
    'block.drawn': 'Drawn and built by',
    'block.location': 'Location',
    'block.locationValue': 'Lima, Peru · UTC−5',
    'block.stack': 'Built with',
    'block.contact': 'Contact',
    'block.sheet': 'Sheet',
  },
  es: {
    'nav.work': 'Proyectos',
    'nav.webs': 'Webs',
    'nav.about': 'Sobre mí',
    'nav.resume': 'CV',
    'nav.cta': 'Escríbeme',
    'nav.switch': 'EN',
    'nav.switchLabel': 'Read in English',
    'nav.home': 'Luis Ticona, inicio',
    'case.outcome': 'Resultado',
    'case.role': 'Rol',
    'case.team': 'Equipo',
    'case.duration': 'Duración',
    'case.tools': 'Herramientas',
    'case.close.title': 'Esto fue el tráiler.',
    'case.close.body': 'Me encantaría contarte la historia completa, incluidos los caminos que no funcionaron.',
    'case.close.button': 'Escríbeme',
    'case.close.back': 'Volver a todos los proyectos',
    'todo.label': 'Pendiente',
    'block.drawn': 'Diseñado y construido por',
    'block.location': 'Ubicación',
    'block.locationValue': 'Lima, Perú · UTC−5',
    'block.stack': 'Hecho con',
    'block.contact': 'Contacto',
    'block.sheet': 'Lámina',
  },
} as const

export const useTranslations = (lang: Lang) => (key: keyof (typeof ui)['en']) => ui[lang][key]
