'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../../components/layout/Sidebar';
import Link from 'next/link';

import { supabase } from '../../../utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function VentasDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [dashboardOculto, setDashboardOculto] = useState(false);
  const [usuario, setUsuario] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const obtenerUsuario = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData.user) {
        router.push("/login");
        return;
      }
      setUsuario(userData.user.email ?? 'Usuario desconocido');
    };
    obtenerUsuario();
  }, [router]);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        setDashboardOculto(true);
        setTimeout(() => setDashboardOculto(false), 5000);
      }
    };

    const handleVisibility = () => {
      setDashboardOculto(document.visibilityState !== 'visible');
    };

    window.addEventListener('keydown', handleKey);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="fixed inset-0 bg-cover bg-center brightness-75" style={{ backgroundImage: "url('/diamante-de-sangre.jpg')" }}></div>
      <div className="relative z-10 flex flex-col h-full p-4">
        <div className="flex justify-between items-start w-full max-w-7xl mx-auto mb-6">
          <Link href="/inicio">
            <img src="/logo3.png" alt="Logo" className="w-36 cursor-pointer" />
          </Link>
          <Sidebar />
        </div>
        <div className="flex-1 w-full max-w-7xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white shadow-lg flex flex-col gap-4 relative">
          <h1 className="text-3xl font-bold text-center">Estadisticas</h1>

          

          <div className="relative w-full h-full">
            {dashboardOculto && (
              <div className="absolute inset-0 z-40 bg-black/70 text-white flex items-center justify-center text-xl font-bold rounded-lg">
                🔒 Captura de pantalla bloqueada temporalmente
              </div>
            )}
          </div>
          {/* Espacio vacío decorativo */}
          <div className="w-full h-[500px] rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white text-lg italic">
            <img src="/logo4.png" alt="imagen" />
          </div>
        </div>
      </div>
    </div>
  );
}
