'use client';

import { useEffect, useRef, useState } from 'react';
import Sidebar from '../../../components/layout/Sidebar';
import type { Report } from 'powerbi-client';
import Link from 'next/link';
import MarcaDeAgua from '../../../components/MarcaDeAgua';
import { supabase } from '../../../utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function VentasDashboard() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [reportInstance, setReportInstance] = useState<Report | null>(null);
  const [paginaActiva, setPaginaActiva] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [pages, setPages] = useState<{ name: string; displayName: string }[]>([]);
  const [dashboardOculto, setDashboardOculto] = useState(false);
  const [usuario, setUsuario] = useState<string | null>(null);
  const embedUrl = process.env.NEXT_PUBLIC_POWERBI_EMBED_URL ?? '';
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

  useEffect(() => {
    let tokenTimeoutRef: NodeJS.Timeout;
    async function fetchTokenAndEmbed() {
      try {
        const res = await fetch('/api/token2');
        const data = await res.json();
        if (data.token && reportRef.current) {
          const powerbi = await import('powerbi-client');
          const isMobile = window.innerWidth <= 768;
          const embedConfig: powerbi.IEmbedConfiguration = {
            type: 'report',
            tokenType: powerbi.models.TokenType.Embed,
            accessToken: data.token,
            embedUrl: embedUrl,
            settings: {
              panes: {
                filters: { visible: false },
                pageNavigation: { visible: false }
              },
              layoutType: isMobile
                ? powerbi.models.LayoutType.MobilePortrait
                : powerbi.models.LayoutType.Custom,
            }
          };
          const powerbiService = new powerbi.service.Service(
            powerbi.factories.hpmFactory,
            powerbi.factories.wpmpFactory,
            powerbi.factories.routerFactory
          );
          const report = powerbiService.embed(reportRef.current, embedConfig) as Report;
          setReportInstance(report);
          report.on('loaded', async () => {
            const allPages = await report.getPages();
            setPages(allPages.map(p => ({ name: p.name, displayName: p.displayName })));
            const pages = await report.getPages();
            console.log('🧾 Páginas disponibles:');
            pages.forEach(p => {
              console.log(`- ${p.displayName} → ${p.name}`);
            });
          });
          const pages = await report.getPages();
          const activePage = pages.find(p => p.isActive);
          if (activePage) setPaginaActiva(activePage.name);
          tokenTimeoutRef = setTimeout(() => {
            fetchTokenAndEmbed();
          }, 58 * 60 * 1000);
        }
      } catch (error) {
        console.error('Error al obtener el token o embeber el reporte:', error);
      }
    }
    fetchTokenAndEmbed();
    return () => {
      if (tokenTimeoutRef) clearTimeout(tokenTimeoutRef);
    };
  }, []);

  const cambiarPagina = async (pagina: string) => {
    if (!reportInstance) return;
    const pages = await reportInstance.getPages();
    const target = pages.find(p => p.name === pagina);
    if (target) {
      await reportInstance.setPage(pagina);
      setPaginaActiva(pagina);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="fixed inset-0 bg-cover bg-center brightness-75" style={{ backgroundImage: "url('/fondoprueba.jpeg')" }}></div>
      <div className="relative z-10 flex flex-col h-full p-4">
        <div className="flex justify-between items-start w-full max-w-7xl mx-auto mb-6">
          <Link href="/inicio">
            <img src="/logoChico.png" alt="Logo" className="w-36 cursor-pointer" />
          </Link>
          <Sidebar />
        </div>
        <div className="flex-1 w-full max-w-7xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white shadow-lg flex flex-col gap-4 relative">
          <h1 className="text-3xl font-bold text-center">Dashboards de Ventas</h1>

          <div className="flex justify-center flex-wrap gap-4">
            {pages.map(p => (
              <button
                key={p.name}
                onClick={() => cambiarPagina(p.name)}
                className={`px-4 py-2 rounded shadow transition ${paginaActiva === p.name
                  ? 'bg-blue-500 text-white font-bold'
                  : 'bg-white text-black hover:bg-gray-100'
                  }`}
              >
                {p.displayName}
              </button>
            ))}
          </div>

          <MarcaDeAgua usuario={usuario ?? 'Desconocido'} />

          <div className="relative">
            {dashboardOculto && (
              <div className="absolute inset-0 z-40 bg-black/70 text-white flex items-center justify-center text-xl font-bold rounded-lg">
                🔒 Captura de pantalla bloqueada temporalmente
              </div>
            )}
            

            <div ref={reportRef} className={`w-full rounded-lg border border-white/20 transition ${dashboardOculto ? 'blur-md brightness-50 pointer-events-none' : ''}`}
              style={{
                height: isMobile ? '80vh' : 'auto',
                aspectRatio: isMobile ? undefined : '16 / 9',
                minHeight: '400px'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}