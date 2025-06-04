"use client"; // Necesario para usar hooks en App Router

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "src/utils/supabase/client"; // ajusta esta ruta si es necesario

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Validación de sesión (opcional)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push("/inicio");
      }
    });
  }, [router]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos");
    } else {
      router.push("/inicio");
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Fondo con video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover filter brightness-50"
        autoPlay
        loop
        muted
      >
        <source src="/GLOBAL_HOLDING.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>

      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <img src="/logoChico.png" alt="Logo Global Holding" className="w-40 mb-6" />
        <h1 className="text-white text-3xl font-bold">¡Bienvenido!</h1>
        <p className="text-white mb-6">Inicia sesión</p>

        <div className="rounded-2xl p-8 w-80 flex flex-col items-center" style={{ backgroundColor: 'rgba(10, 25, 47, 0.7)' }}>
          <input
            type="email"
            placeholder="Correo"
            className="w-full mb-4 p-2 rounded-lg text-black bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full mb-6 p-2 rounded-lg text-black bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
          <button
            className="bg-white text-black font-bold px-6 py-2 rounded-full mb-2 transition transform hover:scale-105 active:scale-95"
            onClick={handleLogin}
          >
            ENTRAR
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <a
            href="/soporte"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-sm underline cursor-pointer"
          >
            ¿Necesitas ayuda?
          </a>

        </div>

        <div className="absolute bottom-4">
          <img src="/logo1.png" alt="logos" className="h-10" />
        </div>
      </div>
    </div>
  );
}
