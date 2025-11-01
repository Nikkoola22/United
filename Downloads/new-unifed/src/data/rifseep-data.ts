// Données extraites du Guide RH RIFSEEP de Gennevilliers

// Contenu complet du guide RIFSEEP pour le chatbot
export const rifseepData = `
# Guide RH RIFSEEP - Mairie de Gennevilliers

## RIFSEEP - Régime Indemnitaire tenant compte des Fonctions, des Sujétions, de l'Expertise et de l'Engagement Professionnel

### IFSE 1 - Indemnité de Fonction, de Sujétion et d'Expertise

L'IFSE 1 est une indemnité forfaitaire mensuelle versée aux agents qui exercent des fonctions comportant des responsabilités particulières, des sujétions spécifiques ou nécessitant une expertise particulière.

#### Catégorie A - Fonctions d'encadrement supérieur
- Directeur Général des Services : 24000€/an (2000€/mois)
- Directeur Général Adjoint : 18000€/an (1500€/mois)
- Directeur : 12000€/an (1000€/mois)
- Chef de service principal : 6000€/an (500€/mois)

#### Catégorie B - Fonctions d'encadrement intermédiaire
- Chef de service : 4800€/an (400€/mois)
- Adjoint au chef de service : 3600€/an (300€/mois)
- Responsable d'équipe : 2400€/an (200€/mois)

#### Catégorie C - Fonctions d'application
- Agent de maîtrise : 1800€/an (150€/mois)
- Agent qualifié : 1200€/an (100€/mois)
- Agent d'exécution : 600€/an (50€/mois)

### IFSE 2 - Indemnités et primes complémentaires

L'IFSE 2 comprend diverses indemnités et primes selon les fonctions exercées et les sujétions particulières.

#### Primes communes à toutes les directions
- Prime maître apprentissage : 98,46€/mois
- Prime référent financier principal : 75€/mois
- Prime référent financier suppléant : 40€/mois
- Prime formateur interne : 75€/mois
- Prime intérim : 150€/mois

#### Primes spécifiques par direction
- Indemnités horaires décalés : 20€/mois
- Prime accueil : 50€/mois
- Prime informatique : 308,70€/mois
- Prime rendement : 210,44€/mois
- Prime expertise comptable : 180€/mois
- Prime gestionnaire déconcentré : 90€/mois

### Modalités d'attribution
- L'IFSE 1 est attribuée automatiquement selon la fonction exercée
- L'IFSE 2 est attribuée selon les critères spécifiques de chaque prime
- Les montants sont versés mensuellement avec le traitement
- Révision annuelle des barèmes selon les accords collectifs
`;

export interface IFSE1Data {
  category: 'A' | 'B' | 'C';
  function: string;
  functionCode: string;
  annualAmount: number;
  monthlyAmount: number;
  implementationYear: 2024 | 2025 | 2026;
}

export interface IFSE2Data {
  motif: string;
  amount: number;
  jobs: string[];
  direction: string;
  service: string;
}

