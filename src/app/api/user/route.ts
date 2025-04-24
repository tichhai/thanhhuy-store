import bcrypt from "bcrypt";
import prisma from "../../libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã tồn tại" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.error();
    }
    const body = await request.json();
    const { name, phone } = body;

    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        phoneNumber: phone,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Không đủ quyền truy cập!" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany();
    const filteredUsers = users.map(
      ({
        resetPasswordToken,
        resetPasswordExpires,
        chatRoomIds,
        seenMessageIds,
        ...rest
      }) => rest
    );
    return NextResponse.json(filteredUsers);
  } catch (error) {
    return NextResponse.json(
      { message: "Không thể lấy danh sách người dùng" },
      { status: 500 }
    );
  }
}
