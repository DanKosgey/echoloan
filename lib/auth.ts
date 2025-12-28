import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const SECRET_KEY = process.env.JWT_SECRET || "your-super-secret-key-change-this"
const key = new TextEncoder().encode(SECRET_KEY)

export const encrypt = async (payload: any) => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key)
}

export const decrypt = async (input: string): Promise<any> => {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        })
        return payload
    } catch (error) {
        return null
    }
}

export const getSession = async () => {
    const session = (await cookies()).get("session")?.value
    if (!session) return null
    return await decrypt(session)
}

export const updateSession = async (request: NextRequest) => {
    const session = request.cookies.get("session")?.value
    if (!session) return

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session)
    parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const res = NextResponse.next()

    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    })
    return res
}
