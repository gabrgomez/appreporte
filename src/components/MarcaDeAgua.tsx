import React from 'react';

interface MarcaDeAguaProps {
  usuario?: string;
}

export default function MarcaDeAgua({ usuario }: MarcaDeAguaProps) {
  const fecha = new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-30 pointer-events-none select-none overflow-hidden">
      <div className="absolute -rotate-45 opacity-10 text-5xl font-bold text-white animate-marcar movimiento whitespace-nowrap flex items-center justify-center text-center">
        CONFIDENCIAL<br />
        {usuario ?? 'Usuario desconocido'}<br />
        {fecha}
      </div>

      <style jsx>{`
        .movimiento {
          animation: desplazamiento 5s linear infinite;
        }

        @keyframes desplazamiento {
          0% {
            top: 40%;
            left: -5%;
          }
          100% {
            top: 50%;
            left: 50%;
          }
        }
      `}</style>
    </div>
  );
}
