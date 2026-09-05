import { DEMANDES, formatEuro, type Demande } from "./donnees";
import {
  FormesLignes,
  FormesTableau,
  ModuleVerrouille,
} from "./ModuleVerrouille";
import { ApercusEmail } from "./ApercusEmail";

const OPTIONS = [
  { cle: "menage", nom: "Ménage de fin de séjour", montant: 180, etat: "Confirmée" },
  { cle: "chef", nom: "Chef à domicile, deux soirs", montant: 640, etat: "Confirmée" },
  { cle: "linge", nom: "Livraison de linge", montant: 120, etat: "Anomalie ouverte" },
];

function DetailLasserre() {
  return (
    <>
      <div className="demo-carte">
        <p className="demo-carte-titre">Le devis figé</p>
        <div className="demo-ligne-devis">
          <span>7 nuits à 1 400 €</span>
          <span className="demo-montant">{formatEuro.format(9800)}</span>
        </div>
      </div>

      <div className="demo-carte">
        <p className="demo-carte-titre">Les options choisies</p>
        <ul className="demo-liste">
          {OPTIONS.map((option) => (
            <li key={option.cle} className="demo-ligne-option">
              <span>{option.nom}</span>
              <span className="demo-montant">
                {formatEuro.format(option.montant)}
              </span>
              <span
                className={
                  option.etat === "Anomalie ouverte"
                    ? "demo-statut demo-rouge"
                    : "demo-statut"
                }
              >
                {option.etat}
              </span>
            </li>
          ))}
        </ul>
        <p className="demo-mention demo-rouge">
          Prestataire injoignable depuis deux jours
        </p>
      </div>

      <div className="demo-carte">
        <p className="demo-carte-titre">L’échéancier</p>
        <ul className="demo-liste">
          <li className="demo-ligne-option">
            <span>Acompte 30 %</span>
            <span className="demo-montant">{formatEuro.format(2940)}</span>
            <span className="demo-statut">Encaissé le 4 mars</span>
          </li>
          <li className="demo-ligne-option">
            <span>Solde</span>
            <span className="demo-montant">{formatEuro.format(6860)}</span>
            <span className="demo-statut demo-rouge">
              Dû le 12 juin · En retard
            </span>
          </li>
        </ul>
      </div>

      <ApercusEmail />
    </>
  );
}

function DetailBride() {
  return (
    <>
      <ModuleVerrouille titre="Messagerie avec le client">
        <FormesLignes lignes={5} />
      </ModuleVerrouille>
      <ModuleVerrouille titre="Devis révisé">
        <FormesTableau lignes={4} />
      </ModuleVerrouille>
    </>
  );
}

export function OngletDemandes({
  selection,
  onSelection,
}: {
  selection: string | null;
  onSelection: (cle: string | null) => void;
}) {
  const demande: Demande | null =
    DEMANDES.find((d) => d.cle === selection) ?? null;

  return (
    <div className={`demo-colonnes${demande ? " a-detail" : ""}`}>
      <div className="demo-liste-demandes">
        {DEMANDES.map((d) => (
          <button
            key={d.cle}
            type="button"
            className={`demo-ligne-demande${selection === d.cle ? " est-active" : ""}`}
            onClick={() => onSelection(d.cle)}
          >
            <span className="demo-client">{d.client}</span>
            <span className="demo-cellule">{d.dates}</span>
            <span className="demo-cellule">{d.personnes} personnes</span>
            <span className="demo-montant">{formatEuro.format(d.montant)}</span>
            <span className="demo-statut">{d.statut}</span>
          </button>
        ))}
      </div>

      {demande ? (
        <div className="demo-detail">
          <div className="demo-detail-entete">
            <div>
              <p className="demo-detail-titre">{demande.client}</p>
              <p className="demo-mention">
                {demande.dates} · {demande.personnes} personnes ·{" "}
                {demande.statut}
              </p>
            </div>
            <button
              type="button"
              className="demo-bouton-contour demo-retour"
              onClick={() => onSelection(null)}
            >
              Retour
            </button>
          </div>

          {demande.cle === "lasserre" ? <DetailLasserre /> : <DetailBride />}
        </div>
      ) : null}
    </div>
  );
}
