/**
 * Données de démonstration, entièrement fictives et entièrement en mémoire.
 * Aucune requête réseau, aucun stockage, aucune coordonnée bancaire.
 */

export type StatutDemande =
  | "Confirmée"
  | "Devis envoyé"
  | "Nouvelle demande";

export interface Demande {
  cle: string;
  client: string;
  dates: string;
  personnes: number;
  montant: number;
  statut: StatutDemande;
}

export const DEMANDES: Demande[] = [
  {
    cle: "lasserre",
    client: "Famille Lasserre",
    dates: "12 au 19 juillet",
    personnes: 8,
    montant: 9800,
    statut: "Confirmée",
  },
  {
    cle: "aubert",
    client: "Séminaire Aubert & Cie",
    dates: "3 au 5 septembre",
    personnes: 14,
    montant: 6200,
    statut: "Devis envoyé",
  },
  {
    cle: "mendez",
    client: "Famille Mendez",
    dates: "2 au 16 août",
    personnes: 10,
    montant: 19600,
    statut: "Confirmée",
  },
  {
    cle: "rouviere",
    client: "Mariage Rouvière",
    dates: "30 mai au 1er juin",
    personnes: 12,
    montant: 7400,
    statut: "Nouvelle demande",
  },
  {
    cle: "kirchner",
    client: "Famille Kirchner",
    dates: "21 au 28 juin",
    personnes: 6,
    montant: 9800,
    statut: "Confirmée",
  },
];

export const formatEuro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/** Séjours confirmés placés dans le calendrier de démonstration. */
export const SEJOURS = [
  { cle: "kirchner", mois: 5, debut: 21, fin: 28 },
  { cle: "lasserre", mois: 6, debut: 12, fin: 19 },
  { cle: "mendez", mois: 7, debut: 2, fin: 16 },
];

/** Période bloquée par le propriétaire. */
export const BLOCAGE = { mois: 5, debut: 8, fin: 10 };

export const ECHEANCES = [
  {
    cle: "lasserre-solde",
    client: "Famille Lasserre",
    montant: 6860,
    date: "12 juin",
    statut: "En retard",
    retard: true,
  },
  {
    cle: "kirchner-solde",
    client: "Famille Kirchner",
    montant: 6860,
    date: "24 mai",
    statut: "À échoir",
    retard: false,
  },
  {
    cle: "mendez-solde",
    client: "Famille Mendez",
    montant: 13720,
    date: "5 juillet",
    statut: "À échoir",
    retard: false,
  },
];

export const AVIS = [
  {
    cle: "camille",
    prenom: "Camille",
    mois: "juillet",
    note: 5,
    texte:
      "« La maison est encore plus belle que sur les photos. L’accueil était parfait, nous reviendrons. »",
  },
  {
    cle: "thomas",
    prenom: "Thomas",
    mois: "août",
    note: 5,
    texte:
      "« Grande maison, très bien tenue. Le chef recommandé par les propriétaires était excellent. »",
  },
  {
    cle: "helene",
    prenom: "Hélène",
    mois: "juin",
    note: 4,
    texte:
      "« Séjour très agréable. Un petit délai pour la mise en route de la climatisation, vite réglé. »",
  },
];
