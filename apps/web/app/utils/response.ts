import { NextResponse } from "next/server";

export interface ApiPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination: ApiPagination;
}

export const unauthorized = (message: string) => {
  return NextResponse.json({ success: false, message }, { status: 401 });
};

export const fail = (message: string) => {
  return NextResponse.json({ success: false, message });
};

export const success = (message: string | null, dataObj: any = {}) => {
  return NextResponse.json({ success: true, message, ...dataObj });
};
