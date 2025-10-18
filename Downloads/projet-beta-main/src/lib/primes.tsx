export interface PrimeBase {
  motif: string;
  montant: number | string;
  metiersConcrenes: Array<{
    metier: string;
    direction: string;
    service: string;
  }>;
}

export interface PrimeIFSE1 extends PrimeBase {
  type: 'IFSE1';
  categorie: 'A' | 'B' | 'C';
  fonction: string;
}

export interface PrimeIFSE2 extends PrimeBase {
  type: 'IFSE2';
  direction: string;
}

export type Prime = PrimeIFSE1 | PrimeIFSE2;

export const PRIMES_IFSE1: PrimeIFSE1[] = [
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - DGS', fonction: 'Directeur.rice général.e des services', montant: 2700, metiersConcrenes: [{ metier: 'Directeur Général des Services', direction: 'DG', service: 'Direction Générale' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - DGA', fonction: 'Directeur.rice général.e adjoint.e des services', montant: 2375, metiersConcrenes: [{ metier: 'Directeur Général Adjoint', direction: 'DGA', service: 'Direction Générale Adjointe' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - Directeur', fonction: 'Directeur.rice', montant: 1600, metiersConcrenes: [{ metier: 'Directeur', direction: 'Toutes directions', service: 'Direction' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - Chef de projet', fonction: 'Chef.fe de projet', montant: 1100, metiersConcrenes: [{ metier: 'Chef de projet', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - Responsable de service A', fonction: 'Responsable de service', montant: 1100, metiersConcrenes: [{ metier: 'Responsable de service', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - Adjoint resp service A', fonction: 'Adjoint.e au responsable de service', montant: 833.33, metiersConcrenes: [{ metier: 'Adjoint responsable de service', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - Responsable de structure A', fonction: 'Responsable de structure', montant: 750, metiersConcrenes: [{ metier: 'Responsable de structure', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - Ingénieur 2', fonction: 'Ingénieur-2', montant: 1083.33, metiersConcrenes: [{ metier: 'Ingénieur niveau 2', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - Ingénieur 1', fonction: 'Ingénieur-1', montant: 1000, metiersConcrenes: [{ metier: 'Ingénieur niveau 1', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - Gestionnaire spécialisé A', fonction: 'Gestionnaire spécialisé.e', montant: 666.67, metiersConcrenes: [{ metier: 'Gestionnaire spécialisé', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - Chargé de mission 3', fonction: 'Chargé.e de mission-3', montant: 666.67, metiersConcrenes: [{ metier: 'Chargé de mission niveau 3', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - Chargé de mission 2 A', fonction: 'Chargé.e de mission-2', montant: 625, metiersConcrenes: [{ metier: 'Chargé de mission niveau 2', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - Chargé de mission 1 A', fonction: 'Chargé.e de mission-1', montant: 458.33, metiersConcrenes: [{ metier: 'Chargé de mission niveau 1', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - Adjoint resp structure A', fonction: 'Adjoint.e responsable de structure', montant: 500, metiersConcrenes: [{ metier: 'Adjoint responsable de structure', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - Infirmier A', fonction: 'Infirmier.ère', montant: 625, metiersConcrenes: [{ metier: 'Infirmier', direction: 'DMSP', service: 'Santé' }] },
  { type: 'IFSE1', categorie: 'A', motif: 'IFSE1 - Travailleur social A', fonction: 'Travailleur.se social.e / médico-social', montant: 500, metiersConcrenes: [{ metier: 'Travailleur social', direction: 'DMSP', service: 'Social' }] },
  { type: 'IFSE1', categorie: 'B', motif: 'IFSE1 - Responsable de service B', fonction: 'Responsable de service', montant: 666.67, metiersConcrenes: [{ metier: 'Responsable de service', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'B', motif: 'IFSE1 - Adjoint resp service B', fonction: 'Adjoint.e au responsable de service', montant: 500, metiersConcrenes: [{ metier: 'Adjoint responsable de service', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'B', motif: 'IFSE1 - Responsable de structure B', fonction: 'Responsable de structure', montant: 416.67, metiersConcrenes: [{ metier: 'Responsable de structure', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'B', motif: 'IFSE1 - Technicien 2', fonction: 'Technicien.ne-2', montant: 750, metiersConcrenes: [{ metier: 'Technicien niveau 2', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'B', motif: 'IFSE1 - Technicien 1', fonction: 'Technicien.ne-1', montant: 687.50, metiersConcrenes: [{ metier: 'Technicien niveau 1', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'B', motif: 'IFSE1 - Gestionnaire spécialisé B', fonction: 'Gestionnaire spécialisé.e', montant: 541.67, metiersConcrenes: [{ metier: 'Gestionnaire spécialisé', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'B', motif: 'IFSE1 - Chargé de mission 2 B', fonction: 'Chargé.e de mission-2', montant: 540, metiersConcrenes: [{ metier: 'Chargé de mission niveau 2', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'B', motif: 'IFSE1 - Chargé de mission 1 B', fonction: 'Chargé.e de mission-1', montant: 479.17, metiersConcrenes: [{ metier: 'Chargé de mission niveau 1', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'B', motif: 'IFSE1 - Adjoint resp structure B', fonction: 'Adjoint.e responsable de structure', montant: 375, metiersConcrenes: [{ metier: 'Adjoint responsable de structure', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'B', motif: 'IFSE1 - Infirmier B', fonction: 'Infirmier.ère', montant: 479.17, metiersConcrenes: [{ metier: 'Infirmier', direction: 'DMSP', service: 'Santé' }] },
  { type: 'IFSE1', categorie: 'B', motif: 'IFSE1 - Educateur B', fonction: 'Éducateur.rice', montant: 291.67, metiersConcrenes: [{ metier: 'Éducateur', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'B', motif: 'IFSE1 - Travailleur social B', fonction: 'Travailleur.se social.e / médico-social', montant: 375, metiersConcrenes: [{ metier: 'Travailleur social', direction: 'DMSP', service: 'Social' }] },
  { type: 'IFSE1', categorie: 'C', motif: 'IFSE1 - Responsable de service C', fonction: 'Responsable de service', montant: 625, metiersConcrenes: [{ metier: 'Responsable de service', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'C', motif: 'IFSE1 - Adjoint resp service C', fonction: 'Adjoint.e au responsable de service', montant: 458.33, metiersConcrenes: [{ metier: 'Adjoint responsable de service', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'C', motif: 'IFSE1 - Chef d equipe C', fonction: 'Chef.fe d equipe', montant: 375, metiersConcrenes: [{ metier: 'Chef d equipe', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'C', motif: 'IFSE1 - Adjoint chef equipe C', fonction: 'Adjoint.e chef.fe d equipe', montant: 333.33, metiersConcrenes: [{ metier: 'Adjoint chef d equipe', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'C', motif: 'IFSE1 - Gestionnaire spécialisé C', fonction: 'Gestionnaire spécialisé.e', montant: 312.50, metiersConcrenes: [{ metier: 'Gestionnaire spécialisé', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'C', motif: 'IFSE1 - Agent technique spécialisé C', fonction: 'Agent.e technique spécialisé.e', montant: 291.67, metiersConcrenes: [{ metier: 'Agent technique spécialisé', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'C', motif: 'IFSE1 - Aide soignant C', fonction: 'Aide soignant.e', montant: 291.67, metiersConcrenes: [{ metier: 'Aide soignant', direction: 'DMSP', service: 'Santé' }] },
  { type: 'IFSE1', categorie: 'C', motif: 'IFSE1 - Agent accueil C', fonction: 'Agent.e d accueil', montant: 229.17, metiersConcrenes: [{ metier: 'Agent d accueil', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'C', motif: 'IFSE1 - Agent administratif C', fonction: 'Agent.e administratif.ive', montant: 229.17, metiersConcrenes: [{ metier: 'Agent administratif', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'C', motif: 'IFSE1 - Agent technique C', fonction: 'Agent.e technique', montant: 208.33, metiersConcrenes: [{ metier: 'Agent technique', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'C', motif: 'IFSE1 - Agent entretien C', fonction: 'Agent.e d entretien', montant: 208.33, metiersConcrenes: [{ metier: 'Agent d entretien', direction: 'Toutes directions', service: 'Tous services' }] },
  { type: 'IFSE1', categorie: 'C', motif: 'IFSE1 - Aide a domicile C', fonction: 'Aide a domicile', montant: 208.33, metiersConcrenes: [{ metier: 'Aide a domicile', direction: 'DMSP', service: 'Social' }] },
];

export const PRIMES_IFSE2: PrimeIFSE2[] = [
  { type: 'IFSE2', motif: 'Indemnités responsabilités sports', direction: 'DMS', montant: 168.71, metiersConcrenes: [{ metier: 'Educateur sportif', direction: 'DMS', service: 'SAMS' }, { metier: 'Responsable de secteur', direction: 'DMS', service: 'SGES' }] },
  { type: 'IFSE2', motif: 'Prime activités nautiques', direction: 'DMS', montant: 315.90, metiersConcrenes: [{ metier: 'Maitre nageur sauveteur', direction: 'DMS', service: 'CN' }, { metier: 'Chef de bassin / Adjoint au responsable', direction: 'DMS', service: 'CN' }] },
  { type: 'IFSE2', motif: 'Prime technicité RH', direction: 'DRH', montant: 280.00, metiersConcrenes: [{ metier: 'Chargé de formation', direction: 'DRH', service: 'DCRH' }, { metier: 'Responsable de service DCRH', direction: 'DRH', service: 'DCRH' }, { metier: 'Adjoint au responsable du service DCRH', direction: 'DRH', service: 'DCRH' }] },
  { type: 'IFSE2', motif: 'Prime technicité GCR', direction: 'DRH', montant: 281.71, metiersConcrenes: [{ metier: 'Gestionnaire paie carrière et rémunération', direction: 'DRH', service: 'GCR' }, { metier: 'Technicien paie', direction: 'DRH', service: 'GCR' }, { metier: 'Chargé de mission carrière', direction: 'DRH', service: 'GCR' }] },
  { type: 'IFSE2', motif: 'Prime technicité marchés publics', direction: 'DAJ', montant: 350.00, metiersConcrenes: [{ metier: 'Chargé des marchés publics', direction: 'DAJ', service: 'Commande publique' }] },
  { type: 'IFSE2', motif: 'Prime technicité juriste', direction: 'DAJ', montant: 350.00, metiersConcrenes: [{ metier: 'Juriste', direction: 'DAJ', service: 'Affaires juridiques' }] },
  { type: 'IFSE2', motif: 'PSR Radiologie', direction: 'DMSP', montant: 140.77, metiersConcrenes: [{ metier: 'Manipulateur radio', direction: 'DMSP', service: 'Radiologie' }, { metier: 'Responsable de service', direction: 'DMSP', service: 'Radiologie' }] },
  { type: 'IFSE2', motif: 'Prime rendement informatique (A)', direction: 'DSI', montant: 308.70, metiersConcrenes: [{ metier: 'Administrateur système & BDD - Adm. Réseau', direction: 'DSI', service: 'Exploitation' }] },
  { type: 'IFSE2', motif: 'Prime rendement informatique (B)', direction: 'DSI', montant: 210.44, metiersConcrenes: [{ metier: 'Technicien informatique', direction: 'DSI', service: 'Assistance' }] },
  { type: 'IFSE2', motif: 'Prime grand âge', direction: 'DMSP', montant: 118.00, metiersConcrenes: [{ metier: 'Aide-soignante', direction: 'DMSP', service: 'SIADPA' }] },
  { type: 'IFSE2', motif: 'Prime Référent financier principal', direction: 'Toutes dir', montant: 75.00, metiersConcrenes: [{ metier: 'Référent financier principal', direction: 'Toutes dir', service: 'Tous services' }] },
  { type: 'IFSE2', motif: 'Prime Expertise comptable', direction: 'DAF', montant: 180.00, metiersConcrenes: [{ metier: 'Responsable de service', direction: 'DAF', service: 'Exécution et qualité comptable' }, { metier: 'Agent comptable', direction: 'DAF', service: 'Exécution et qualité comptable' }, { metier: 'Coordinateur', direction: 'DAF', service: 'Exécution et qualité comptable' }] },
  { type: 'IFSE2', motif: 'Prime formateur interne', direction: 'Toutes dir', montant: 75.00, metiersConcrenes: [{ metier: 'Formateur interne', direction: 'Toutes dir', service: 'Tous services' }] },
  { type: 'IFSE2', motif: 'Prime Référent financier suppléant', direction: 'Toutes dir', montant: 40.00, metiersConcrenes: [{ metier: 'Référent financier suppléant', direction: 'Toutes dir', service: 'Tous services' }] },
  { type: 'IFSE2', motif: 'Prime intérim', direction: 'Toutes dir', montant: 150.00, metiersConcrenes: [{ metier: 'Pour les agents remplissant les conditions', direction: 'Toutes dir', service: 'Tous services' }] },
  { type: 'IFSE2', motif: 'Prime Maitre apprentissage', direction: 'DRH', montant: 98.46, metiersConcrenes: [{ metier: 'Maitre d apprentissage', direction: 'Toutes dir', service: 'Tous services' }] },
  { type: 'IFSE2', motif: 'Prime ODEC', direction: 'DMRU', montant: 75.00, metiersConcrenes: [{ metier: 'Responsable de service et Adjoints au resp serv', direction: 'DMRU', service: 'Affaires civiles' }] },
  { type: 'IFSE2', motif: 'Prime accueil DMRU', direction: 'DMRU', montant: 50.00, metiersConcrenes: [{ metier: 'Agent d accueil', direction: 'DMRU', service: 'Accueil démarches prestations' }, { metier: 'Assistante polyvalente', direction: 'DMRU', service: 'Accueil démarches prestations' }, { metier: 'Adjoint au responsable de service', direction: 'DMRU', service: 'Accueil démarches prestations' }] },
  { type: 'IFSE2', motif: 'Prime DG', direction: 'DG', montant: 150.00, metiersConcrenes: [{ metier: 'DG - DGST - DGAS - DGAUE', direction: 'DG', service: 'DG' }] },
  { type: 'IFSE2', motif: 'Prime technicité assistant DGA', direction: 'DG', montant: 150.00, metiersConcrenes: [{ metier: 'Assistant DGA', direction: 'DG', service: 'DIRECTION' }] },
  { type: 'IFSE2', motif: 'Prime Gestionnaire déconcentré', direction: 'DESS', montant: 90.00, metiersConcrenes: [{ metier: 'Chargé de missions', direction: 'DESS', service: 'SSE' }, { metier: 'Agent administratif comptable', direction: 'DESS', service: 'SSE' }, { metier: 'Gestionnaire', direction: 'DESS', service: 'SSE' }, { metier: 'Adjoint au responsable de service', direction: 'DESS', service: 'SSE' }] },
  { type: 'IFSE2', motif: 'Indemnités horaires décalés catégorie 1', direction: 'DE', montant: 20.00, metiersConcrenes: [{ metier: 'Jardinier', direction: 'DE', service: 'EV' }, { metier: 'Adjoint au chef d equipe', direction: 'DE', service: 'EV' }, { metier: 'Chef d equipe', direction: 'DE', service: 'EV' }, { metier: 'Responsable des équipes', direction: 'DE', service: 'EV' }, { metier: 'Secrétaire', direction: 'DE', service: 'EV' }] },
  { type: 'IFSE2', motif: 'Prime chef d equipe EV', direction: 'DE', montant: 85.00, metiersConcrenes: [{ metier: 'Chef d equipe', direction: 'DE', service: 'EV' }, { metier: 'Responsable des équipes', direction: 'DE', service: 'EV' }, { metier: 'Adjoint au chef d equipe', direction: 'DE', service: 'EV' }] },
];

export const getDirectionsUniques = (): string[] => {
  const directions = new Set<string>();
  PRIMES_IFSE2.forEach(prime => {
    directions.add(prime.direction);
    prime.metiersConcrenes.forEach(metier => directions.add(metier.direction));
  });
  return Array.from(directions).sort();
};

export const getCategoriesUniques = (): ('A' | 'B' | 'C')[] => {
  const categories = new Set<'A' | 'B' | 'C'>();
  PRIMES_IFSE1.forEach(prime => categories.add(prime.categorie));
  return Array.from(categories).sort();
};

export const getFonctionsParCategorie = (categorie: 'A' | 'B' | 'C'): string[] => {
  const fonctions = new Set<string>();
  PRIMES_IFSE1.filter(prime => prime.categorie === categorie)
    .forEach(prime => fonctions.add(prime.fonction));
  return Array.from(fonctions).sort();
};

export const getPrimesIFSE1ParCategorie = (categorie: 'A' | 'B' | 'C'): PrimeIFSE1[] => {
  return PRIMES_IFSE1.filter(prime => prime.categorie === categorie);
};

export const getPrimesIFSE2ParDirection = (direction: string): PrimeIFSE2[] => {
  return PRIMES_IFSE2.filter(prime => 
    prime.direction === direction || 
    prime.metiersConcrenes.some(metier => metier.direction === direction)
  );
};

export const searchPrimes = (query: string): Prime[] => {
  const searchLower = query.toLowerCase();
  return [...PRIMES_IFSE1, ...PRIMES_IFSE2].filter(prime =>
    prime.motif.toLowerCase().includes(searchLower) ||
    prime.metiersConcrenes.some(m => 
      m.metier.toLowerCase().includes(searchLower) ||
      m.direction.toLowerCase().includes(searchLower) ||
      m.service.toLowerCase().includes(searchLower)
    )
  );
};
