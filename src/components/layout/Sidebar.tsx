'use client';

import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { supabase } from 'admin/utils/supabase/client';

export default function Sidebar() {
  const [showMenu, setShowMenu] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        setUserEmail(data.user.email ?? null);

        const { data: perfil } = await supabase
          .from("users")
          .select("rol")
          .eq("id", data.user.id)
          .single();

        if (perfil?.rol) {
          setUserRole(perfil.rol);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.refreshSession();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <button onClick={() => setShowMenu(true)} className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-lg">
        <FaBars className="text-xl" />
      </button>

      {showMenu && (
        <div className="fixed inset-0 bg-black/50 z-20 flex justify-end">
          <div className="w-64 h-full bg-white p-6 flex flex-col justify-between">
            <div>
              <button onClick={() => setShowMenu(false)} className="self-end mb-4 text-black font-bold"> ✕ </button>

              {userEmail && (
                <p className="text-gray-700 text-sm mb-4">
                  Sesión: <strong>{userEmail}</strong>
                </p>
              )}

              <nav className="flex flex-col gap-4">
                <a href="/inicio" className="text-black hover:underline">Inicio</a>
                <a href="/dashboard/ventas" className="text-black hover:underline">Estadisticas</a>
                <a href="/dashboard/productos" className="text-black hover:underline">Productos</a>
                {userRole === 'admin' && (
                  <a href="/admin/users" className="text-black hover:underline">Administrar Usuarios</a>
                )}
              </nav>
            </div>

            <button onClick={handleLogout} className="text-black hover:underline mt-6 text-left">
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </>
  );
}
