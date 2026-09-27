// Add your seed data here
// This file is used to seed the database with initial data
// I got this code from the Prisma documentation: https://www.prisma.io/docs/guides/v7/frameworks/nextjs 
// 2.5 seed the database with initial data



import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [
  {
    email : "admin@saloonneo.lk",
    fName : "Admin",
    lName : "Neo",
    password : "$2a$12$E0aQQTA8fhVAPFsT.YA/2ugghOF99nTx362fR.oCCiqj8jhLzi/zq",
    role : "ADMIN",
    privileges : []
  }
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();