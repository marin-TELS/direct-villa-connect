import {
  FormesGraphe,
  FormesLignes,
  FormesTableau,
  ModuleVerrouille,
} from "./ModuleVerrouille";

export function OngletVisibilite() {
  return (
    <div className="demo-visibilite">
      <div className="demo-deux-colonnes">
        <div className="demo-carte">
          <p className="demo-carte-titre">
            Votre visibilité dans les réponses des IA
          </p>
          <p className="demo-mention">Audit du 18 août 2026</p>
          <p className="demo-verdict">Bonne</p>
          <p className="demo-chiffre-grand">49 / 100</p>
        </div>

        <div className="demo-carte">
          <p className="demo-carte-titre">Votre part de voix</p>
          <p className="demo-verdict">N° 1 sur 7 établissements cités</p>
          <div className="demo-barre-piste">
            <span className="demo-barre-remplissage" style={{ width: "21.5%" }} />
          </div>
          <p className="demo-montant">21,5 %</p>
        </div>
      </div>

      <div className="demo-deux-colonnes">
        <ModuleVerrouille titre="Progression audit après audit">
          <FormesGraphe colonnes={8} />
        </ModuleVerrouille>
        <ModuleVerrouille titre="Verbatims">
          <FormesLignes lignes={5} />
        </ModuleVerrouille>
      </div>

      <div className="demo-deux-colonnes">
        <ModuleVerrouille titre="Recommandations">
          <FormesLignes lignes={4} />
        </ModuleVerrouille>
        <ModuleVerrouille titre="Détail des recherches testées">
          <FormesTableau lignes={6} />
        </ModuleVerrouille>
      </div>
    </div>
  );
}
