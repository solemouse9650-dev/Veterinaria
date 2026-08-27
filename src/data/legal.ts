import type { LegalSection } from '@/components/legal/LegalDocument'

export const LEGAL_UPDATED = '27 de agosto de 2026'

const clinic = {
  name: 'EcoVet Clínica Veterinaria',
  email: 'ecovetaspotoles@gmail.com',
  phone: '3758-445387',
  address: 'Suipacha 250, Apóstoles, Misiones, Argentina',
  whatsapp: '3758-445387',
}

export const termsSections: LegalSection[] = [
  {
    id: 'informacion-general',
    title: 'Información general',
    paragraphs: [
      `Este sitio web es operado por ${clinic.name} (“EcoVet”, “nosotros”). El responsable del sitio debe completar los siguientes datos legales: [NOMBRE LEGAL DE LA VETERINARIA], [CUIT] y [DOMICILIO LEGAL]. Hasta tanto se completen, se informa como datos de contacto publicados: ${clinic.address}, correo ${clinic.email} y teléfono/WhatsApp ${clinic.phone}.`,
      'El sitio tiene por objeto brindar información sobre la clínica, sus servicios, el equipo, horarios, contenidos de interés y canales de contacto, y permitir la solicitud de turnos en línea.',
    ],
  },
  {
    id: 'uso-del-sitio',
    title: 'Uso del sitio',
    paragraphs: [
      'El acceso y uso del sitio implica la lectura de estos términos. Si no estás de acuerdo, no utilices el sitio.',
      'Está permitido consultar la información, solicitar un turno, enviar un mensaje de contacto y comunicarte por WhatsApp o teléfono para fines relacionados con la atención veterinaria.',
      'Está prohibido usar el sitio para dañar su funcionamiento, intentar acceder a áreas no autorizadas (incluido el panel de administración), introducir código malicioso, recopilar datos de terceros de forma automatizada, suplantar identidades o utilizar el contenido con fines ilícitos.',
    ],
  },
  {
    id: 'servicios-veterinarios',
    title: 'Servicios veterinarios e información publicada',
    paragraphs: [
      'La información del sitio (servicios, horarios, contenidos del blog y descripciones) tiene carácter informativo y de orientación general. No reemplaza la evaluación clínica de un profesional veterinario ni constituye diagnóstico, prescripción o indicación de tratamiento.',
      'La atención concreta de cada animal depende de la consulta presencial, de la historia clínica y del criterio profesional. Los servicios publicados pueden modificarse según disponibilidad, equipamiento y criterio médico.',
      'EcoVet no realiza urgencias. Ante una emergencia, el tutor debe dirigirse a un servicio de guardia u otra clínica que brinde esa modalidad.',
    ],
  },
  {
    id: 'turnos',
    title: 'Solicitud de turnos',
    paragraphs: [
      'El formulario de reservas es una solicitud de turno, no una confirmación automática. El turno queda sujeto a disponibilidad y a la confirmación posterior de la clínica, habitualmente por WhatsApp, teléfono o correo.',
      'Los datos ingresados deben ser veraces. El tutor es responsable de la información de contacto y de la descripción del paciente. EcoVet puede rechazar, reprogramar o cancelar una solicitud cuando no haya disponibilidad, cuando el servicio no se ofrezca o cuando los datos sean incompletos o inexactos.',
    ],
  },
  {
    id: 'whatsapp',
    title: 'Contacto por WhatsApp y otros canales',
    paragraphs: [
      `El sitio incluye enlaces a WhatsApp (${clinic.whatsapp}) y datos de teléfono y correo. WhatsApp es un servicio de terceros (Meta). Al iniciar una conversación aplican también las políticas de esa plataforma.`,
      'Los mensajes enviados por estos canales pueden incluir datos de salud del animal. Usalos solo para consultas relacionadas con la clínica.',
    ],
  },
  {
    id: 'responsabilidades',
    title: 'Responsabilidades',
    paragraphs: [
      'El usuario se obliga a usar el sitio de buena fe y a no introducir información falsa en formularios.',
      'EcoVet procura que la información esté actualizada, pero puede haber errores u omisiones. Si detectás información incorrecta, escribinos a [EMAIL DE CONTACTO] o a ' +
        clinic.email +
        '.',
      'Dentro de lo permitido por la legislación argentina, EcoVet no responde por interrupciones del sitio, fallas de internet, de hosting o de servicios de terceros (por ejemplo Firebase, Vercel o WhatsApp), ni por el uso que terceros hagan de contenidos publicados una vez difundidos lícitamente.',
      'Nada de estos términos pretende excluir o limitar responsabilidades que la ley no permita limitar, en especial las derivadas de la atención profesional veterinaria cuando corresponda según la normativa aplicable.',
    ],
  },
  {
    id: 'propiedad',
    title: 'Propiedad intelectual, fotografías y contenido',
    paragraphs: [
      'Los textos, marcas, logotipo, diseño y fotografías del sitio son de EcoVet o se utilizan con autorización. No está permitido copiarlos, modificarlos o explotarlos comercialmente sin permiso.',
      'Las fotografías de pacientes e instalaciones ilustran la actividad de la clínica. No deben interpretarse como resultado garantizado de un tratamiento ni como identificación de un animal o tutor, salvo que ello surja expresamente.',
    ],
  },
  {
    id: 'enlaces',
    title: 'Enlaces externos y disponibilidad',
    paragraphs: [
      'El sitio puede enlazar a Google Maps, redes sociales y WhatsApp. EcoVet no controla esos sitios y no responde por su contenido, disponibilidad o políticas.',
      'El sitio puede interrumpirse por mantenimiento, actualizaciones o causas ajenas. No se garantiza disponibilidad ininterrumpida.',
    ],
  },
  {
    id: 'modificaciones',
    title: 'Modificaciones',
    paragraphs: [
      'Podemos actualizar estos términos cuando cambie el sitio o la normativa. La fecha de última actualización se indica al inicio de esta página. El uso posterior implica conocimiento de la versión publicada.',
    ],
  },
  {
    id: 'legislacion',
    title: 'Legislación aplicable y jurisdicción',
    paragraphs: [
      'Estos términos se rigen por las leyes de la República Argentina. Para controversias derivadas del uso del sitio, las partes se someten a los tribunales ordinarios competentes de la Provincia de Misiones, sin perjuicio de los derechos irrenunciables del consumidor cuando resulten aplicables.',
    ],
  },
  {
    id: 'contacto',
    title: 'Contacto',
    paragraphs: [
      `Consultas sobre el sitio: ${clinic.email} / ${clinic.phone} / ${clinic.address}. Completar también [EMAIL DE CONTACTO] si el correo legal es distinto del publicado.`,
    ],
  },
]

