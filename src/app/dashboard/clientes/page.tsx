'use client';

import { useEffect, useRef } from 'react';
import Sidebar from '../../../components/layout/Sidebar';
import Link from 'next/link';

export default function ClientesDashboard() {
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tokenTimeoutRef: NodeJS.Timeout;

    async function fetchTokenAndEmbed() {
      try {
        const res = await fetch('/api/getEmbedToken?reportId=TU_REPORT_ID');
        const data = await res.json();

        if (data.token && reportRef.current) {
          const powerbi = await import('powerbi-client');



          const embedConfig: powerbi.IEmbedConfiguration = {
            type: 'report',
            tokenType: powerbi.models.TokenType.Embed,
            accessToken: data.token,
            embedUrl: `https://app.powerbi.com/reportEmbed?reportId=TU_REPORT_ID&groupId=TU_WORKSPACE_ID`,
            settings: {
              panes: {
                filters: { visible: false },
                pageNavigation: { visible: true },
              },
            },
          };

          const powerbiService = new powerbi.service.Service(
            powerbi.factories.hpmFactory,
            powerbi.factories.wpmpFactory,
            powerbi.factories.routerFactory
          );

          powerbiService.embed(reportRef.current, embedConfig);

          tokenTimeoutRef = setTimeout(() => {
            fetchTokenAndEmbed();
          }, 58 * 60 * 1000);
        }
      } catch (error) {
        console.error('Error embebiendo reporte:', error);
      }
    }

    fetchTokenAndEmbed();

    return () => {
      if (tokenTimeoutRef) clearTimeout(tokenTimeoutRef);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fondo fijo */}
      <div className="fixed inset-0 bg-cover bg-center brightness-75" style={{ backgroundImage: "url('/fondoprueba.jpeg')" }}></div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex justify-between items-start w-full max-w-7xl mx-auto mb-6">
          <Link href="/inicio">
            <img src="/logoChico.png" alt="Logo" className="w-36 cursor-pointer" />
          </Link>

          <Sidebar />
        </div>

        {/* Contenedor general */}
        <div className="flex-1 w-full max-w-7xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white shadow-lg flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-center">Dashboards de Clientes</h1>

          {/* Contenedor para Power BI */}
          <div ref={reportRef} className="w-full h-full min-h-[500px] rounded-lg bg-white/10 border border-white/20"></div>

        </div>
      </div>
    </div>
  );
}
