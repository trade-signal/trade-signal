import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import dayjs from "dayjs";

// 错误响应
export const errorResponse = (message: string, status: number = 401) => {
  return NextResponse.json(
    {
      success: false,
      message,
      timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss")
    },
    { status }
  );
};

// 需要验证的 API 路径
const authPaths = ["/api/watchlist"];

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl?.pathname;

  if (!pathname) {
    return NextResponse.next();
  }

  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  if (isAuthPath) {
    try {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
      });

      if (!token || !token.id) {
        return errorResponse("未授权访问", 401);
      }
    } catch (error) {
      return errorResponse("未授权访问", 401);
    }
  }

  return NextResponse.next();
}

export const config = {
  // 匹配 API 路径
  matcher: ["/api/:path*"],
  // 排除不需要验证的 API 路径
  exclude: ["/api/auth", "/api/register"]
};
