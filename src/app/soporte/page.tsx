"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Admin = { correo: string };

export default function SoportePage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      const response = await fetch("/api/admin-contacts");
      const result = await response.json();

      if (response.ok) {
        setAdmins(result.admins);
      } else {
        console.error("Error obteniendo contactos:", result.error);
      }

      setLoading(false);
    };

    fetchAdmins();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">¿Necesitas ayuda?</h1>
      <p className="text-lg mb-6 text-center max-w-xl">
        Si tienes problemas para acceder al sistema o necesitas asistencia técnica, puedes contactar a los siguientes administradores:
      </p>

      {loading ? (
        <p className="text-white">Cargando contactos...</p>
      ) : (
        <ul className="mb-8 space-y-2 text-lg text-center">
          {admins.map((admin, idx) => (
            <li key={idx}>
              <a
                href={`mailto:${admin.correo}`}
                className="underline hover:text-blue-400 transition"
              >
                {admin.correo}
              </a>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => router.push("/login")}
        className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition"
      >
        Volver al Login
      </button>
    </div>
  );
}
