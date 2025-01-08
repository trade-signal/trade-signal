const getColor = (foregroundColor: string = '', backgroundColor: string = '') => {
  let fgc = '\x1b[30m'
  switch (foregroundColor.trim().toLowerCase()) {
    case 'black':
      fgc = '\x1b[30m'
      break;
    case 'red':
      fgc = '\x1b[31m'
      break;
    case 'green':
      fgc = '\x1b[32m'
      break;
    case 'yellow':
      fgc = '\x1b[33m'
      break;
    case 'blue':
      fgc = '\x1b[34m'
      break;
    case 'magenta':
      fgc = '\x1b[35m'
      break;
    case 'cyan':
      fgc = '\x1b[36m'
      break;
    case 'white':
      fgc = '\x1b[37m'
      break;
  }

  let bgc = ''
  switch (backgroundColor.trim().toLowerCase()) {
    case 'black':
      bgc = '\x1b[40m'
      break;
    case 'red':
      bgc = '\x1b[41m'
      break;
    case 'green':
      bgc = '\x1b[42m'
      break;
    case 'yellow':
      bgc = '\x1b[43m'
      break;
    case 'blue':
      bgc = '\x1b[44m'
      break;
    case 'magenta':
      bgc = '\x1b[45m'
      break;
    case 'cyan':
      bgc = '\x1b[46m'
      break;
    case 'white':
      bgc = '\x1b[47m'
      break;
  }

  return `${fgc}${bgc}`
}
const getColorReset = () => {
  return '\x1b[0m'
}

const scoped = new Map<string, number>()
const nameScopedList = [
  getColor('cyan', ''),
  getColor('magenta', ''),
  getColor('red', ''),
  getColor('blue', ''),
  getColor('yellow', ''),
  getColor('green', ''),
]
const prefixScopedList = [
  getColor('red', 'cyan'),
  getColor('white', 'magenta'),
  getColor('cyan', 'red'),
  getColor('white', 'blue'),
  getColor('magenta', 'yellow'),
  getColor('blue', 'green'),
]
let nameIndex = 0
let prefixIndex = 0
const scopedMax = nameScopedList.length

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
      scoped.set(`${PREFIX}${prefix}`, prefixIndex % scopedMax)
      prefixIndex++
    }
    if (!scoped.has(`${NAME}${name}`)) {
      scoped.set(`${NAME}${name}`, nameIndex % scopedMax)
      nameIndex++
    }
  }

  print(foregroundColor: string = 'black', backgroundColor: string = 'white', icon = '', ...strings: any[]) {

    if (this.#prefix || this.#name) {
      const prefixStr = this.#prefix ? ` ${getScoped(this.#prefix, true)}[${this.#prefix}]${getColorReset()}` : ''
      const nameStr = this.#name ? `${getScoped(this.#name)} [${this.#name}] ${getColorReset()}` : ''
      const message = strings.join('')
      console.log(`${icon}${prefixStr}${nameStr}${getColor(foregroundColor, backgroundColor)}${message}${getColorReset()}`)
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
  
    this.print('black', '', icon, message)
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
