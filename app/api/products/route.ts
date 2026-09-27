import { NextRequest } from "next/server";

export function GET(request : NextRequest){
    const cookies = request.cookies.get("login-token")?.value

    console.log("Cookies : ", cookies)

    console.log("GET request received at /api/products")
}