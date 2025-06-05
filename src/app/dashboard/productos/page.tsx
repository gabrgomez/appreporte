'use client';

import Sidebar from '../../../components/layout/Sidebar';
import Link from 'next/link';

export default function ProductosDashboard() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fondo fijo */}
      <div
        className="fixed inset-0 bg-cover bg-center brightness-75"
        style={{ backgroundImage: "url('/diamante-de-sangre.jpg')" }}
      ></div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex justify-between items-start w-full max-w-7xl mx-auto mb-6">
          <Link href="/inicio">
            <img src="/logo3.png" alt="Logo" className="w-36 cursor-pointer" />
          </Link>

          <Sidebar />
        </div>

        {/* Contenedor general */}
        <div className="flex-1 w-full max-w-7xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white shadow-lg flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-center">Productos</h1>

          {/* Espacio vacío decorativo */}
          <div className="w-full h-[500px] rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white text-lg italic">
            <img src="/logo4.png" alt="imagen" />
          </div>
        </div>
      </div>
    </div>
  );
}
