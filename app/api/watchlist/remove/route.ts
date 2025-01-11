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
    const { watchlistId, code, type } = await request.json();

    if (!watchlistId || !code || !type) {
      return Response.json({
        success: false,
        message: "缺少必要参数"
      });
    }

    // 验证股票是否属于当前用户
    const watch = await prisma.watch.findFirst({
      where: {
        code,
        watchlistId,
        type,
        userId: session.user.id
      }
    });

    if (!watch) {
      return Response.json({
        success: false,
        message: "未找到该股票或无权限删除"
      });
    }

    await prisma.watch.delete({
      where: {
        watchlistId_type_code: {
          watchlistId,
          type,
          code
        }
      }
    });

    return Response.json({
      success: true,
      message: "删除成功"
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "删除失败"
    });
  }
}
