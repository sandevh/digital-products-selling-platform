import { NextResponse } from "next/server";
import prisma from "@/lib/PrismaClient";
import { v4 as uuidv4 } from "uuid";
import { verifyToken } from "@/lib/VerifyToken";

export async function POST(request, { params }) {
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

    const product = await prisma.product.create({
      data: {
        id: uuidv4(),
        title: body.title,
        description: body.description,
        price: parseFloat(body.price),
        storeId: store.id,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(request) {
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

    const store = await prisma.store.findUnique({
      where: { sellerId },
      select: {
        products: true,
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({ products: store.products }, { status: 200 });

  } catch (error) {
    console.error("Error getting products:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
