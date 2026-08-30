export const COUNTRIES: { name: string; code: string }[] = [
  { name: 'Argentina', code: '+54' },
  { name: 'Bolivia', code: '+591' },
  { name: 'Brasil', code: '+55' },
  { name: 'Chile', code: '+56' },
  { name: 'Colombia', code: '+57' },
  { name: 'Costa Rica', code: '+506' },
  { name: 'Cuba', code: '+53' },
  { name: 'Ecuador', code: '+593' },
  { name: 'El Salvador', code: '+503' },
  { name: 'España', code: '+34' },
  { name: 'Estados Unidos', code: '+1' },
  { name: 'Guatemala', code: '+502' },
  { name: 'Honduras', code: '+504' },
  { name: 'México', code: '+52' },
  { name: 'Nicaragua', code: '+505' },
  { name: 'Panamá', code: '+507' },
  { name: 'Paraguay', code: '+595' },
  { name: 'Perú', code: '+51' },
  { name: 'Portugal', code: '+351' },
  { name: 'Puerto Rico', code: '+1' },
  { name: 'República Dominicana', code: '+1' },
  { name: 'Uruguay', code: '+598' },
  { name: 'Venezuela', code: '+58' },
  { name: 'Alemania', code: '+49' },
  { name: 'Australia', code: '+61' },
  { name: 'Canadá', code: '+1' },
  { name: 'Francia', code: '+33' },
  { name: 'Italia', code: '+39' },
  { name: 'Reino Unido', code: '+44' },
  { name: 'Otro', code: '+' },
]

export const COUNTRY_OPTIONS = COUNTRIES.map((item) => ({
  value: item.name,
  label: item.name,
}))

export const COUNTRY_CODE_OPTIONS = [
  ...new Map(COUNTRIES.filter((item) => item.code !== '+').map((item) => [item.code, item])).values(),
].map((item) => ({
  value: item.code,
  label: `${item.code} · ${item.name}`,
}))
