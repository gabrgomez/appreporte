// src/app/api/update-password/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { id, password } = await req.json();

  if (!id || !password) {
    return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
  }

  const { error } = await supabase.auth.admin.updateUserById(id, {
    password,
  });

  if (error) {
    return NextResponse.json({ message: "Error actualizando contraseña", error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Contraseña actualizada" }, { status: 200 });
}
