import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import prisma from "@/lib/PrismaClient";

export async function POST(request) {
  try {
    const { userName, email, password, storeName } = await request.json();

    if (!userName || !email || !password || !storeName) {
      return NextResponse.json(
        { error: "user name, email, password and store name are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    const isAlreadyExisting = await prisma.seller.findUnique({
      where: { email: normalizedEmail },
    });

    if (isAlreadyExisting) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sellerId = uuidv4();

    const seller = await prisma.seller.create({
      data: {
        id: sellerId,
        email: normalizedEmail,
        username: userName,
        password: hashedPassword,
        role: "seller",
      },
    });

    const baseSlug = storeName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    let slug = baseSlug;
    let count = 1;

    while (await prisma.store.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const storeId = uuidv4();
    const store = await prisma.store.create({
      data: {
        id: storeId,
        name: storeName,
        slug,
        sellerId: sellerId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Seller and store created successfully",
        seller: {
          id: seller.id,
          name: seller.username,
        },
        store: {
          id: store.id,
          name: store.name,
          slug: store.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating seller/store:", error);
    return NextResponse.json(
      { error: "Something went wrong while creating user" },
      { status: 500 }
    );
  }
}
