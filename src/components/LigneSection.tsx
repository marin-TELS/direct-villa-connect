interface LigneSectionProps {
  numero: string;
  libelle: string;
}

/**
 * Ligne d'ouverture de section : numéro en signal clair, libellé,
 * puis un filet qui s'étend jusqu'au bord droit du conteneur.
 */
export function LigneSection({ numero, libelle }: LigneSectionProps) {
  return (
    <div className="ligne-section" data-apparition>
      <span className="numero-section">{numero}</span>
      <span className="t-libelle">{libelle}</span>
      <span className="filet" aria-hidden="true" />
    </div>
  );
}
