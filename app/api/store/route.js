import { NextResponse } from "next/server";
import prisma from "@/lib/PrismaClient";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        store: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching all products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
