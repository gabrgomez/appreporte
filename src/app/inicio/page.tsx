"use client";

import React, { useEffect, useState } from "react";
import '../../styles/inicio.css';
import { FaPlus, FaChartBar, FaFileAlt, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import { supabase } from "admin/utils/supabase/client";
import Link from 'next/link';

function Hola() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (!userData?.user || userError) {
        router.push("/login");
        return;
      }

      setUserEmail(userData.user.email ?? null);

      // Obtener rol y nivel desde tabla users
      const { data: perfil, error: perfilError } = await supabase
        .from("users")
        .select("rol, nivel")
        .eq("id", userData.user.id)
        .single();

      if (perfil?.rol) setUserRole(perfil.rol);
      if (perfil?.nivel !== undefined) setUserLevel(perfil.nivel);

      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleVentasClick = () => router.push("/dashboard/ventas");
  const handleProductosClick = () => router.push("/dashboard/productos");
  const handleClientesClick = () => router.push("/dashboard/clientes");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white bg-black">
        Cargando usuario...
      </div>
    );
  }

  const canSeeVentas = true;
  const canSeeProductos = userRole === "admin" || userLevel === 1 || userLevel === 2;
  const canSeeClientes = userRole === "admin" || userLevel === 1;

  return (
    <div className="bg-image-wrapper relative">
      {/* Logo y Sidebar */}
      <header className="flex justify-between items-start p-4">
        <Link href="/inicio">
              <img src="/logo3.png" alt="Logo" className="w-36 cursor-pointer" />
            </Link>
        <Sidebar />
      </header>

      {/* Info del usuario logeado */}
      <p className="text-white mb-4 text-center text-sm">
        Sesión iniciada como: <strong>{userEmail}</strong>
      </p>

      {/* Botones según privilegios */}
      <div className="mt-50 bg-white/10 backdrop-blur-lg mx-8 mt-32 p-8 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Ventas (todos la ven) */}
          {canSeeVentas && (
            <div
              className="custom-card flex flex-col items-start justify-between p-6 rounded-2xl cursor-pointer transition-transform hover:scale-105"
              onClick={handleVentasClick}
            >
              <div className="flex justify-between w-full">
                <FaFileAlt size={32} />
                <FaPlus size={20} />
              </div>
              <h2 className="mt-6 text-2xl font-bold">Estadisticas</h2>
            </div>
          )}

           {/* Ventas (todos la ven) */}
          {canSeeVentas && (
            <div
              className="custom-card flex flex-col items-start justify-between p-6 rounded-2xl cursor-pointer transition-transform hover:scale-105"
              onClick={handleProductosClick}
            >
              <div className="flex justify-between w-full">
                <FaFileAlt size={32} />
                <FaPlus size={20} />
              </div>
              <h2 className="mt-6 text-2xl font-bold">Productos</h2>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Hola;
