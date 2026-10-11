import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Cpu,
  Palette,
  ShieldAlert,
  GitBranch,
  Lock,
  ListTodo,
  History,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface StepItem {
  id: number;
  label: string;
  shortLabel: string;
  fileTag: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepItem[] = [
  { id: 1, label: 'PRD & Prompt Maestro', shortLabel: 'PRD', fileTag: 'PRD.md', icon: FileText },
  { id: 2, label: 'Arquitectura Técnica', shortLabel: 'Arquitectura', fileTag: 'ARCHITECTURE.md', icon: Cpu },
  { id: 3, label: 'Diseño & UI/UX', shortLabel: 'Diseño', fileTag: 'DESIGN.md', icon: Palette },
  { id: 4, label: 'Reglas de la IA', shortLabel: 'Reglas', fileTag: 'RULES.md', icon: ShieldAlert },
  { id: 5, label: 'Decisiones ADR', shortLabel: 'Decisiones', fileTag: 'DECISIONS.md', icon: GitBranch },
  { id: 6, label: 'Seguridad Estricta', shortLabel: 'Seguridad', fileTag: 'SECURITY.md', icon: Lock },
  { id: 7, label: 'Tareas del Desarrollo', shortLabel: 'Tareas', fileTag: 'TASKS.md', icon: ListTodo },
  { id: 8, label: 'Memoria & Bitácora', shortLabel: 'Memoria', fileTag: 'MEMORY.md', icon: History },
];

interface StepNavigationProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({ currentStep, onSelectStep }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll positions
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  // Auto-scroll when currentStep changes
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeButton = scrollRef.current.querySelector<HTMLElement>(`[data-step="${currentStep}"]`);
    if (activeButton) {
      activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    // Re-check scroll state after animation
    const timer = setTimeout(checkScroll, 300);
    return () => clearTimeout(timer);
  }, [currentStep, checkScroll]);

  // Horizontal scroll using mouse wheel
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    if (e.deltaY !== 0) {
      scrollRef.current.scrollLeft += e.deltaY;
      checkScroll();
    }
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2.5">
        <div className="relative flex items-center group">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <div className="absolute left-0 z-10 flex items-center h-full pr-3 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-zinc-950 dark:via-zinc-950/90 dark:to-transparent">
              <button
                type="button"
                onClick={handleScrollLeft}
                className="p-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-all hover:scale-105 active:scale-95"
                title="Desplazarse a la izquierda"
                aria-label="Desplazarse a la izquierda"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step pills row with visible horizontal scroll & mousewheel */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            onWheel={handleWheel}
            className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 px-1 scroll-smooth w-full"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  data-step={step.id}
                  onClick={() => onSelectStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-500/30'
                      : isCompleted
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                      : 'bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : step.id}
                  </div>

                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{step.shortLabel}</span>

                  <span
                    className={`inline-block px-1.5 py-0.2 text-[9px] font-mono rounded ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {step.fileTag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          {canScrollRight && (
            <div className="absolute right-0 z-10 flex items-center h-full pl-3 bg-gradient-to-l from-white via-white/90 to-transparent dark:from-zinc-950 dark:via-zinc-950/90 dark:to-transparent">
              <button
                type="button"
                onClick={handleScrollRight}
                className="p-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-all hover:scale-105 active:scale-95"
                title="Desplazarse a la derecha"
                aria-label="Desplazarse a la derecha"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
