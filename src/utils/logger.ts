import winston, { format } from 'winston'

const { combine, prettyPrint } = format

export const logger = winston.createLogger({
  level: 'info',
  format: combine(prettyPrint(),format.simple()),
  transports: [
    new winston.transports.Console()
  ]
})