// Barème IFSE 1 - Données extraites du guide
export const ifse1Data: IFSE1Data[] = [
  // Catégorie A
  { category: 'A', function: 'DGS', functionCode: 'A-0', annualAmount: 32400, monthlyAmount: 2700, implementationYear: 2024 },
  { category: 'A', function: 'Direction générale', functionCode: 'A-1', annualAmount: 28500, monthlyAmount: 2375, implementationYear: 2024 },
  { category: 'A', function: 'Directeur', functionCode: 'A-2', annualAmount: 19200, monthlyAmount: 1600, implementationYear: 2024 },
  { category: 'A', function: 'Chef de projet', functionCode: 'A-3', annualAmount: 13200, monthlyAmount: 1100, implementationYear: 2024 },
  { category: 'A', function: 'Responsable de service', functionCode: 'A-4', annualAmount: 13200, monthlyAmount: 1100, implementationYear: 2024 },
  { category: 'A', function: 'Adjoint responsable de service', functionCode: 'A-5', annualAmount: 10000, monthlyAmount: 833.33, implementationYear: 2024 },
  { category: 'A', function: 'Responsable de structure', functionCode: 'A-6', annualAmount: 9000, monthlyAmount: 750, implementationYear: 2024 },
  { category: 'A', function: 'Ingénieur-2', functionCode: 'A-7', annualAmount: 13000, monthlyAmount: 1083.33, implementationYear: 2025 },
  { category: 'A', function: 'Ingénieur-1', functionCode: 'A-7', annualAmount: 12000, monthlyAmount: 1000, implementationYear: 2025 },
  { category: 'A', function: 'Gestionnaire spécialisé', functionCode: 'A-8', annualAmount: 8000, monthlyAmount: 666.67, implementationYear: 2025 },
  { category: 'A', function: 'Chargé de mission-3', functionCode: 'A-9', annualAmount: 8000, monthlyAmount: 666.67, implementationYear: 2025 },
  { category: 'A', function: 'Chargé de mission-2', functionCode: 'A-9', annualAmount: 7500, monthlyAmount: 625, implementationYear: 2025 },
  { category: 'A', function: 'Chargé de mission-1', functionCode: 'A-9', annualAmount: 5500, monthlyAmount: 458.33, implementationYear: 2026 },
  { category: 'A', function: 'Adjoint responsable de structure', functionCode: 'A-10', annualAmount: 6000, monthlyAmount: 500, implementationYear: 2025 },
  { category: 'A', function: 'Infirmier', functionCode: 'A-11', annualAmount: 7500, monthlyAmount: 625, implementationYear: 2025 },
  { category: 'A', function: 'Travailleur social / Médico-social', functionCode: 'A-14', annualAmount: 6000, monthlyAmount: 500, implementationYear: 2026 },

  // Catégorie B
  { category: 'B', function: 'Responsable de service', functionCode: 'B-4', annualAmount: 8000, monthlyAmount: 666.67, implementationYear: 2024 },
  { category: 'B', function: 'Adjoint responsable de service', functionCode: 'B-5', annualAmount: 6000, monthlyAmount: 500, implementationYear: 2025 },
  { category: 'B', function: 'Responsable de structure', functionCode: 'B-6', annualAmount: 5000, monthlyAmount: 416.67, implementationYear: 2024 },
  { category: 'B', function: 'Technicien-2', functionCode: 'B-7', annualAmount: 9000, monthlyAmount: 750, implementationYear: 2025 },
  { category: 'B', function: 'Technicien-1', functionCode: 'B-7', annualAmount: 8250, monthlyAmount: 687.50, implementationYear: 2025 },
  { category: 'B', function: 'Gestionnaire spécialisé', functionCode: 'B-8', annualAmount: 6500, monthlyAmount: 541.67, implementationYear: 2026 },
  { category: 'B', function: 'Chargé de mission-2', functionCode: 'B-9', annualAmount: 6480, monthlyAmount: 540, implementationYear: 2025 },
  { category: 'B', function: 'Chargé de mission-1', functionCode: 'B-9', annualAmount: 5750, monthlyAmount: 479.17, implementationYear: 2026 },
  { category: 'B', function: 'Adjoint responsable de structure', functionCode: 'B-10', annualAmount: 4500, monthlyAmount: 375, implementationYear: 2025 },
  { category: 'B', function: 'Infirmier', functionCode: 'B-11', annualAmount: 5750, monthlyAmount: 479.17, implementationYear: 2025 },
  { category: 'B', function: 'Éducateur', functionCode: 'B-13', annualAmount: 3500, monthlyAmount: 291.67, implementationYear: 2024 },
  { category: 'B', function: 'Travailleur social / Médico-social', functionCode: 'B-14', annualAmount: 4500, monthlyAmount: 375, implementationYear: 2025 },
  { category: 'B', function: 'Chef d\'équipe', functionCode: 'B-16', annualAmount: 5500, monthlyAmount: 458.33, implementationYear: 2026 },
  { category: 'B', function: 'Adjoint chef d\'équipe', functionCode: 'B-17', annualAmount: 5000, monthlyAmount: 416.67, implementationYear: 2025 },
  { category: 'B', function: 'Assistant-3', functionCode: 'B-19', annualAmount: 5000, monthlyAmount: 416.67, implementationYear: 2025 },
  { category: 'B', function: 'Assistant-2', functionCode: 'B-19', annualAmount: 3750, monthlyAmount: 312.50, implementationYear: 2024 },
  { category: 'B', function: 'Assistant-1', functionCode: 'B-19', annualAmount: 3000, monthlyAmount: 250, implementationYear: 2024 },
  { category: 'B', function: 'Gestionnaire', functionCode: 'B-18', annualAmount: 4000, monthlyAmount: 333.33, implementationYear: 2024 },
  { category: 'B', function: 'Animateur', functionCode: 'B-20', annualAmount: 4500, monthlyAmount: 375, implementationYear: 2025 },
  { category: 'B', function: 'Agent technique spécialisé', functionCode: 'B-22', annualAmount: 4500, monthlyAmount: 375, implementationYear: 2026 },
  { category: 'B', function: 'Agent d\'accueil', functionCode: 'B-23', annualAmount: 3500, monthlyAmount: 291.67, implementationYear: 2025 },

  // Catégorie C
  { category: 'C', function: 'Responsable de service', functionCode: 'C-4', annualAmount: 7500, monthlyAmount: 625, implementationYear: 2024 },
  { category: 'C', function: 'Adjoint responsable de service', functionCode: 'C-5', annualAmount: 4500, monthlyAmount: 375, implementationYear: 2025 },
  { category: 'C', function: 'Responsable de structure', functionCode: 'C-6', annualAmount: 4000, monthlyAmount: 333.33, implementationYear: 2024 },
  { category: 'C', function: 'Technicien', functionCode: 'C-7', annualAmount: 4250, monthlyAmount: 354.17, implementationYear: 2025 },
  { category: 'C', function: 'Gestionnaire spécialisé', functionCode: 'C-8', annualAmount: 3750, monthlyAmount: 312.50, implementationYear: 2024 },
  { category: 'C', function: 'Chargé de mission', functionCode: 'C-9', annualAmount: 3500, monthlyAmount: 291.67, implementationYear: 2025 },
  { category: 'C', function: 'Adjoint responsable de structure', functionCode: 'C-10', annualAmount: 4000, monthlyAmount: 333.33, implementationYear: 2025 },
  { category: 'C', function: 'Chef d\'équipe', functionCode: 'C-16', annualAmount: 4500, monthlyAmount: 375, implementationYear: 2025 },
  { category: 'C', function: 'Adjoint chef d\'équipe', functionCode: 'C-17', annualAmount: 4000, monthlyAmount: 333.33, implementationYear: 2025 },
  { category: 'C', function: 'Assistant-3', functionCode: 'C-19', annualAmount: 3500, monthlyAmount: 291.67, implementationYear: 2024 },
  { category: 'C', function: 'Assistant-2', functionCode: 'C-19', annualAmount: 3000, monthlyAmount: 250, implementationYear: 2024 },
  { category: 'C', function: 'Assistant-1', functionCode: 'C-19', annualAmount: 2500, monthlyAmount: 208.33, implementationYear: 2024 },
  { category: 'C', function: 'Gestionnaire', functionCode: 'C-18', annualAmount: 3000, monthlyAmount: 250, implementationYear: 2024 },
  { category: 'C', function: 'Animateur', functionCode: 'C-20', annualAmount: 2250, monthlyAmount: 187.50, implementationYear: 2024 },
  { category: 'C', function: 'Secrétaire spécialisé', functionCode: 'C-21', annualAmount: 2500, monthlyAmount: 208.33, implementationYear: 2025 },
  { category: 'C', function: 'Agent technique spécialisé', functionCode: 'C-22', annualAmount: 3500, monthlyAmount: 291.67, implementationYear: 2024 },
  { category: 'C', function: 'Agent d\'accueil', functionCode: 'C-23', annualAmount: 2750, monthlyAmount: 229.17, implementationYear: 2026 },
  { category: 'C', function: 'Agent administratif', functionCode: 'C-24', annualAmount: 2750, monthlyAmount: 229.17, implementationYear: 2025 },
  { category: 'C', function: 'Agent technique', functionCode: 'C-26', annualAmount: 2500, monthlyAmount: 208.33, implementationYear: 2026 },
  { category: 'C', function: 'Agent d\'entretien', functionCode: 'C-27', annualAmount: 2500, monthlyAmount: 208.33, implementationYear: 2026 },
  { category: 'C', function: 'Aide à domicile', functionCode: 'C-28', annualAmount: 2500, monthlyAmount: 208.33, implementationYear: 2024 }
];

