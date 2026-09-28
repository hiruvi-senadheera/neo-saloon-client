import prisma from "@/lib/prisma";
import { getUser, isPrivileged } from "@/utils/authentication";
import { NextRequest, NextResponse } from "next/server";

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
    
