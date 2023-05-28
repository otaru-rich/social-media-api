import winston, { format } from 'winston'

const { combine, prettyPrint } = format

export const logger = winston.createLogger({
  level: 'error',
  format: combine(prettyPrint()),
  transports: [
    new winston.transports.Console()
  ]
})

logger.add(
  new winston.transports.Console({
    format: format.simple(),
    level: 'info'
  })
)
