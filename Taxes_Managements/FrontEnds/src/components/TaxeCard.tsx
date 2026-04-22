import { type TaxeOut } from '../services/taxe_api';

// Map frequence from DB to display period label
function getPeriodLabel(frequence: string): string {
  const map: Record<string, string> = {
    'Journalière': 'JOUR',
    'Mensuelle': 'MOIS',
    'Périodique': 'UNITÉ',
  };
  return map[frequence] ?? frequence.toUpperCase();
}

// Map frequence to badge status
function getStatus(frequence: string): 'ACTIF' | 'PÉRIODIQUE' {
  return frequence === 'Périodique' ? 'PÉRIODIQUE' : 'ACTIF';
}

interface TaxeCardProps {
  taxe: TaxeOut;
  onEdit?: (taxe: TaxeOut) => void;
  onDelete?: (id: number) => void;
}

export default function TaxCard({ taxe, onEdit, onDelete }: TaxeCardProps) {
  const status = getStatus(taxe.frequence);
  const period = getPeriodLabel(taxe.frequence);

  // Format amount: show "k" for thousands
  const formatAmount = (val: number) => {
    if (val >= 1000) return `${(val / 1000).toLocaleString('fr-FR')}k`;
    return val.toLocaleString('fr-FR');
  };

  return (
    <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-all relative">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide ${
          status === 'ACTIF'
            ? 'bg-[#bbf7d0] text-[#166534]'
            : 'bg-[#934000] text-white'
        }`}>
          {status}
        </span>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit?.(taxe)}
            className="text-outline-variant hover:text-primary transition-colors bg-white/50 hover:bg-primary/10 rounded-lg p-1"
            title="Modifier"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
          <button 
            onClick={() => {
              if (window.confirm("Êtes-vous sûr de vouloir supprimer cette taxe ?")) {
                onDelete?.(taxe.id);
              }
            }}
            className="text-outline-variant hover:text-error transition-colors bg-white/50 hover:bg-error/10 rounded-lg p-1"
            title="Supprimer"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold text-on-surface mb-1">{taxe.nom}</h3>

      <div className="flex justify-between items-end">
        <div className="flex-1 mr-4">
          <p className="text-xs font-semibold text-on-surface-variant mb-0.5">{taxe.frequence}</p>
          <p className="text-[10px] text-on-surface-variant/70 italic leading-snug">
            {taxe.description ?? 'Aucune description'}
          </p>
        </div>
        {taxe.frequence !== 'Occasionnel' && (
          <div className="text-right shrink-0">
            <p className="text-2xl font-black text-primary leading-tight">{formatAmount(taxe.montant_base)}</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
              FC / {period}
            </p>
          </div>
        )}
        {taxe.frequence === 'Occasionnel' && (
          <div className="text-right shrink-0">
            <div className="bg-primary/5 text-primary text-[10px] font-black px-3 py-1.5 rounded-xl border border-primary/10">
              PRIX LIBRE
            </div>
          </div>
        )}
      </div>
    </div>
  );
}