export const STATUS = {
  ricevuto: { label: "Nuovo ordine", phase: 0 },
  grafica: { label: "In grafica", phase: 1 },
  cliente: { label: "Aspetta il cliente", phase: 1 },
  materiali: { label: "Manca materiale", phase: 2 },
  approvato: { label: "Pronto per la stampa", phase: 2 },
  stampa: { label: "In stampa", phase: 3 },
  calandra: { label: "In calandra", phase: 3 },
  assemblaggio: { label: "Da assemblatore esterno", phase: 3 },
  pronto: { label: "Pronto", phase: 4 },
  spedito: { label: "Spedito", phase: 5 },
} as const;
export type StatusKey = keyof typeof STATUS;
export const PHASES = ["Ordine", "Grafica", "Approvato", "Produzione", "Pronto", "Spedito"];
export const NEXT: Partial<Record<StatusKey, StatusKey>> = {
  ricevuto: "grafica",
  grafica: "cliente",
  cliente: "approvato",
  materiali: "approvato",
  approvato: "stampa",
  stampa: "calandra",
  calandra: "assemblaggio",
  assemblaggio: "pronto",
  pronto: "spedito",
};
export const CHANNELS = ["Squadra", "Online", "Conto terzi"] as const;
