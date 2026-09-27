import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function POST(request : NextRequest) {

    const body = await request.json();
    

    if(body.email == null){
        return NextResponse.json(
            {
                message : "Email is required"
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
            }
        )
    }

    const isPasswordValid = await compare(body.password, user.password);
    if(isPasswordValid){

        const secretText = "TemporySecret8929%"

        const secret = new TextEncoder().encode(secretText)

        const token = await new jose.SignJWT(
            {
                email : user.email,
                fName : user.fName,
                lName : user.lName,
                role : user.role,
                privileges : user.privileges
            }
        ).setProtectedHeader({alg : "HS256"}).sign(secret)

        console.log(token)

    }else{
        return NextResponse.json(
            {
                message : "Invalid password"
            }
        )
    }

}