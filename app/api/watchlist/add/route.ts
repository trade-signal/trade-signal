import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/prisma/db";
import { errorResponse } from "@/middleware";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return errorResponse("未授权访问", 401);
  }

  try {
    const { watchlistId, code, name, type } = await request.json();

    if (!watchlistId || !code || !name || !type) {
      return Response.json({
        success: false,
        message: "缺少必要参数"
      });
    }

    // 检查是否已存在该股票
    const existingWatch = await prisma.watch.findFirst({
      where: {
        userId,
        watchlistId,
        code
      }
    });

    if (existingWatch) {
      return Response.json({
        success: false,
        message: "该股票已在观察列表中"
      });
    }

    // 获取当前最大排序值
    const maxOrder = await prisma.watch.findFirst({
      where: { watchlistId },
      orderBy: { order: "desc" },
      select: { order: true }
    });

    const newWatch = await prisma.watch.create({
      data: {
        userId: session.user.id,
        watchlistId,
        code,
        name,
        type,
        order: (maxOrder?.order || 0) + 1
      }
    });

    return Response.json({
      success: true,
      data: newWatch
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "添加失败"
    });
  }
}
