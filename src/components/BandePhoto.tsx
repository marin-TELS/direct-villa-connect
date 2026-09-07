/**
 * Réservation d'emplacement pour les photographies fournies par le studio :
 * aplat de couleur pleine, aucune image, aucun dégradé, aucun motif.
 */
export function BandePhoto({ env }: { env: "nuit" | "jour" }) {
  return (
    <div data-env={env} className="bande-photo">
      <span className="bande-photo-mention">Emplacement photographie</span>
    </div>
  );
}
