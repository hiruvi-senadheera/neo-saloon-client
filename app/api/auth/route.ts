import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

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
        return NextResponse.json(
            {
                message : "Login successful",
            }
        )
    }else{
        return NextResponse.json(
            {
                message : "Invalid password"
            }
        )
    }

}