/** Miniature de site de villa, entièrement en CSS. Aucune image. */
export function MiniatureSiteVilla() {
  return (
    <div className="mini-site">
      <div className="mini-site-titre">
        <span className="mini-site-nom">Mas des Oliviers</span>
        <span className="mini-site-liens">
          <span>La maison</span>
          <span className="mini-point">·</span>
          <span>Les tarifs</span>
          <span className="mini-point">·</span>
          <span>Réserver</span>
        </span>
      </div>

      <div className="mini-site-scene">
        <div className="mini-site-aplat">
          <span className="mini-site-mention">Emplacement photographie</span>
        </div>

        <div className="mini-site-encart">
          <p className="mini-encart-ligne">Du 12 au 19 juillet</p>
          <p className="mini-encart-ligne">8 personnes</p>
          <p className="mini-encart-montant">9 800 €</p>
          <span className="mini-bouton">Demander ces dates</span>
        </div>
      </div>
    </div>
  );
}
