"use client"; // Necesario para usar hooks en App Router

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "src/utils/supabase/client"; // ajusta esta ruta si es necesario
import '../../styles/globals.css';

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

      {/* Contenido centrado */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center px-4">
        <img src="/Logo_DuocUC.png" alt="Logo Global Holding" className="w-52 mb-4" />
        <h1 className="text-white text-3xl font-bold">¡Bienvenido!</h1>
        <p className="text-white mb-6">Inicia sesión</p>

        {/* Caja glassmorphism */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center">
          <input
            type="email"
            placeholder="Correo"
            className="w-full mb-4 p-3 rounded-lg bg-white text-black placeholder-gray-700 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full mb-6 p-3 rounded-lg bg-white text-black placeholder-gray-700 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-white text-black font-bold px-6 py-3 rounded-full transition transform hover:scale-105 active:scale-95"
          >
            ENTRAR
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <a
            href="/soporte"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-sm underline mt-4"
          >
            ¿Necesitas ayuda?
          </a>
        </div>
      </div>
    </div>
  );
}
