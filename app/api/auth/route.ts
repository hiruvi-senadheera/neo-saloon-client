import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function POST(request : NextRequest){

    const body = await request.json()

    if(body.email == null){
        return NextResponse.json(
            {
                message : "Email is required"
            },
            {
                status : 400
            }
        )
    }

    if(body.password == null){
        return NextResponse.json(
            {
                message : "Password is required"
            },
            {
                status : 400
            }
        )
    }

    const user = await prisma.user.findFirst(
        {
            where : {
                email : body.email
            }
        }
    )

    if(user == null){
        return NextResponse.json(
            {
                message : "User not found"
            },
            {
                status : 401
            }
        )
    }

    if(user.status != "ACTIVE"){
        return NextResponse.json(
            {
                message : "Your account is disabled. Please contact the administrator."
            },
            {
                status : 403
            }
        )
    }

    //check password valid
    const isPasswordValid = await compare(body.password, user.password)

    if(isPasswordValid){

            //last login time update
            await prisma.user.update({
                where : {
                    id : user.id
                },
                data : {
                    lastLogin : new Date()
                }
            })
        
            const secretText = process.env.JOSE_SECRET
            const secret = new TextEncoder().encode(secretText)
            const token = await new jose.SignJWT({
                email : user.email,
                firstName : user.firstName,
                lastName : user.lastName,
                role : user.role,
                privileges : user.privileges
            }).setProtectedHeader({alg : "HS256"}).sign(secret)

            const response = NextResponse.json(
            {
                message : "Login successful",
                role : user.role
            },
            {
                status : 200
            }
        )

        response.cookies.set({
            name : "login-token",
            value : token,
            httpOnly : true,
            secure : false,
            sameSite : "lax",
            maxAge : 60 * 60 * 24 * 7    //  7days
        })

        return response
        
    }else{
        return NextResponse.json(
            {
                message : "Invalid password"
            },
            {
                status : 401
            }
        )
    }

}