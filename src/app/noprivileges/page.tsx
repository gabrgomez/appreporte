"use client";

import { useRouter } from "next/navigation";

export default function NoPrivilegesPage() {

    const router = useRouter();
    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Fondo con imagen */}
            <img
                src="/fondoprueba.jpeg"
                alt="Fondo"
                className="absolute top-0 left-0 w-full h-full object-cover brightness-50"
            />

            {/* Capa de contenido */}
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white px-4">
                {/* GIF */}
                <img
                    src="/nedry.gif"
                    alt="Sin privilegios"
                    className="w-72 mb-6 rounded-xl shadow-xl"
                />

                {/* Mensaje */}
                <h1 className="text-3xl font-bold text-center mb-2">Acceso Denegado</h1>
                <p className="text-lg text-center max-w-md">
                    No dijiste la palabra magica
                </p>
                {/* Botón */}
                <button
                    onClick={() => router.push("/inicio")}
                    className="bg-white/10 border border-white px-6 py-2 rounded-full text-white hover:bg-white/20 transition-all duration-300"
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    );
}
