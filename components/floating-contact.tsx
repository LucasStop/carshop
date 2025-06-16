'use client';

import { useState } from 'react';
import { QuickContact } from './quick-contact';
import { MessageCircle, X } from 'lucide-react';

export function FloatingContact() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Botão de fechar */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs text-white transition-colors hover:bg-gray-700"
        >
          <X className="h-3 w-3" />
        </button>

        {/* Botão principal */}
        <QuickContact
          trigger={
            <button className="group flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl">
              <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
            </button>
          }
        />

        {/* Tooltip */}
        <div className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 transform whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
          Precisa de ajuda? Clique aqui!
          <div className="absolute left-full top-1/2 -translate-y-1/2 transform border-4 border-transparent border-l-gray-900"></div>
        </div>
      </div>
    </div>
  );
}
