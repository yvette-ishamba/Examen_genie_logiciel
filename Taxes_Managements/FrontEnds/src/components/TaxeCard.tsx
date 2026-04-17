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
}

export default function TaxCard({ taxe }: TaxeCardProps) {
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
        <button className="text-outline-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">edit</span>
        </button>
      </div>

      <h3 className="text-lg font-bold text-on-surface mb-1">{taxe.nom}</h3>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs font-semibold text-on-surface-variant mb-0.5">{taxe.frequence}</p>
          <p className="text-[10px] text-on-surface-variant/70 italic">
            {taxe.description ?? 'Aucune description'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-primary leading-tight">{formatAmount(taxe.montant_base)}</p>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
            XOF / {period}
          </p>
        </div>
      </div>
    </div>
  );
}