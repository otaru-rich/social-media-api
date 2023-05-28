
export interface ResponseParams {
  res: any
  message?: string
  data?: any
  statusCode: number
}

export interface ResponseBody<T> {
  message?: string
  data?: T
  statusCode: number
  success?: boolean
}