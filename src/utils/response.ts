import { type Response } from 'express'
import { type ResponseBody, type ResponseParams } from '../types/type'

export const sendResponse = ({
  res,
  data,
  message,
  statusCode = 200
}: ResponseParams) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data
  })
}

export function sendResponseOf<T> (res: Response<ResponseBody<T>>, {
  data,
  message,
  statusCode = 200
}: ResponseBody<T>) {
  return res.status(statusCode).json({
    statusCode,
    success: statusCode < 400,
    message,
    data
  })
}
