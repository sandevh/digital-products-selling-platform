import prisma from "@/lib/PrismaClient";
import { verifyToken } from "@/lib/VerifyToken";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const token = request.cookies.get("token")?.value;

    let payload;
    try {
      payload = await verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (payload?.role !== "seller") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sellerId = payload?.id;
    const { productId } = await params;
    const body = await request.json();

    const store = await prisma.store.findUnique({
      where: { sellerId },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    if (store.sellerId !== payload.id) {
      return NextResponse.json({ error: "Access denied to this store" }, { status: 403 });
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: store.id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title: body.title,
        description: body.description,
        price: parseFloat(body.price),
      },
    });

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = request.cookies.get("token")?.value;

    let payload;
    try {
      payload = await verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (payload?.role !== "seller") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sellerId = payload?.id;
    const { productId } = await params;

    const store = await prisma.store.findUnique({
      where: { sellerId },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    if (store.sellerId !== payload.id) {
      return NextResponse.json({ error: "Access denied to this store" }, { status: 403 });
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: store.id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true, message: "Product deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const token = request.cookies.get("token")?.value;

    let payload;
    try {
      payload = await verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (payload?.role !== "seller") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sellerId = payload.id;
    const { productId } = await params;

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        store: {
          sellerId: sellerId,
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });

  } catch (error) {
    console.error("Error getting product:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
