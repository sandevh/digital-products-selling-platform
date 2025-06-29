import prisma from "@/lib/PrismaClient";
import { verifyToken } from "@/lib/VerifyToken";
import { NextResponse } from "next/server";

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

    const sellerId = payload?.id;

    const store = await prisma.store.findUnique({
      where: { sellerId },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: { sellerId },
      include: {
        product: true,
        store: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders }, { status: 200 });

  } catch (error) {
    console.error("Error retrieving orders: ", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
