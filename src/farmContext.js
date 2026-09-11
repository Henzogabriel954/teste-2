import React, { createContext, useState } from 'react';

export const lotesDemonstracao = [
  {
    id: 'lote-ar-01',
    cultura: 'Alface Roxa Orgânica',
    lote: 'LOTE-ALF-ROXA-2026',
    origem: 'Hortifruti Primavera - Gleba Primavera, Ibiporã/PR',
    produtor: 'Emerson Amorim',
    dataPlantio: '15/08/2026',
    tempoColheita: '35 dias (Previsão: 20/09/2026)',
    aduboOrganico: true,
    agrotoxicos: false,
    manejo: 'Compostagem aerada, cobertura vegetal morta e irrigação por gotejamento.',
    status: 'Ativo • Pronto para Colheita',
    areaM2: 250,
  },
  {
    id: 'lote-sl-02',
    cultura: 'Salsinha Especial',
    lote: 'LOTE-SAL-2026-08',
    origem: 'Hortifruti Primavera - Gleba Primavera, Ibiporã/PR',
    produtor: 'Emerson Amorim',
    dataPlantio: '22/08/2026',
    tempoColheita: '45 dias (Previsão: 05/10/2026)',
    aduboOrganico: true,
    agrotoxicos: false,
    manejo: 'Húmus de minhoca, sem agrotóxicos, adubação verde e colheita contínua.',
    status: 'Ativo • Em Desenvolvimento',
    areaM2: 180,
  },
];

export const FarmContext = createContext({
  producer: { nome: 'Produtor Rural', email: 'produtor@nestleaf.com', tipoPerfil: 'consumidor' },
  setProducer: () => {},
  lotes: lotesDemonstracao,
  setLotes: () => {},
  carbonPoints: 150,
  registrarDiarioCampo: () => {},
});

export function FarmProvider({ children }) {
  const [producer, setProducer] = useState({ 
    nome: 'Produtor Rural', 
    email: 'produtor@nestleaf.com',
    tipoPerfil: 'consumidor',
    farmName: 'Horta Modelo'
  });
  
  const [lotes, setLotes] = useState(lotesDemonstracao);
  
  const [carbonPoints, setCarbonPoints] = useState(150);

  // Função chamada quando o produtor faz um relato sustentável no Diário de Campo
  const registrarDiarioCampo = (acaoSustentavel) => {
    setCarbonPoints(prev => prev + 50);
  };

  return (
    <FarmContext.Provider value={{ producer, setProducer, lotes, setLotes, carbonPoints, registrarDiarioCampo }}>
      {children}
    </FarmContext.Provider>
  );
}