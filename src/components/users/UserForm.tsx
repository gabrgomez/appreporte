import { type User } from '../../types/User';
import { useState, useEffect } from 'react';

interface Props {
    user?: {
      id: string;
      correo: string;
      rol: 'admin' | 'usuario';
      nivel: number | null;
    };
    onSave: (data: {
      correo: string;
      password?: string;
      rol: 'admin' | 'usuario';
      nivel?: number;
      isFirstLogin?: boolean;
    }) => void;
    onCancel: () => void;
  }
  
  const UserForm = ({ user, onSave, onCancel }: Props) => {
    const [correo, setCorreo] = useState('');
    const [rol, setRol] = useState<'admin' | 'usuario'>('usuario');
    const [nivel, setNivel] = useState<number>(1);
    const [password, setPassword] = useState('');
    const [resetPassword, setResetPassword] = useState(false);
    const isEditing = !!user;
  
    useEffect(() => {
      if (user) {
        setCorreo(user.correo);
        setRol(user.rol);
        setNivel(user.nivel ?? 1);
      }
    }, [user]);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const userData: {
        correo: string;
        password?: string;
        rol: 'admin' | 'usuario';
        nivel?: number;
        isFirstLogin?: boolean;
      } = {
        correo,
        rol,
        isFirstLogin: !isEditing || resetPassword,
      };
      if (rol === 'usuario') {
        userData.nivel = nivel;
      }
      if (!isEditing || resetPassword) {
        userData.password = password;
      }
      onSave(userData);
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded shadow">
        <input
          value={correo}
          onChange={e => setCorreo(e.target.value)}
          placeholder="Correo"
          className="border p-2 w-full"
        />
  
        <select value={rol} onChange={e => setRol(e.target.value as 'admin' | 'usuario')} className="border p-2 w-full">
          <option value="usuario">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
  
        {rol === 'usuario' && (
          <select value={nivel} onChange={e => setNivel(Number(e.target.value) as 1 | 2 | 3)} className="border p-2 w-full">
            <option value={1}>Nivel 1</option>
            <option value={2}>Nivel 2</option>
            <option value={3}>Nivel 3</option>
          </select>
        )}
  
        {(!isEditing || resetPassword) && (
          <div className="mb-4">
            <label className="block mb-1">Contraseña temporal</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="border p-2 w-full"
            />
          </div>
        )}
  
        {isEditing && (
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={resetPassword}
                onChange={e => setResetPassword(e.target.checked)}
                className="mr-2"
              />
              Restablecer contraseña
            </label>
          </div>
        )}
  
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2">
            Cancelar
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2">
            Guardar
          </button>
        </div>
      </form>
    );
  };
  
  export default UserForm;
