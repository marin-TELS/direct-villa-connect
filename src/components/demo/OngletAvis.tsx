import { AVIS } from "./donnees";

export function OngletAvis() {
  return (
    <div className="demo-avis">
      {AVIS.map((avis) => (
        <article key={avis.cle} className="demo-carte demo-avis-carte">
          <p className="demo-avis-entete">
            <span className="demo-avis-prenom">{avis.prenom}</span>
            <span className="demo-mention">{avis.mois}</span>
            <span className="demo-montant">{avis.note}/5</span>
          </p>
          <p className="demo-avis-texte">{avis.texte}</p>
        </article>
      ))}
    </div>
  );
}
