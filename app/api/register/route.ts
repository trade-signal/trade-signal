import prisma from "@/prisma/db";
import { hashPassword } from "@/shared/encrypt";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return Response.json({
      success: false,
      message: "参数错误"
    });
  }

  // 检查用户是否存在
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    return Response.json({
      success: false,
      message: "用户已存在"
    });
  }

  // 创建用户
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword(password)
    }
  });

  return Response.json({
    success: true,
    message: "注册成功"
  });
};
