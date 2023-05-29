
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

export interface PostParams {
  title: string;
  content: string;
  userId: string;
}

export interface UserId {
  userId: string
}

export enum Role {
  GUEST = 'UNAUTHENTICATED',
  USER = 'AUTHENTICATED',
  ADMIN = 'SUPER_ADMIN',
}
