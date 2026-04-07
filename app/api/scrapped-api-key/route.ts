import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { API_ROUTES } from "@/constant/routes";

export const dynamic = "force-dynamic";

function upstreamUrl(): string {
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(
    /\/?$/,
    ""
  );
  const path = API_ROUTES.SUPERADMIN.SCRAPPED_API_KEY.replace(/^\//, "").replace(
    /\/$/,
    ""
  );
  return `${apiBase}/${path}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as {
    is_superuser?: boolean;
    has_scraped_data_access?: boolean;
  };
  if (!user.is_superuser && !user.has_scraped_data_access) {
    return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  }

  const httpApiKey =
    process.env.SCRAPPED_HTTP_API_KEY ??
    process.env.NEXT_PUBLIC_SCRAPPED_HTTP_API_KEY ??
    "";
  if (!httpApiKey.trim()) {
    return NextResponse.json(
      {
        detail:
          "Set SCRAPPED_HTTP_API_KEY or NEXT_PUBLIC_SCRAPPED_HTTP_API_KEY on the server.",
      },
      { status: 500 }
    );
  }

  const res = await fetch(upstreamUrl(), {
    method: "GET",
    headers: {
      "API-KEY": httpApiKey,
    },
    cache: "no-store",
  });

  const body = await res.text();
  const contentType =
    res.headers.get("content-type") ?? "application/json; charset=utf-8";

  return new NextResponse(body, {
    status: res.status,
    headers: { "content-type": contentType },
  });
}
