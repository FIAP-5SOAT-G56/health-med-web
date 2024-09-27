
// import { cookies } from 'next/headers'


// import { cookies } from 'next/headers'
// import { decrypt, encrypt } from './dal'
// import { NextResponse } from 'next/server'
 
// export async function createSession(user: any) {
//   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//   const session =  JSON.stringify({ user, expiresAt })
 
//   cookies().set('session', session, {
//     httpOnly: true,
//     secure: true,
//     expires: expiresAt,
//     sameSite: 'lax',
//     path: '/',
//   })
// }


// export async function updateSession() {
//   const session = cookies().get('session')?.value
//   const payload = await decrypt(session)
 
//   if (!session || !payload) {
//     return null
//   }
 
//   const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//   cookies().set('session', session, {
//     httpOnly: true,
//     secure: true,
//     expires: expires,
//     sameSite: 'lax',
//     path: '/',
//   })
// }

// export function deleteSession() {
//   cookies().delete('session')
// }

// export const verifySession = async () => {
//   const cookie = cookies().get('session')?.value
//   const session = await decrypt(cookie)
 
//   if (!session?.userId) {
//     NextResponse.redirect('/login')
//   }
 
//   return { isAuth: true, userId: 1 }
// }