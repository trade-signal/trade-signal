
const isSuppers256Color = process.env.TERM && process.env.TERM.includes('256color')

const friendlyColors = {
  fgc: {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
  },
  brightFgc: {
    red: '\x1b[38;5;196m',
    green: '\x1b[38;5;10m',
    yellow: '\x1b[38;5;220m',
    blue: '\x1b[38;5;21m',
    magenta: '\x1b[38;5;201m',
    cyan: '\x1b[38;5;44m',
  },
}

const getColor = (foregroundColor: string = '', backgroundColor: string = '', bold = false) => {
  let fgc = '\x1b[30m'
  const fgcKey = foregroundColor.trim().toLowerCase()
  switch (fgcKey) {
    case 'black':
      fgc = isSuppers256Color ? '\x1b[90m' : '\x1b[30m'  
      break;
    case 'white':
      fgc = isSuppers256Color ? '\x1b[97m' : '\x1b[37m'
      break;
    case 'red':
    case 'green':
    case 'yellow':
    case 'blue':
    case 'magenta':
    case 'cyan':
      fgc = isSuppers256Color ? friendlyColors.brightFgc[fgcKey] : friendlyColors.fgc[fgcKey]
      break;
  }

  let bgc = ''
  const base = isSuppers256Color ? 100 : 40
  switch (backgroundColor.trim().toLowerCase()) {
    case 'black':
      bgc = `\x1b[${base}m`
      break;
    case 'red':
      bgc = `\x1b[${base + 1}m`
      break;
    case 'green':
      bgc = `\x1b[${base + 2}m`
      break;
    case 'yellow':
      bgc = `\x1b[${base + 3}m`
      break;
    case 'blue':
      bgc = `\x1b[${base + 4}m`
      break;
    case 'magenta':
      bgc = `\x1b[${base + 5}m`
      break;
    case 'cyan':
      bgc = `\x1b[${base + 6}m`
      break;
    case 'white':
      bgc = `\x1b[${base + 7}m`
      break;
  }

  return `${bold ? '\x1b[1m' : ''}${fgc}${bgc}`
}
const getColorReset = () => {
  return '\x1b[0m'
}

const scoped = new Map<string, number>()
const nameScopedList = [
  getColor('cyan', '', true),
  getColor('magenta', '', true),
  getColor('red', '', true),
  getColor('blue', '', true),
  getColor('yellow', '', true),
  getColor('green', '', true),
]
const prefixScopedList = [
  getColor('white', 'black', true),
  getColor('black', 'cyan', true),
  getColor('white', 'magenta', true),
  getColor('white', 'red', true),
  getColor('white', 'blue', true),
  getColor('black', 'yellow', true),
  getColor('black', 'green', true),
  getColor('black', 'white', true),
]
let nameIndex = 0
let prefixIndex = 0

const PREFIX = 'PREFIX_'
const NAME = 'NAME_'

const getScoped = (name: string, isPrefix: boolean = false) => {
  const list = isPrefix ? prefixScopedList : nameScopedList
  return list[scoped.get(`${isPrefix ? PREFIX : NAME}${name}`)!]
}


class Logger {
  #name = ''
  #prefix = ''
  #useIcon = true

  constructor(name: string, prefix: string = '', useIcon: boolean = true) {
    this.#name = name
    this.#prefix = prefix
    this.#useIcon = useIcon

    if (!scoped.has(`${PREFIX}${prefix}`)) {
      scoped.set(`${PREFIX}${prefix}`, prefixIndex % prefixScopedList.length)
      prefixIndex++
    }
    if (!scoped.has(`${NAME}${name}`)) {
      scoped.set(`${NAME}${name}`, nameIndex % nameScopedList.length)
      nameIndex++
    }
  }

  print(foregroundColor: string = 'black', backgroundColor: string = 'white', icon = '', ...strings: any[]) {
    if (this.#prefix || this.#name) {
      const prefixStr = this.#prefix ? ` ${getScoped(this.#prefix, true)} ${this.#prefix} ${getColorReset()}` : ''
      const nameStr = this.#name ? `${getScoped(this.#name)} [${this.#name}] ${getColorReset()}` : ''
      const message = strings.join('')
      console.log(`${icon}${prefixStr}${nameStr}${getScoped(this.#name) === getColor(foregroundColor, '', true) ? getColor('blue', backgroundColor) : getColor(foregroundColor, backgroundColor)}${message}${getColorReset()}`)
      return
    }

    console.log(`${icon}${getColor(foregroundColor, backgroundColor)}${strings.join('')}${getColorReset()}`)
  }
  
  clear() {
    console.clear()
  }

  log(message: string, useIcon?: boolean) {
    const icon = useIcon === false
      ? ''
      : useIcon || this.#useIcon
        ? '\u25ce '
        : ''
  
    this.print('magenta', '', icon, message)
  }
  
  warn(message: string, useIcon?: boolean) {
    const fg = 'yellow'
    const bg = ''
    const icon = useIcon === false
      ? ''
      : useIcon || this.#useIcon
        ? '\u26a0'
        : ''
  
    this.print(fg, bg, icon, message)
  }
  
  error(message: string, useIcon?: boolean) {
    const fg = 'red'
    const bg = ''
    const icon = useIcon === false
      ? ''
      : useIcon || this.#useIcon
        ? '\u26a0'
        : ''
    
    this.print(fg, bg, icon, message)
  }
  
  info(message: string, useIcon?: boolean) {
    const fg = 'blue'
    const bg = ''
    const icon = useIcon === false
      ? ''
      : useIcon || this.#useIcon
        ? '\u26a0'
        : ''
    
    this.print(fg, bg, icon, message)
  }
  
  success(message: string, useIcon?: boolean) {
    const fg = 'green'
    const bg = ''
    const icon = useIcon === false
      ? ''
      : useIcon || this.#useIcon
        ? '\u26a0'
        : ''
    
    this.print(fg, bg, icon, message)
  }
}

export function createLogger (name: string, prefix: string = '', useIcon: boolean = true) {
  return new Logger(name, prefix, useIcon)
}

const logger = createLogger('', '', false)

export const log = logger.log.bind(logger)
export const warn = logger.warn.bind(logger)
export const error = logger.error.bind(logger)
export const info = logger.info.bind(logger)
export const success = logger.success.bind(logger)
export const clear = logger.clear.bind(logger)

export default logger
