import React, { useState } from 'react';
import './History.scss';

type CalculationType = "amortizer" | "compounder";

interface HistoryEntry {
  id: string;
  type: CalculationType;
  timestamp: string;
  details: string;
}

export const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addToHistory = (entry: Omit<HistoryEntry, "id">) => {
    setHistory((prev) => [
      { id: crypto.randomUUID(), ...entry },
      ...prev,
    ]);
  };

  const deleteHistoryEntry = (id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="history">
      <h3>Historique des calculs</h3>
      {history.length === 0 ? (
        <p>Aucun historique disponible.</p>
      ) : (
        <ul>
          {history.map((entry) => (
            <li key={entry.id}>
              <p>Type: {entry.type}</p>
              <p>Détails: {entry.details}</p>
              <p>Timestamp: {entry.timestamp}</p>
              <button onClick={() => deleteHistoryEntry(entry.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={clearHistory}>Vider l'historique</button>
    </div>
  );
};

export default History;