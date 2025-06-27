import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

export async function POST(
  request: Request
) {
  try {
    const body = await request.json()
    const {
      email,
      name,
      password
    } = body

    if (!email || !name || !password) {
      return new NextResponse('Missing info', { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        stats: {
          create: {
            strength: 0,
            intelligence: 0,
            agility: 0,
            endurance: 0,
            willpower: 0
          }
        }
      }
    })

    return NextResponse.json(user)
  } catch (error: any) {
    console.log(error, 'REGISTRATION_ERROR')
    return new NextResponse('Internal Error', { status: 500 })
  }
}