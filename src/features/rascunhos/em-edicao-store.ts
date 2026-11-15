import { create } from 'zustand';

/**
 * Qual rascunho a aba Nova deve abrir. Fica em memória (não persiste): é só a
 * "ponte" entre a tela de detalhe do rascunho e a aba Nova. Passar isso por
 * parâmetro de rota faria o Expo Router empilhar um novo conjunto de abas.
 */
type RascunhoEmEdicaoState = {
  id: number | null;
  /** Muda a cada abertura, para reabrir o mesmo rascunho recarregar o formulário. */
  abertura: number;
  abrir: (id: number) => void;
  limpar: () => void;
};

export const useRascunhoEmEdicao = create<RascunhoEmEdicaoState>()((set) => ({
  id: null,
  abertura: 0,
  abrir: (id) => set((state) => ({ id, abertura: state.abertura + 1 })),
  limpar: () => set({ id: null }),
}));
