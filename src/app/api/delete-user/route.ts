// src/app/api/delete-user/route.ts

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ message: "ID faltante" }, { status: 400 });
  }

  // 1. Borrar de Auth
  const { error: authError } = await supabase.auth.admin.deleteUser(id);

  if (authError) {
    return NextResponse.json({ message: "Error al eliminar de Auth", error: authError.message }, { status: 500 });
  }

  // 2. Borrar de tabla users
  const { error: dbError } = await supabase.from("users").delete().eq("id", id);

  if (dbError) {
    return NextResponse.json({ message: "Error al eliminar de tabla users", error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Usuario eliminado correctamente" }, { status: 200 });
}
