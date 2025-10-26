import { useState } from 'react';
import { Euro, ArrowLeft, AlertCircle } from 'lucide-react';

interface CalculateurCIAProps {
  onClose: () => void;
}

export default function CalculateurCIA({ onClose }: CalculateurCIAProps) {
  const [ifseMensuel, setIfseMensuel] = useState<number>(0);
  const [tauxEvaluation, setTauxEvaluation] = useState<number>(100);
  const [joursAbsenceN1, setJoursAbsenceN1] = useState<number>(0);
  
  // Calcul du CIA
  const calculerCIA = () => {
    if (ifseMensuel <= 0) {
      return {
        ifseAnnuel: 0,
        base10Pourcent: 0,
        tauxAbsence: 0,
        ciaEvaluation: 0,
        ciaAbsence: 0,
        ciaFinal: 0,
        detailCalcul: ""
      };
    }
    
    // ÉTAPE 1: Calcul de la base CIA
    // CIA = (IFSE mensuel × 10% × 12)
    const ifseAnnuel = ifseMensuel * 12;
    const base10Pourcent = ifseAnnuel * 0.10; // 10% de l'IFSE annuel
    
    // ÉTAPE 2: Calcul de la première moitié (Taux d'évaluation)
    // La première moitié dépend du taux d'évaluation annuelle
    const ciaEvaluation = (base10Pourcent / 2) * (tauxEvaluation / 100);
    
    // ÉTAPE 3: Calcul de la deuxième moitié (Jours d'absence N-1)
    // Déterminer le taux selon les jours d'absence
    let tauxAbsence = 0;
    if (joursAbsenceN1 < 5) {
      tauxAbsence = 100; // < 5 jours: 100%
    } else if (joursAbsenceN1 <= 10) {
      tauxAbsence = 50;  // 5-10 jours: 50%
    } else {
      tauxAbsence = 0;   // > 10 jours: 0%
    }
    
    const ciaAbsence = (base10Pourcent / 2) * (tauxAbsence / 100);
    
    // ÉTAPE 4: CIA Final
    const ciaFinal = ciaEvaluation + ciaAbsence;
    
    // Détail du calcul
    const detailCalcul = `
Calcul détaillé du CIA:
1️⃣ IFSE annuel = ${ifseMensuel}€ × 12 = ${ifseAnnuel}€
2️⃣ Base CIA (10% de l'IFSE annuel) = ${ifseAnnuel}€ × 10% = ${base10Pourcent.toFixed(2)}€

📊 Répartition sur 2 moitiés (chaque moitié = 50%):

1️⃣ PREMIÈRE MOITIÉ (Évaluation annuelle):
   • Montant de la moitié = ${base10Pourcent.toFixed(2)}€ ÷ 2 = ${(base10Pourcent / 2).toFixed(2)}€
   • Taux d'évaluation = ${tauxEvaluation}%
   • CIA Évaluation = ${(base10Pourcent / 2).toFixed(2)}€ × ${tauxEvaluation}% = ${ciaEvaluation.toFixed(2)}€

2️⃣ DEUXIÈME MOITIÉ (Jours d'absence N-1):
   • Montant de la moitié = ${base10Pourcent.toFixed(2)}€ ÷ 2 = ${(base10Pourcent / 2).toFixed(2)}€
   • Jours d'absence en N-1 = ${joursAbsenceN1} jours
   • Taux appliqué = ${tauxAbsence}%
     (< 5 jours = 100% | 5-10 jours = 50% | > 10 jours = 0%)
   • CIA Absence = ${(base10Pourcent / 2).toFixed(2)}€ × ${tauxAbsence}% = ${ciaAbsence.toFixed(2)}€

✅ CIA ANNUEL TOTAL = ${ciaEvaluation.toFixed(2)}€ + ${ciaAbsence.toFixed(2)}€ = ${ciaFinal.toFixed(2)}€
💰 CIA MENSUEL = ${(ciaFinal / 12).toFixed(2)}€
    `.trim();
    
    return {
      ifseAnnuel,
      base10Pourcent,
      tauxAbsence,
      ciaEvaluation,
      ciaAbsence,
      ciaFinal,
      detailCalcul
    };
  };
  
  const resultat = calculerCIA();
  const ciaMensuel = resultat.ciaFinal / 12;

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-amber-600 hover:text-amber-700 p-2 rounded-full hover:bg-amber-50 bg-white border-2 border-amber-300 transition-all shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative p-4 bg-white/20 rounded-full">
                <Euro className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Calculateur CIA</h3>
                <p className="text-amber-100">Complément Indemnitaire Annuel - Calcul détaillé</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 bg-white">
        
        {/* Entrée IFSE Mensuel */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            💰 IFSE Mensuel (Indemnité Forfaitaire pour Sujétion Exceptionnelle)
          </label>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-gray-600">€</span>
            <input
              type="number"
              value={ifseMensuel || ''}
              onChange={(e) => setIfseMensuel(Number(e.target.value))}
              placeholder="Ex: 250"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Montant IFSE que vous percevez mensuellement
          </p>
        </div>

        {/* Taux d'Évaluation */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            📊 Taux d'Évaluation Annuelle (Première moitié du CIA)
          </label>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 0, label: "0%", desc: "Insuffisant" },
                { value: 50, label: "50%", desc: "Satisfaisant" },
                { value: 70, label: "70%", desc: "Bien" },
                { value: 100, label: "100%", desc: "Très bien" }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setTauxEvaluation(option.value)}
                  className={`p-3 rounded-lg font-semibold transition-all ${
                    tauxEvaluation === option.value
                      ? 'bg-purple-600 text-white border-2 border-purple-800'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <div>{option.label}</div>
                  <div className="text-xs">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Défini lors de votre évaluation annuelle par votre responsable
          </p>
        </div>

        {/* Jours d'Absence N-1 */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            📅 Jours d'Absence en N-1 (Deuxième moitié du CIA)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              value={joursAbsenceN1}
              onChange={(e) => setJoursAbsenceN1(Math.max(0, Number(e.target.value)))}
              placeholder="Ex: 3"
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-lg font-bold"
            />
            <span className="text-gray-600">jours d'absence en année N-1</span>
          </div>
          
          {/* Affichage du taux appliqué */}
          <div className="mt-3 p-3 bg-white rounded border border-red-300">
            {joursAbsenceN1 < 5 && (
              <div className="text-sm text-green-700 font-semibold">
                ✅ Moins de 5 jours → Taux appliqué: <span className="text-lg">100%</span>
              </div>
            )}
            {joursAbsenceN1 >= 5 && joursAbsenceN1 <= 10 && (
              <div className="text-sm text-orange-700 font-semibold">
                ⚠️ Entre 5 et 10 jours → Taux appliqué: <span className="text-lg">50%</span>
              </div>
            )}
            {joursAbsenceN1 > 10 && (
              <div className="text-sm text-red-700 font-semibold">
                ❌ Plus de 10 jours → Taux appliqué: <span className="text-lg">0%</span>
              </div>
            )}
          </div>
        </div>

        {/* RÉSULTATS */}
        {ifseMensuel > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-3 border-orange-400 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Euro className="w-7 h-7 text-orange-600" />
              <h4 className="font-bold text-orange-800 text-xl">Résultat de votre CIA</h4>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
                <h5 className="font-medium text-gray-600 mb-1 text-sm">1️⃣ CIA Évaluation</h5>
                <div className="text-2xl font-bold text-purple-700">
                  {resultat.ciaEvaluation.toFixed(2)}€
                </div>
                <p className="text-xs text-gray-500 mt-1">{tauxEvaluation}% du taux</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border-2 border-red-300">
                <h5 className="font-medium text-gray-600 mb-1 text-sm">2️⃣ CIA Absences</h5>
                <div className="text-2xl font-bold text-red-700">
                  {resultat.ciaAbsence.toFixed(2)}€
                </div>
                <p className="text-xs text-gray-500 mt-1">{resultat.tauxAbsence}% du taux</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border-3 border-orange-400">
                <h5 className="font-medium text-gray-600 mb-1 text-sm">✅ CIA ANNUEL TOTAL</h5>
                <div className="text-3xl font-bold text-orange-700">
                  {resultat.ciaFinal.toFixed(2)}€
                </div>
                <p className="text-xs text-gray-500 mt-1 font-semibold">{ciaMensuel.toFixed(2)}€/mois</p>
              </div>
            </div>

            {/* Détail du calcul */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 font-mono text-xs text-gray-700 overflow-auto max-h-60">
              <pre className="whitespace-pre-wrap">{resultat.detailCalcul}</pre>
            </div>
          </div>
        )}

        {/* Info CIA */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-800">
              <strong>📋 Calcul du CIA (Complément Indemnitaire Annuel)</strong>
              <ul className="mt-2 space-y-1 ml-4 list-disc">
                <li><strong>Base:</strong> 10% du montant IFSE mensuel × 12 mois ÷ 2</li>
                <li><strong>Première moitié:</strong> Taux d'évaluation annuelle (0%, 50%, 70%, ou 100%)</li>
                <li><strong>Deuxième moitié:</strong> Basée sur jours d'absence année N-1</li>
                <li><strong>Seuils absence:</strong> &lt;5j=100% | 5-10j=50% | &gt;10j=0%</li>
              </ul>
              <p className="mt-3 text-xs text-orange-700">
                💡 Pour des informations complètes, consultez la CFDT ou votre service RH
              </p>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Fermer
          </button>
          <button
            onClick={() => {
              setIfseMensuel(0);
              setTauxEvaluation(100);
              setJoursAbsenceN1(0);
            }}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}