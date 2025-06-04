"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserTable from './UserTable';
import UserForm from './UserForm';
import { type User } from '../../types/User';
import Modal from '../common/Modal';
import Sidebar from '../layout/Sidebar';
import { FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { supabase } from 'src/utils/supabase/client';
import Link from 'next/link';


const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //  Cargar usuarios desde Supabase
  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Error al obtener usuarios:", error.message);
      return;
    }
    if (data) {
      setUsers(data);
    }
  };

  // Validar sesión y rol admin
  useEffect(() => {
    const checkSessionAndRole = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        router.push("/login");
        return;
      }

      const userId = userData.user.id;
      setUserEmail(userData.user.email ?? null);

      const { data: perfil, error: perfilError } = await supabase
        .from("users")
        .select("rol")
        .eq("id", userId)
        .single();

      if (perfilError || !perfil) {
        router.push("/noprivileges");
        return;
      }

      if (perfil.rol !== "admin") {
        router.push("/noprivileges");
        return;
      }

      await fetchUsers();
      setLoading(false);
    };

    checkSessionAndRole();
  }, [router]);

  // Crear nuevo usuario (Auth + tabla)
  const handleSave = async (data: {
    correo: string;
    password?: string;
    rol: "admin" | "usuario";
    nivel?: number;
    isFirstLogin?: boolean;
  }) => {
    try {
      if (editingUser) {
        //  Si se desea cambiar la contraseña, llamamos al endpoint protegido
        if (data.password && data.password.trim().length >= 6) {
          const response = await fetch("/api/update-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: editingUser.id, password: data.password }),
          });

          const result = await response.json();

          if (!response.ok) {
            console.error("Error actualizando contraseña:", result.error || result.message);
            return;
          }
        }

        //  Actualizar rol y nivel en la tabla users
        const { error: updateError } = await supabase
          .from("users")
          .update({
            rol: data.rol,
            nivel: data.rol === "usuario" ? data.nivel : null,
          })
          .eq("id", editingUser.id);

        if (updateError) {
          console.error("Error actualizando datos del usuario:", updateError.message);
          return;
        }

        // Actualizar en el frontend
        setUsers(prev =>
          prev.map(u =>
            u.id === editingUser.id
              ? {
                ...u,
                rol: data.rol,
                nivel: data.rol === "usuario" ? data.nivel ?? 1 : null,
              }
              : u
          )
        );
      } else {
        // CREAR nuevo usuario
        const response = await fetch("/api/create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("Error creando usuario:", result.error || result.message);
          return;
        }

        await fetchUsers();
      }

      //  Reset form
      setEditingUser(undefined);
      setShowForm(false);
    } catch (err) {
      console.error("Error inesperado:", err);
    }
  };




  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Error al eliminar usuario:", result.error || result.message);
        return;
      }

      // Actualizar estado local
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error("Error inesperado al eliminar:", err);
    }
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        Verificando permisos...
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src="/fondoprueba.jpeg"
        alt="Fondo"
        className="absolute top-0 left-0 w-full h-full object-cover brightness-50"
      />

      <div className="absolute top-0 left-0 w-full h-full flex flex-col px-4 pt-4 pb-4 brightness-100">
        <div className="w-full max-w-4xl mx-auto">
          <Sidebar />

          <div className="h-12 overflow-hidden flex justify-center items-center mb-4">
            <Link href="/inicio">
              <img src="/logoChico.png" alt="Logo" className="w-36 cursor-pointer" />
            </Link>

          </div>

          <h2 className="text-white text-3xl font-bold mb-1 text-center">Gestión de Usuarios</h2>
          <p className="text-white mb-2 text-center">Agrega, edita o elimina usuarios</p>
          <p className="text-white mb-4 text-center text-sm">Sesión iniciada como: {userEmail}</p>

          <div className="mb-4 text-center flex justify-center space-x-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-50/30 flex items-center justify-center border border-blue-50 text-white hover:bg-blue-500 px-6 py-3 rounded-xl transition-all duration-300"
            >
              <FaUserPlus className="text-lg mr-2" />
              Agregar Usuario
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-50/30 flex items-center justify-center border border-red-50 text-white hover:bg-red-500 px-6 py-3 rounded-xl transition-all duration-300"
            >
              <FaSignOutAlt className="text-lg mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto w-full flex justify-center pb-20">
          <div className="bg-white bg-opacity-90 rounded-2xl p-6 w-full max-w-4xl shadow-lg max-h-[calc(100vh-260px)]" style={{ backgroundColor: 'rgba(10, 25, 47, 0.7)' }}>
            <div className="h-full overflow-y-auto overflow-x-auto rounded-xl shadow p-4" style={{ backgroundColor: 'hsla(49, 52.40%, 59.60%, 0.36)' }}>
              <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          </div>
        </div>

        <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditingUser(undefined); }}>
          <UserForm
            user={editingUser}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingUser(undefined); }}
          />
        </Modal>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <img src="/logo1.png" alt="logos" className="h-10" />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
