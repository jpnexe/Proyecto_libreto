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
      title: 'Gestión de Variables de Entorno y Cero Secretos Hardcodeados',
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
      title: 'Sanitización de Entradas y Validación de Esquemas (Zod, Joi, Pydantic)',
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
      description: 'Lista blanca de orígenes autorizados, Content-Security-Policy (CSP), HSTS y middleware tipo Helmet.',
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
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              SECURITY.md
            </span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Pautas Estrictas de Seguridad, Sanitización & Auth
            </h2>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Checklist exhaustivo de directivas de seguridad para prevenir vulnerabilidades y fugas de datos.
          </p>
        </div>
      </div>

      {/* Security Checklist Cards */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Parámetros Obligatorios de Seguridad
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {securityChecklist.map((item) => {
            const isChecked = Boolean(security[item.key]);
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                onClick={() => handleUpdate({ [item.key]: !isChecked })}
                className={`cursor-pointer p-4 rounded-xl border text-left transition-all flex items-start gap-3 select-none ${
                  isChecked
                    ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-tight">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Security Policies */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-500" />
          Políticas Particulares de Seguridad del Proyecto ({security.customSecurityPolicies.length})
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={newPolicy}
            onChange={(e) => setNewPolicy(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPolicy()}
            className="flex-1 text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Ej. Requerir autenticación 2FA para el acceso a paneles de administración..."
          />
          <button
            onClick={handleAddPolicy}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Añadir
          </button>
        </div>

        <div className="space-y-2">
          {security.customSecurityPolicies.map((pol, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm">{pol}</span>
              </div>
              <button
                onClick={() => handleRemovePolicy(idx)}
                className="opacity-40 group-hover:opacity-100 hover:text-red-500 text-zinc-400 p-1 transition-all"
                title="Eliminar política"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