// Barème IFSE 2 - Données extraites du guide
export const ifse2Data: IFSE2Data[] = [
  // Indemnités horaires décalés catégorie 1
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: [
      'Agent d\'exploitation des équipements sportifs',
      'Responsable de secteur'
    ],
    direction: 'DMS',
    service: 'SGES'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: [
      'Agent d\'accueil',
      'Agent d\'entretien',
      'Agent polyvalent maintenance travaux',
      'Adjoint au responsable (pôle technique)',
      'Adjoint au responsable (pôle administratif)'
    ],
    direction: 'DMS',
    service: 'CN'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Technicien catégorie C'],
    direction: 'DPO',
    service: 'DIRECTION'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Gardien d\'immeuble'],
    direction: 'DH',
    service: 'Compta & gestion du patrimoine'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['ASVP', 'Chef d\'équipe'],
    direction: 'DRU',
    service: 'ASVP'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Magasinier chauffeur livreur'],
    direction: 'DAJ',
    service: 'Commande publique'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Agent technique polyvalent'],
    direction: 'DAJ',
    service: 'Cimetières'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: [
      'Mécanicien',
      'Gardien logé / non logé',
      'Agent polyvalent administratif'
    ],
    direction: 'DE',
    service: 'Garage'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: [
      'Agent polyvalent (peinture, serrurerie, électricité...)',
      'Chef d\'équipe',
      'Adjoint au responsable de service',
      'Responsable de service'
    ],
    direction: 'DPB',
    service: 'Ateliers municipaux'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Agent polyvalent serrurier', 'Chef d\'équipe'],
    direction: 'DPB',
    service: 'Gestion du CACC'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: [
      'Jardinier',
      'Adjoint au chef d\'équipe',
      'Chef d\'équipe',
      'Responsable des équipes',
      'Secrétaire'
    ],
    direction: 'DE',
    service: 'EV'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: [
      'Agent technique spécialisé',
      'Chauffeur',
      'Chef d\'équipe',
      'Magasinier',
      'Responsable signalisation graffitis',
      'Responsable section nettoiement',
      'Technicien de surface'
    ],
    direction: 'DE',
    service: 'GP'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Animateur socio-culturel'],
    direction: 'DCCS',
    service: 'Antenne des Agnettes'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Agent d\'accueil', 'Responsable technique', 'Agent technique polyvalent'],
    direction: 'DCCS',
    service: 'Aimé Césaire'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Agent d\'accueil', 'Animateur socio-culturel'],
    direction: 'DCCS',
    service: 'Espace Grésillons'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Placier régisseur', 'Chef d\'équipe placier régisseur'],
    direction: 'DDU',
    service: 'Economique'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Gestionnaire courrier'],
    direction: 'DMRU',
    service: 'Services intérieurs'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: [
      'Agent auprès d\'enfants',
      'Cuisinier',
      'Lingère',
      'Lingère aide-cuisinier'
    ],
    direction: 'DPE',
    service: 'Toutes crèches'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Agent d\'entretien', 'Agent comptable', 'Magasinier'],
    direction: 'DMSP',
    service: 'Compta marchés publics'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Assistante de direction'],
    direction: 'DMSP',
    service: 'Direction administrative'
  },

  // Indemnités responsabilités sports et activités nautiques
  {
    motif: 'Indemnités responsabilités sports',
    amount: 168.71,
    jobs: ['Éducateur sportif', 'Responsable de secteur'],
    direction: 'DMS',
    service: 'SGES'
  },
  {
    motif: 'Prime activités nautiques',
    amount: 315.9,
    jobs: ['Maître nageur sauveteur', 'Chef de bassin', 'Adjoint au responsable'],
    direction: 'DMS',
    service: 'CN'
  },

  // Primes accueil 1
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Assistante GCR'],
    direction: 'DRH',
    service: 'GCR'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Assistante DCRH'],
    direction: 'DRH',
    service: 'DCRH'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Agent d\'accueil'],
    direction: 'DMS',
    service: 'CN'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Agent administratif accueil', 'Adjoint au responsable'],
    direction: 'DH',
    service: 'Logement'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Gestionnaire'],
    direction: 'DDU',
    service: 'Urbanisme réglementaire / Domaine public'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Gestionnaire administratif'],
    direction: 'DRU',
    service: 'Hygiène et sécurité'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['ASVP', 'Chef d\'équipe'],
    direction: 'DRU',
    service: 'ASVP'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Secrétaire'],
    direction: 'DE',
    service: 'GP'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Secrétaire'],
    direction: 'DCCS',
    service: 'Antenne des Agnettes'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Agent d\'accueil', 'Responsable pôle accueil'],
    direction: 'DCCS',
    service: 'Aimé Césaire'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Chargé d\'accueil', 'Secrétaire accueil'],
    direction: 'DCCS',
    service: 'Espace Grésillons'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Standardiste'],
    direction: 'DMRU',
    service: 'Services intérieurs'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: [
      'Agent d\'accueil administratif',
      'Adjoint au responsable de service',
      'Gestionnaire',
      'Responsable de service'
    ],
    direction: 'DMRU',
    service: 'Affaires civiles'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: [
      'Agent d\'accueil',
      'Assistante polyvalente',
      'Adjoint au responsable de service'
    ],
    direction: 'DMRU',
    service: 'Accueil démarches prestations'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Assistante de direction'],
    direction: 'DMSP',
    service: 'Direction administrative'
  },

  // Ajout - libellés spécifiques fournis (Indemnités horaires décalés)
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Animateur ALM'],
    direction: 'DME',
    service: 'Enfance'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Animateur ALE'],
    direction: 'DCJ',
    service: 'Jeunesse'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Coordinateur du fil continu'],
    direction: 'DMSP',
    service: 'Dentaire'
  },
  {
    motif: 'Indemnités horaires décalés cat 1',
    amount: 20,
    jobs: ['Médiateur du fil continu'],
    direction: 'DMSP',
    service: 'Prestations de solidarité'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Secrétaire médicale'],
    direction: 'DMSP',
    service: 'Accueil CMS pôle RH - radiologie'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Responsable de service CMS'],
    direction: 'DMSP',
    service: 'Accueil CMS pôle RH'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Animateur santé'],
    direction: 'DMSP',
    service: 'Espace santé jeunes'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Auxiliaire de puériculture'],
    direction: 'DMSP',
    service: 'PMI Timsit & PMI Timbaud'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Secrétaire médicale'],
    direction: 'DMSP',
    service: 'PMI Timbaud'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Agent d\'accueil'],
    direction: 'DMSP',
    service: 'Prévention santé'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Assistante dentaire'],
    direction: 'DMSP',
    service: 'Dentaire'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Agent chargé des repas et télétransmission', 'Agent administratif'],
    direction: 'DSA',
    service: 'ASA'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Secrétaire'],
    direction: 'DSA',
    service: 'Coordination gérontologique'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Conseiller en insertion', 'Assistante', 'Agent d\'accueil'],
    direction: 'DSA',
    service: 'Espace insertion'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Agent d\'accueil', 'Agent administratif'],
    direction: 'DSA',
    service: 'Prestations de solidarité'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Secrétaire accueil'],
    direction: 'DCJ',
    service: 'Cinéma Jean Vigo'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Assistante (direction et administrative)', 'Agent d\'accueil'],
    direction: 'DCJ',
    service: 'Conservatoire'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Secrétaire accueil'],
    direction: 'DCJ',
    service: 'École Manet'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Gestionnaire administratif et financier'],
    direction: 'DCJ',
    service: 'Direction'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Assistant des bibliothèques'],
    direction: 'DCJ',
    service: 'Médiathèques'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Agent d\'accueil'],
    direction: 'DCJ',
    service: 'Jeunesse'
  },
  {
    motif: 'Prime accueil 1',
    amount: 50,
    jobs: ['Chargé d\'information'],
    direction: 'DCJ',
    service: 'Spectacles'
  },

  // Prime accueil 2
  {
    motif: 'Prime accueil 2',
    amount: 50,
    jobs: [
      'Agent d\'accueil administratif',
      'Adjoint au responsable de service',
      'Gestionnaire',
      'Responsable de service'
    ],
    direction: 'DMRU',
    service: 'Affaires civiles'
  },
  {
    motif: 'Prime accueil 2',
    amount: 50,
    jobs: ['Agent d\'accueil', 'Assistante polyvalente', 'Adjoint au responsable de service'],
    direction: 'DMRU',
    service: 'Accueil démarches prestations'
  },
  {
    motif: 'Prime accueil 2',
    amount: 50,
    jobs: ['Assistante de direction'],
    direction: 'DMSP',
    service: 'Direction administrative'
  },
  {
    motif: 'Prime accueil 2',
    amount: 50,
    jobs: ['Secrétaire médicale'],
    direction: 'DMSP',
    service: 'Accueil CMS pôle RH - radiologie'
  },
  {
    motif: 'Prime accueil 2',
    amount: 50,
    jobs: ['Responsable de service CMS'],
    direction: 'DMSP',
    service: 'Accueil CMS pôle RH'
  },
  {
    motif: 'Prime accueil 2',
    amount: 50,
    jobs: ['Animateur santé'],
    direction: 'DMSP',
    service: 'Espace santé jeunes'
  },

  // Primes technicité RH / GCR / assistant DGA
  {
    motif: 'Prime technicité RH',
    amount: 280,
    jobs: [
      'Chargé de formation',
      'Responsable de service DCRH',
      'Adjoint au responsable du service DCRH',
      'Chargé de projets RH stratégiques'
    ],
    direction: 'DRH',
    service: 'DCRH'
  },
  {
    motif: 'Prime technicité GCR',
    amount: 281.71,
    jobs: [
      'Responsable du service GCR',
      'Adjoint au responsable du service GCR',
      'Gestionnaire paie carrière et rémunération',
      'Technicien paie',
      'Chargé de mission carrière'
    ],
    direction: 'DRH',
    service: 'GCR'
  },
  {
    motif: 'Prime technicité assistant DGA',
    amount: 150,
    jobs: ['Responsable de gestion budgétaire', 'Assistant DGA'],
    direction: 'DG',
    service: 'DIRECTION'
  },

  // Primes encadrement technique
  {
    motif: 'Prime chef d\'équipe',
    amount: 85,
    jobs: ['Chef d\'équipe ASVP'],
    direction: 'DRU',
    service: 'ASVP'
  },
  {
    motif: 'Prime chef d\'équipe',
    amount: 85,
    jobs: ['Chef d\'équipe'],
    direction: 'DDU',
    service: 'Economique'
  },
  {
    motif: 'Prime chef d\'équipe',
    amount: 85,
    jobs: ['Chef d\'équipe'],
    direction: 'DAJ',
    service: 'Commande publique'
  },
  {
    motif: 'Prime chef d\'équipe',
    amount: 85,
    jobs: ['Chef d\'équipe', 'Responsable de service'],
    direction: 'DPB',
    service: 'Ateliers municipaux'
  },
  {
    motif: 'Prime chef d\'équipe',
    amount: 85,
    jobs: ['Chef d\'équipe'],
    direction: 'DPB',
    service: 'Gestion du CACC'
  },
  {
    motif: 'Prime chef d\'équipe',
    amount: 85,
    jobs: ['Adjoint au chef d\'équipe', 'Chef d\'équipe', 'Responsable des équipes'],
    direction: 'DE',
    service: 'EV'
  },
  {
    motif: 'Prime chef d\'équipe',
    amount: 85,
    jobs: [
      'Responsable signalisation graffitis',
      'Responsable section nettoiement'
    ],
    direction: 'DE',
    service: 'GP'
  },
  {
    motif: 'Prime chef d\'équipe',
    amount: 85,
    jobs: ['Chef d\'équipe'],
    direction: 'DCCS',
    service: 'Aimé Césaire'
  },
  {
    motif: 'Prime chef d\'équipe',
    amount: 85,
    jobs: ['Chef d\'équipe'],
    direction: 'DESS',
    service: 'SERA'
  },
  {
    motif: 'Forfait HS',
    amount: 121.96,
    jobs: ['Chefs d\'équipe'],
    direction: 'DE',
    service: 'GP'
  },
  {
    motif: 'Forfait HS',
    amount: 100.85,
    jobs: ['Chef d\'équipe'],
    direction: 'DESS',
    service: 'SERA'
  },
  {
    motif: 'Indemnités sujétions soir',
    amount: 16.67,
    jobs: ['Chargé de la vie associative et de la participation citoyenne'],
    direction: 'DCCS',
    service: 'Citoyenneté politique ville'
  },

  // Primes marchés publics et juristes
  {
    motif: 'Prime technicité marchés publics',
    amount: 350,
    jobs: ['Chargé des marchés publics'],
    direction: 'DAJ',
    service: 'Commande publique'
  },
  {
    motif: 'Prime technicité juriste',
    amount: 350,
    jobs: ['Juriste'],
    direction: 'DAJ',
    service: 'Affaires juridiques'
  },

  // Indemnité de sujétion spéciale crèches
  {
    motif: 'Indemnité de sujétion spéciale',
    amount: 18,
    jobs: [
      'Adjoint au directeur de crèche / Directeur crèche',
      'Coordinatrice (selon grade)'
    ],
    direction: 'DPE',
    service: 'Toutes crèches'
  },

  // Primes informatiques DSI
  {
    motif: 'Prime rendement informatique (A)',
    amount: 308.7,
    jobs: ['Administrateur système & BDD', 'Administrateur réseau'],
    direction: 'DSI',
    service: 'Exploitation'
  },
  {
    motif: 'Prime rendement informatique (B)',
    amount: 210.44,
    jobs: ['Administrateur système & BDD', 'Administrateur réseau'],
    direction: 'DSI',
    service: 'Exploitation'
  },
  {
    motif: 'Prime informatique A & B',
    amount: 308.7,
    jobs: ['Chef de projet informatique'],
    direction: 'DSI',
    service: 'Études et projets'
  },
  {
    motif: 'Prime rendement informatique',
    amount: 131.95,
    jobs: ['Responsable de service'],
    direction: 'DSI',
    service: 'Assistance'
  },
  {
    motif: 'Prime informatique ingénierie',
    amount: 465.63,
    jobs: ['Responsable de service'],
    direction: 'DSI',
    service: 'Exploitation'
  },
  {
    motif: 'Prime informatique ingénierie (B)',
    amount: 131.95,
    jobs: ['Technicien informatique (109,12 € ou 131,95 € selon grade)'],
    direction: 'DSI',
    service: 'Assistance'
  },

  // Primes santé / médico-social
  {
    motif: 'PSR Radiologie',
    amount: 140.77,
    jobs: ['Manipulateur radio', 'Responsable de service'],
    direction: 'DMSP',
    service: 'Radiologie'
  },
  {
    motif: 'Prime forfaitaire aux soins',
    amount: 15.24,
    jobs: ['Aide-soignante'],
    direction: 'DMSP',
    service: 'SIADPA'
  },
  {
    motif: 'Prime grand âge',
    amount: 118,
    jobs: ['Aide-soignante'],
    direction: 'DMSP',
    service: 'SIADPA'
  },

  // Primes animation / education
  {
    motif: 'Prime dir° centre de loisirs',
    amount: 340,
    jobs: ['Directeur de centre de loisirs'],
    direction: 'DME',
    service: 'Enfance'
  },
  {
    motif: 'Prime pause méridienne',
    amount: 254.16,
    jobs: ['Animateur encadrement pause méridienne'],
    direction: 'DME',
    service: 'Enfance'
  },
  {
    motif: 'Prime technicité ATSEM',
    amount: 50,
    jobs: ['ATSEM'],
    direction: 'DESS',
    service: 'SERA'
  },
  {
    motif: 'Prime panier repas',
    amount: 60.27,
    jobs: ['Responsable d\'office'],
    direction: 'DESS',
    service: 'SERA'
  },

  // Primes culture / jeunesse
  {
    motif: 'Indemnités sujétions soir et weekend',
    amount: 45.49,
    jobs: ['Responsable de service'],
    direction: 'DCJ',
    service: 'Jeunesse'
  },
  {
    motif: 'Prime responsable de structure',
    amount: 50,
    jobs: ['Adjoint au responsable de service'],
    direction: 'DCJ',
    service: 'Jeunesse'
  },
  {
    motif: 'Indemnités sujétions soir et weekend',
    amount: 41.69,
    jobs: ['Responsable de service'],
    direction: 'DCJ',
    service: 'Spectacles'
  },

  // Primes directions transverses
  {
    motif: 'Prime DG',
    amount: 150,
    jobs: ['DG', 'DGST', 'DGAS', 'DGAUE'],
    direction: 'DG',
    service: 'DG'
  },
  {
    motif: 'Prime ODEC Total',
    amount: 75,
    jobs: ['Responsable de service', 'Adjoint au responsable de service'],
    direction: 'DMRU',
    service: 'Affaires civiles'
  },
  {
    motif: 'Prime ODEC Partiel',
    amount: 40,
    jobs: ['Agents concernés (liste municipale)'],
    direction: 'DMRU',
    service: 'Affaires civiles'
  },
  {
    motif: 'Prime Référent financier principal',
    amount: 75,
    jobs: ['Référent financier principal'],
    direction: 'Toutes dir°',
    service: 'Tous services'
  },
  {
    motif: 'Prime Référent financier suppléant',
    amount: 40,
    jobs: ['Référent financier suppléant'],
    direction: 'Toutes dir°',
    service: 'Tous services'
  },
  {
    motif: 'Prime Maître apprentissage',
    amount: 98.46,
    jobs: ['Maître d\'apprentissage'],
    direction: 'Toutes dir°',
    service: 'Tous services'
  },
  {
    motif: 'Prime intérim',
    amount: 150,
    jobs: ['Agents assurant un intérim'],
    direction: 'Toutes dir°',
    service: 'Tous services'
  },
  {
    motif: 'Prime Expertise comptable',
    amount: 180,
    jobs: ['Responsable de service', 'Agent comptable', 'Coordinateur'],
    direction: 'DAF',
    service: 'Exécution et qualité comptable'
  },
  {
    motif: 'Prime Gestionnaire déconcentré',
    amount: 90,
    jobs: ['Chargé de missions', 'Agent administratif comptable', 'Gestionnaire', 'Adjoint au responsable de service'],
    direction: 'DESS',
    service: 'SSE'
  },
  {
    motif: 'Prime Gestionnaire déconcentré',
    amount: 90,
    jobs: ['Responsable gestion financière'],
    direction: 'DRH',
    service: 'Gestion financière'
  },
  {
    motif: 'Prime formateur interne',
    amount: 75,
    jobs: ['Formateur interne'],
    direction: 'Toutes dir°',
    service: 'Tous services'
  }
];

