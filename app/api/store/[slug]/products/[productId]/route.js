import prisma from "@/lib/PrismaClient";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { slug, productId } = await params;

    const store = await prisma.store.findUnique({
      where: { slug },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: store.id,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}