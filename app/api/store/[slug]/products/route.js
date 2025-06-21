import { NextResponse } from "next/server";
import prisma from "@/lib/PrismaClient";

export async function GET(request, { params }) {
  try {

    const { slug } = await params;

    const store = await prisma.store.findUnique({
      where: { slug },
      include: {
        products: true,
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({ products: store.products });
  } catch (error) {

    console.error("Error fetching products by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