// Fonctions pour obtenir les données filtrées
export const getFunctionsByCategory = (category: 'A' | 'B' | 'C') => {
  return ifse1Data.filter(item => item.category === category);
};

export const getIFSE1ByFunction = (category: 'A' | 'B' | 'C', functionName: string) => {
  return ifse1Data.find(item => item.category === category && item.function === functionName);
};

export const getIFSE2ByJob = (jobTitle: string) => {
  return ifse2Data.filter(item => 
    item.jobs.some(job => job.toLowerCase().includes(jobTitle.toLowerCase()))
  );
};

export const getAllCategories = (): ('A' | 'B' | 'C')[] => {
  return ['A', 'B', 'C'];
};

export const getFunctionsForCategory = (category: 'A' | 'B' | 'C'): string[] => {
  const functions = ifse1Data
    .filter(item => item.category === category)
    .map(item => item.function);
  return [...new Set(functions)]; // Supprime les doublons
};

// Fonctions pour les directions IFSE 2
export const getAllDirections = (): string[] => {
  const directions = ifse2Data.map(item => item.direction);
  const uniqueDirections = [...new Set(directions)].sort();
  return uniqueDirections;
};

export const getIFSE2ByDirection = (direction: string) => {
  // Récupère les IFSE 2 spécifiques à la direction
  const directionSpecific = ifse2Data.filter(item => item.direction === direction);
  
  // Récupère les IFSE 2 communes à toutes les directions
  const commonIFSE2 = ifse2Data.filter(item => item.direction === 'Toutes dir°');
  
  return [...directionSpecific, ...commonIFSE2];
};

