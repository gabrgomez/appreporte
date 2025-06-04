import { type User } from '../../types/User';

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserTable = ({ users, onEdit, onDelete }: Props) => (
  <div className="w-full min-w-[600px] rounded-lg border border-white/20">   
    <table className="w-full max-h-[80vh] text-sm text-left text-white backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg">
      <thead className="text-xs uppercase bg-white/20 text-gray-200">
        <tr>
          <th className="px-4 py-3">Correo</th>
          <th className="px-4 py-3">Rol</th>
          <th className="px-4 py-3">Nivel</th>
          <th className="px-4 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} className="hover:bg-white/10 transition">
            <td className="px-4 py-2">{user.correo}</td>
            <td className="px-4 py-2 capitalize">{user.rol}</td>
            <td className="px-4 py-2">{user.nivel ?? '-'}</td>
            <td className="px-4 py-2 space-x-2">
              <button onClick={() => onEdit(user)} className="text-blue-400 hover:underline">Editar</button>
              <button onClick={() => onDelete(user.id)} className="text-red-400 hover:underline">Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserTable;
