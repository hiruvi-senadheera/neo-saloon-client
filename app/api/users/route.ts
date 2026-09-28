import prisma from "@/lib/prisma";
import { getUser, isPrivileged } from "@/utils/authentication";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";




// read users
export async function GET(request : NextRequest){

    const havePrivilege = await isPrivileged(request, "users:read")

    if(!havePrivilege){
        return NextResponse.json(
            {
                message : "You do not have the privilege to view users."
            },
            {
                status : 403
            }
        )
    }


        const users = await prisma.user.findMany({
            select : {
                userId : true,
                email : true,
                phone : true,
                fName : true,
                lName : true,
                password : false,
                role : true,
                status : true,
                createdAt : true,
                lastLogin : true,
                
            }
        }) 

        return NextResponse.json(
            {
                message : "Users fetched successfully",
                users : users
            },
       )
}



// user registration
export async function POST(request : NextRequest){

    // email, fName, lName, password, phone(optional)
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

    if(body.fName == null){
        return NextResponse.json(
            {
                message : "First name is required"
            },
            {
                status : 400
            }
        )
    }

    if(body.lName == null){
        return NextResponse.json(
            {
                message : "Last name is required"
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

    const existingUser = await prisma.user.findUnique(
        {
            where : { 
                email : body.email
          }
        }
    )

    if(existingUser != null){
        return NextResponse.json(
            {
                message : "User with this email already exists"
            },
            {
                status : 400
            }
        )
    }

    //create password hash
    const passwordHash = await bcrypt.hash(body.password, 10)

    //register user
    await prisma.user.create(
        {
            data :{
                email : body.email,
                fName : body.fName,
                lName : body.lName,
                password : passwordHash,
                phone : body.phone
            }
        } 
    )

    return NextResponse.json(
        {
            message : "User registered successfully"
        },
        {
            status : 201
        }
    )

    
}