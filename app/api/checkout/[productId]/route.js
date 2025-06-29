import prisma from "@/lib/PrismaClient";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { productId } = await params;
    const { buyerEmail } = await request.json();

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        store: {
          include: {
            seller: true,
          }
        }
      }
    });

    if (!product || !product.store || !product.store.seller) {
      throw new Error("Invalid product or store information");
    }

    const order = await prisma.order.create({
      data: {
        productId: product.id,
        storeId: product.store.id,
        sellerId: product.store.seller.id,
        buyerEmail: buyerEmail,
      }
    });

    return NextResponse.json({ success: true, order }, { status: 201 });

  } catch (error) {
    console.error("Error purchasing product: ", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}