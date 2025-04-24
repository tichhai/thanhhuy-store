import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "../../../libs/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const articleComments = await prisma.articleReview.delete({
    where: { id: params.id },
  });
  return NextResponse.json(articleComments);
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const articleComments = await prisma.articleReview.findUnique({
      where: { id: params.id },
    });

    if (!articleComments) {
      return new NextResponse("Không tìm thấy bình luận bài viết!", {
        status: 404,
      });
    }

    return NextResponse.json(articleComments);
  } catch (error) {
    console.error("Lỗi:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
