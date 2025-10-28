import React, { useState, useEffect } from "react";

interface InfoItem {
  id: number;
  title: string;
  content: string;
}

const AdminInfo: React.FC = () => {
  const [infoItems, setInfoItems] = useState<InfoItem[]>([]);
  const [newInfo, setNewInfo] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    // Charger les données depuis le localStorage ou utiliser les données par défaut
    const savedInfo = localStorage.getItem('cfdt-info-items');
    if (savedInfo) {
      setInfoItems(JSON.parse(savedInfo));
    } else {
      // Données par défaut
      const defaultInfo: InfoItem[] = [
        {
          id: 1,
          title: "Accident de trajet : où commence le trajet domicile-travail lorsqu'un agent réside dans un immeuble collectif ?",
          content: "Le trajet domicile-travail commence dès la sortie de l'immeuble collectif où réside l'agent. Cela inclut les parties communes de l'immeuble (hall, escaliers, ascenseur) jusqu'à la voie publique. En cas d'accident dans ces espaces communs, celui-ci peut être reconnu comme accident de trajet si l'agent se rendait effectivement au travail ou en revenait."
        },
        {
          id: 2,
          title: "Un fonctionnaire territorial peut-il demander une mutation tout en étant en disponibilité ?",
          content: "Dans la fonction publique territoriale, un fonctionnaire placé en disponibilité ne peut pas être muté directement puisqu'il n'est pas en position d'activité. Toutefois, il lui reste possible de préparer sa mobilité et de poser sa candidature à une mutation, à condition de respecter la procédure adaptée. Ce cadre juridique doit être bien compris par les services RH afin d'accompagner correctement les agents."
        },
        {
          id: 3,
          title: "Repenser le recrutement pour une fonction publique plus inclusive.",
          content: "La fonction publique territoriale s'engage vers plus d'inclusivité en diversifiant ses méthodes de recrutement. Cela passe par l'adaptation des épreuves pour les personnes en situation de handicap, la valorisation de l'expérience professionnelle via la reconnaissance des acquis, et le développement de parcours d'insertion pour favoriser l'égalité des chances dans l'accès aux emplois publics."
        },
        {
          id: 4,
          title: "Entretien avec son chef: accident de service?.",
          content: "La circonstance qu'un chef de service, recevant en entretien individuel l'un de ses agents, ait pu adresser à ce dernier plusieurs reproches sur sa manière de servir et s'énerver en lui reprochant notamment « tricher sur ses horaires de travail », n'est pas constitutive d'un accident de service, dès lors que la restitution de cet entretien par l'intéressé ne fait apparaitre aucun propos ou comportement excédant l'exercice normal du pouvoir hiérarchique de ce supérieur.TA Besançon 2400131 du 19.06.2025."
        },
        {
          id: 5,
          title: "Sanction: Utilisation WhatApp.",
          content: "La circonstance qu'un agent ait envoyé depuis son téléphone personnel et sa messagerie WhatsApp, à l'attention de plusieurs personnes, dont des élus, des photos montages assortis de sous-titre déshonorants à l'encontre de la maire de la ville et de son troisième adjoint, présente un caractère fautif et non humoristique, compte-tenu de la nature des photographies diffusées et des personnes visées par ces montages. Par suite, le comportement de l'intéressé constitue un manquement à son obligation de dignité, de réserve de probité, d'intégrité et de loyauté, justifiant son exclusion de fonctions durant deux ans. La circonstance que les messages incriminés soient provenus de la messagerie privée de l'intéressé et en dehors du service est sans incidence dès lors que le comportement d'un agent public peut avoir pour effet de perturber le service ou de jeter le discrédit sur l'administration, comme en l'espèce.TA Cergy-Pontoise 2201748 du 09.07.2025."
        }
      ];
      setInfoItems(defaultInfo);
      localStorage.setItem('cfdt-info-items', JSON.stringify(defaultInfo));
    }
  }, []);

  const saveInfoItems = (items: InfoItem[]) => {
    setInfoItems(items);
    localStorage.setItem('cfdt-info-items', JSON.stringify(items));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Modification
      const updatedItems = infoItems.map(item =>
        item.id === editingId ? { ...newInfo, id: editingId } : item
      );
      saveInfoItems(updatedItems);
    } else {
      // Ajout
      const newId = Math.max(...infoItems.map(item => item.id), 0) + 1;
      const updatedItems = [...infoItems, { ...newInfo, id: newId }];
      saveInfoItems(updatedItems);
    }
    setNewInfo({ title: "", content: "" });
    setEditingId(null);
  };

  const handleEdit = (item: InfoItem) => {
    setNewInfo({ title: item.title, content: item.content });
    setEditingId(item.id);
  };

  const handleDelete = (id: number) => {
    const updatedItems = infoItems.filter(item => item.id !== id);
    saveInfoItems(updatedItems);
  };

  const handleMoveUp = (id: number) => {
    const index = infoItems.findIndex(item => item.id === id);
    if (index > 0) {
      const newItems = [...infoItems];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      saveInfoItems(newItems);
    }
  };

  const handleMoveDown = (id: number) => {
    const index = infoItems.findIndex(item => item.id === id);
    if (index < infoItems.length - 1) {
      const newItems = [...infoItems];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      saveInfoItems(newItems);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📰 Administration des informations NEWS FPT</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Gérez les informations qui apparaissent dans le bandeau déroulant "NEWS FPT"
      </p>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem", background: "#f9f9f9", padding: "1.5rem", borderRadius: "8px" }}>
        <h2>{editingId ? "Modifier" : "Ajouter"} une information</h2>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Titre (affiché dans le bandeau) :
          </label>
          <input
            type="text"
            placeholder="Titre de l'information"
            value={newInfo.title}
            onChange={(e) => setNewInfo({ ...newInfo, title: e.target.value })}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Contenu détaillé (affiché dans la popup) :
          </label>
          <textarea
            placeholder="Contenu détaillé de l'information"
            value={newInfo.content}
            onChange={(e) => setNewInfo({ ...newInfo, content: e.target.value })}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px", height: "120px" }}
            required
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" style={{ padding: "0.75rem 1.5rem", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            {editingId ? "Modifier" : "Ajouter"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setNewInfo({ title: "", content: "" });
                setEditingId(null);
              }}
              style={{ padding: "0.75rem 1.5rem", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <div>
        <h2>Informations existantes ({infoItems.length})</h2>
        {infoItems.length === 0 ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>Aucune information pour le moment.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {infoItems.map((item, index) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  background: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>
                      #{item.id}: {item.title}
                    </h3>
                    <p style={{ margin: "0", color: "#666", fontSize: "0.9em", lineHeight: "1.4" }}>
                      {item.content.length > 150 ? `${item.content.substring(0, 150)}...` : item.content}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginLeft: "1rem" }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{ padding: "0.25rem 0.5rem", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.8em" }}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{ padding: "0.25rem 0.5rem", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.8em" }}
                    >
                      Supprimer
                    </button>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button
                        onClick={() => handleMoveUp(item.id)}
                        disabled={index === 0}
                        style={{ padding: "0.25rem 0.5rem", background: index === 0 ? "#ccc" : "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: index === 0 ? "not-allowed" : "pointer", fontSize: "0.8em" }}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleMoveDown(item.id)}
                        disabled={index === infoItems.length - 1}
                        style={{ padding: "0.25rem 0.5rem", background: index === infoItems.length - 1 ? "#ccc" : "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: index === infoItems.length - 1 ? "not-allowed" : "pointer", fontSize: "0.8em" }}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInfo;
