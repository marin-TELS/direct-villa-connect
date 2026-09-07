import type { ReactNode } from "react";

/**
 * Rendus du produit construits en HTML et CSS : jamais de photographie,
 * jamais d'illustration. Cadre de navigateur et cadre de téléphone.
 */
export function CadreNavigateur({
  adresse,
  children,
  className = "",
}: {
  adresse: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`cadre-navigateur ${className}`.trim()} aria-hidden="true">
      <div className="cadre-barre">
        <span className="cadre-carres">
          <span className="cadre-carre" />
          <span className="cadre-carre" />
          <span className="cadre-carre" />
        </span>
        <span className="cadre-adresse">{adresse}</span>
      </div>
      <div className="cadre-contenu">{children}</div>
    </div>
  );
}

export function CadreTelephone({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`cadre-telephone ${className}`.trim()} aria-hidden="true">
      <div className="cadre-telephone-contenu">{children}</div>
    </div>
  );
}
