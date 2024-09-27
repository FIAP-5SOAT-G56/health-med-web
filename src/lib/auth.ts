import { cookies } from 'next/headers'
import {jwtDecode} from 'jwt-decode'

interface User {
  sub: string
  name: string
  email: string
  profiles: any
}

export function getUser(): User {
  const token = cookies().get('token')?.value

  if (!token) {
    throw new Error('Unauthenticated.')
  }

  const user: User = jwtDecode(token)
  return user
}

export function getUserNotError(): User {
  const token = cookies().get('token')?.value

  if (!token) {
    throw new Error('Unauthenticated.')
  }

  const user: User = jwtDecode(token)
  return user
}

