import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  CheckSquare,
  Square,
  KeyRound,
  FileKey,
  Shield,
  Plus,
  Trash2,
  Binary,
} from 'lucide-react';
import type { LibretoProject } from '../../types/libreto';

interface SecurityModuleProps {
  project: LibretoProject;
  onChange: (updated: Partial<LibretoProject>) => void;
}

export const SecurityModule: React.FC<SecurityModuleProps> = ({ project, onChange }) => {
  const { security } = project;
  const [newPolicy, setNewPolicy] = useState('');

  const handleUpdate = (fields: Partial<typeof security>) => {
    onChange({
      security: {
        ...security,
        ...fields,
      },
    });
  };

  const handleAddPolicy = () => {
    if (!newPolicy.trim()) return;
    handleUpdate({
      customSecurityPolicies: [...security.customSecurityPolicies, newPolicy.trim()],
    });
    setNewPolicy('');
  };

  const handleRemovePolicy = (idx: number) => {
    const next = [...security.customSecurityPolicies];
    next.splice(idx, 1);
    handleUpdate({ customSecurityPolicies: next });
  };

  const securityChecklist = [
    {
      key: 'envVariablesManagement' as const,
      title: 'Gestión de Variables de Entorno y Cero Secretos en Git',
      description: 'Prohibir rotundamente escribir API Keys o contraseñas en código. Mantener .env.example sincronizado y .env en .gitignore.',
      icon: FileKey,
    },
    {
      key: 'secureAuth' as const,
      title: 'Autenticación Segura (Cookies HttpOnly / SecureStore Móvil)',
      description: 'Tokens JWT almacenados en cookies con flags HttpOnly, Secure y SameSite=Strict en web, o SecureStore cifrado nativo en móvil.',
      icon: KeyRound,
    },
    {
      key: 'inputSanitization' as const,
      title: 'Sanitización de Entradas y Validación de Esquemas (Zod / DTO)',
      description: 'Validar y sanitizar cada request entrante en la frontera antes de invocar la lógica de negocio. Descartar payloads desconocidos.',
      icon: ShieldCheck,
    },
    {
      key: 'sqlInjectionAndXssProtection' as const,
      title: 'Protección Contra Inyección SQL y Cross-Site Scripting (XSS)',
      description: 'Consultas siempre parametrizadas a través del ORM/driver. Escapar salidas en el cliente y prohibir HTML sin desinfectar.',
      icon: Binary,
    },
    {
      key: 'corsAndSecurityHeaders' as const,
      title: 'Políticas de CORS Restrictivas y Cabeceras de Seguridad',
      description: 'Lista blanca de orígenes autorizados, Content-Security-Policy (CSP), HSTS y middleware defensivo tipo Helmet.',
      icon: Shield,
    },
    {
      key: 'rateLimiting' as const,
      title: 'Limitación de Tasa (Rate Limiting) y Protección Anti Fuerza Bruta',
      description: 'Protección contra abusos y scraping en endpoints de login, registro, checkout y recuperación de contraseña.',
      icon: Lock,
    },
  ];

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* 1. Module Header */}
      <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  SECURITY.md
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                  Paso 6 de 8
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Pautas Estrictas de Seguridad Informática
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Checklist exhaustivo de directivas de seguridad para prevenir vulnerabilidades OWASP, inyecciones y filtración de secretos.
          </p>
        </div>
      </div>

      {/* 2. Security Checklist Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 pb-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Shield className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Parámetros Obligatorios de Seguridad
            </h3>
            <p className="text-[11px] text-zinc-500">Haz clic en cada directiva para activarla o desactivarla</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {securityChecklist.map((item) => {
            const isChecked = Boolean(security[item.key]);
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                onClick={() => handleUpdate({ [item.key]: !isChecked })}
                className={`cursor-pointer p-4 sm:p-4.5 rounded-2xl border text-left transition-all flex items-start gap-3.5 select-none ${
                  isChecked
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                      {item.title}
                    </h4>
                    <span className="shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {isChecked ? (
                        <CheckSquare className="w-4.5 h-4.5" />
                      ) : (
                        <Square className="w-4.5 h-4.5 text-zinc-400" />
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Custom Security Policies */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Lock className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Políticas Particulares de Seguridad
              </h3>
              <p className="text-[11px] text-zinc-500">Reglas adicionales exigidas por el proyecto ({security.customSecurityPolicies.length})</p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            {security.customSecurityPolicies.length} Políticas
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="text"
            value={newPolicy}
            onChange={(e) => setNewPolicy(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPolicy()}
            className="flex-1 text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder:text-zinc-400"
            placeholder="Ej. Requerir autenticación 2FA para el acceso a paneles de administración..."
          />
          <button
            type="button"
            onClick={handleAddPolicy}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 shrink-0"
          >
            <Plus className="w-4 h-4" /> Añadir Política
          </button>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {security.customSecurityPolicies.map((pol, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm leading-relaxed break-words">
                  {pol}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemovePolicy(idx)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                title="Eliminar política"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {security.customSecurityPolicies.length === 0 && (
            <div className="text-xs text-zinc-400 italic py-2">
              No hay políticas personalizadas adicionales añadidas aún.
            </div>
          )}
        </div>
      </div>

      {/* 4. Observaciones y Especificaciones Adicionales de Seguridad */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Observaciones y Especificaciones de Seguridad (Opcional)
            </h3>
            <p className="text-[11px] text-zinc-500">
              Detalla normativas de privacidad (GDPR / LOPD), manejo de datos sensibles, auditorías o permisos de roles
            </p>
          </div>
        </div>
        <textarea
          rows={3}
          value={security.customNotes || ''}
          onChange={(e) => handleUpdate({ customNotes: e.target.value })}
          placeholder="Ej. Los datos personales de los clientes deben cifrarse en reposo (AES-256); los logs de auditoría no deben registrar contraseñas ni números de tarjeta..."
          className="w-full text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder:text-zinc-400 leading-relaxed"
        />
      </div>
    </div>
  );
};
