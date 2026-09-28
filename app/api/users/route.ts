import prisma from "@/lib/prisma";
import { getUser } from "@/utils/authentication";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest){

    const requestedUser = await getUser(request)

    if(requestedUser == null){
        return NextResponse.json(
            {
                message : "You need to be logged in to access this resource"
            },
            {
                status : 401
            }
        )
    }

    if(requestedUser.privileges.includes("users:read")){

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
                privileges : true
            }
        })

        return NextResponse.json(
            {
                message : "Users fetched successfully",
                users : users
            },
       )
    }else{
        return NextResponse.json(
            {
                message : "You do not have the required privileges to access this resource"
            },
            {
                status : 403
            }
        )
    }
    
}
