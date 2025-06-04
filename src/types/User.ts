export interface User {
  id: string;
  correo: string;
  rol: 'admin' | 'usuario';
  nivel: number | null;
}
