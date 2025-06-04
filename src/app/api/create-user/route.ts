// src/app/api/create-user/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { correo, password, rol, nivel } = body;

  // 1. Crear el usuario en Auth
  const { data: userCreated, error: authError } = await supabase.auth.admin.createUser({
    email: correo,
    password,
    email_confirm: true,
  });

  if (authError || !userCreated?.user?.id) {
    return NextResponse.json({ message: 'Error en Auth', error: authError?.message }, { status: 500 });
  }

  // 2. Insertar en la tabla
  const { error: insertError } = await supabase.from('users').insert({
    id: userCreated.user.id,
    correo,
    rol,
    nivel: rol === 'usuario' ? nivel : null,
  });

  if (insertError) {
    return NextResponse.json({ message: 'Error en tabla users', error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Usuario creado exitosamente' }, { status: 200 });
}