import { api } from "@/lib/api"
import { SignupFormSchema } from "../lib/definitions"
// import { createSession, deleteSession } from "../lib/session"
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from "next/headers"

import { redirect } from 'next/navigation'
import { createSession } from "../lib/session"

export async function signup(state: any, formData: FormData) {
    const validatedFields = SignupFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
      })
     
      console.log(validatedFields.success)

      // If any form fields are invalid, return early
      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
        }
      }

  const {  email, password } = validatedFields.data
   try {
    const registerResponse = await api.post('/v1/users/login', {
      email, password,
    })
  
    console.log(registerResponse.data)
    // const redirectUrl = new URL('/')
    const cookieExpiresInSecond = 60 * 60 * 24 * 30

    window.location.href = "/api/auth/callback?code=" + registerResponse.data.data.access_token;

     NextResponse.redirect('http://localhost:3000/ttt', {
      headers: {
        'Set-Cookie': `token=${registerResponse.data.access_token}; Path=/; max-age=${cookieExpiresInSecond};`,
      },
    })

   } catch (error) {
    console.log(error)
    return {
      errors: {
          email: [ 'Erro ao logar']
    }
   }

  }

  //await createSession(registerResponse)
  // 5. Redirect user

  }

// export async function logout() {
//     deleteSession()
//     return NextResponse.redirect('/login')
// }