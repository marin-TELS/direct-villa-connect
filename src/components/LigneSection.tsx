interface LigneSectionProps {
  numero?: string;
  libelle: string;
}

/**
 * Ligne d'ouverture de section : numéro en signal clair, point médian,
 * libellé, puis un filet qui s'étend jusqu'au bord droit du conteneur.
 */
export function LigneSection({ numero, libelle }: LigneSectionProps) {
  return (
    <div className="ligne-section" data-apparition>
      {numero ? (
        <>
          <span className="numero-section">{numero}</span>
          <span className="point-median" aria-hidden="true">
            ·
          </span>
        </>
      ) : null}
      <span className="t-libelle">{libelle}</span>
      <span className="filet" aria-hidden="true" />
    </div>
  );
}