export const privacySections: LegalSection[] = [
  {
    id: 'datos-que-recopilamos',
    title: 'Qué datos se recopilan',
    paragraphs: [
      'A través de los formularios de contacto y de reserva el sitio puede recopilar: nombre y apellido, correo electrónico, teléfono, datos de la mascota (nombre, especie, raza, edad, peso) y el mensaje o notas que escribas, además del servicio y horario solicitados.',
      'No pedimos documento nacional de identidad, datos bancarios ni historia clínica completa a través del sitio. No debemos recolectar datos que el sitio no necesite para responderte o gestionar un turno.',
    ],
  },
  {
    id: 'finalidad',
    title: 'Para qué se utilizan',
    paragraphs: [
      'Los datos se usan para responder consultas, gestionar solicitudes de turno, contactarte por teléfono, correo o WhatsApp, y administrar internamente la agenda de la clínica.',
      'No utilizamos los datos para publicidad de terceros ni para vender bases de contactos.',
    ],
  },
  {
    id: 'base',
    title: 'Base del tratamiento',
    paragraphs: [
      'El tratamiento se realiza a partir de la solicitud que vos enviás (gestión de una consulta o de un turno) y del interés legítimo de la clínica en organizar la atención, en los términos de la Ley 25.326 de Protección de Datos Personales y normas complementarias.',
    ],
  },
  {
    id: 'almacenamiento',
    title: 'Cómo se almacenan y con quién se comparten',
    paragraphs: [
      'Los datos de formularios se guardan en Firebase (Google), utilizado como base de datos y autenticación del sitio. El hosting del sitio puede estar a cargo de Vercel u otro proveedor de alojamiento. WhatsApp/Meta interviene solo si iniciás una conversación por ese canal.',
      'El acceso a reservas y mensajes de contacto está limitado a cuentas administrativas autorizadas. No se publican estos datos en las páginas públicas.',
    ],
  },
  {
    id: 'derechos',
    title: 'Derechos de las personas',
    paragraphs: [
      'Podés solicitar acceso, corrección o supresión de tus datos, y plantear inquietudes sobre su uso, escribiendo a ' +
        clinic.email +
        ' o a [EMAIL DE CONTACTO]. También podés dirigirte a la Agencia de Acceso a la Información Pública de Argentina, en los términos de la normativa vigente.',
    ],
  },
  {
    id: 'conservacion',
    title: 'Conservación y seguridad',
    paragraphs: [
      'Conservamos las solicitudes el tiempo necesario para gestionar la atención y las obligaciones administrativas de la clínica. Luego pueden eliminarse o anonimizarse.',
      'Aplicamos medidas técnicas razonables (autenticación, reglas de acceso en la base de datos, cifrado en tránsito mediante HTTPS). Ningún sistema es infalible; si tomás conocimiento de un incidente que te afecte, contactanos.',
    ],
  },
  {
    id: 'fotos',
    title: 'Fotografías',
    paragraphs: [
      'El sitio muestra fotografías de instalaciones, del equipo y de pacientes atendidos en la clínica. Si considerás que una imagen te identifica o identifica a tu mascota y querés que se retire, escribinos para evaluarlo.',
    ],
  },
]