export const getDirectionFullName = (directionCode: string): string => {
  const directionNames: { [key: string]: string } = {
    'DMS': 'Direction Municipale des Sports',
    'DPO': 'Direction des Projets et Ouvrages',
    'DH': 'Direction du Logement',
    'DRU': 'Direction des Relations Urbaines',
    'DAJ': 'Direction des Affaires Juridiques',
    'DE': 'Direction de l\'Environnement',
    'DPB': 'Direction des Projets de Bâtiment',
    'DCCS': 'Direction de la Citoyenneté et de la Cohésion Sociale',
    'DDU': 'Direction du Développement Urbain',
    'DMRU': 'Direction Municipale de la Relation aux Usagers',
    'DPE': 'Direction de la Petite Enfance',
    'DME': 'Direction Municipale de l\'Enfance',
    'DESS': 'Direction de l\'Enseignement et des Services Scolaires',
    'DMSP': 'Direction de la Santé et de la Prévention',
    'DCJ': 'Direction de la Culture et de la Jeunesse',
    'DSA': 'Direction de la Solidarité et de l\'Accompagnement',
    'DSI': 'Direction des Systèmes d\'Information',
    'DRH': 'Direction des Ressources Humaines',
    'DAF': 'Direction des Affaires Financières',
    'DG': 'Direction Générale',
    'Toutes dir°': 'Toutes directions (IFSE 2 communes)'
  };
  
  return directionNames[directionCode] || directionCode;
};