export const cookiesSections: LegalSection[] = [
  {
    id: 'que-son',
    title: 'Qué son las cookies',
    paragraphs: [
      'Las cookies son pequeños archivos que un sitio puede guardar en tu dispositivo para recordar preferencias o mantener una sesión. Tecnologías similares incluyen almacenamiento local del navegador.',
    ],
  },
  {
    id: 'que-usa-este-sitio',
    title: 'Qué utiliza realmente este sitio',
    paragraphs: [
      'Este sitio no incorpora herramientas de analítica (por ejemplo Google Analytics) ni cookies de publicidad de terceros.',
      'Para el panel de administración, Firebase Authentication puede guardar información de sesión en el navegador (por ejemplo IndexedDB o almacenamiento local) con el fin de mantener el inicio de sesión del personal autorizado. Eso no aplica a quienes solo navegan el sitio público.',
      'De forma local, el navegador puede guardar un registro breve de intentos de envío de formularios o de inicio de sesión para reducir reenvíos accidentales. Esa información no se usa para perfilado comercial.',
      'El proveedor de hosting puede utilizar cookies técnicas propias de la infraestructura. No controlamos cookies que coloquen WhatsApp, Google Maps o redes sociales si abrís esos servicios.',
    ],
  },
  {
    id: 'gestion',
    title: 'Cómo gestionarlas',
    paragraphs: [
      'Podés borrar cookies y datos de sitios desde la configuración de tu navegador. Si eliminás los datos de Firebase Auth, el personal deberá volver a iniciar sesión en el panel.',
    ],
  },
]

export const noticeSections: LegalSection[] = [
  {
    id: 'titular',
    title: 'Titular del sitio',
    paragraphs: [
      `${clinic.name}. Datos legales a completar: [NOMBRE LEGAL DE LA VETERINARIA], [CUIT], [DOMICILIO LEGAL].`,
      `Domicilio de atención publicado: ${clinic.address}. Correo: ${clinic.email}. Teléfono: ${clinic.phone}.`,
    ],
  },
  {
    id: 'objeto',
    title: 'Objeto',
    paragraphs: [
      'El sitio informa sobre la clínica veterinaria en Apóstoles, Misiones, y permite contactar o solicitar turnos. No es un consultorio virtual ni un servicio de urgencias.',
    ],
  },
  {
    id: 'propiedad-aviso',
    title: 'Propiedad intelectual',
    paragraphs: [
      'El diseño, textos y fotografías del sitio pertenecen a EcoVet o se usan con autorización. Queda prohibida su reproducción no autorizada.',
    ],
  },
  {
    id: 'revision',
    title: 'Revisión profesional',
    paragraphs: [
      'Este aviso y las demás páginas legales son un modelo informativo. Deben ser revisados por un profesional jurídico antes de publicarse como documento definitivo.',
    ],
  },
]
