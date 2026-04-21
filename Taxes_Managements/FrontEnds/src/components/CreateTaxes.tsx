import React, { useState } from 'react';
import Button from './Button';
import { taxeApi, type TaxeCreate } from '../services/taxe_api';

interface CreateTaxesProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (taxe: any) => void;
}

const FREQUENCES = [
  {
    value: 'Journalier',
    label: 'Journalier',
    icon: 'calendar_today',
    desc: 'Collecte chaque jour',
  },
  {
    value: 'Mensuel',
    label: 'Mensuel',
    icon: 'event',
    desc: 'Collecte chaque mois',
  },
  {
    value: 'Annuel',
    label: 'Annuel',
    icon: 'calendar_month',
    desc: 'Collecte chaque année',
  },
  {
    value: 'Occasionnel',
    label: 'Occasionnel',
    icon: 'bolt',
    desc: "Prix défini à la collecte par l'agent",
    prixLibre: true,
  },
];

const defaultForm = (): TaxeCreate => ({
  nom: '',
  montant_base: 0,
  frequence: 'Journalier',
  description: '',
  prix_libre: false,
});

export default function CreateTaxes({ isOpen, onClose, onCreated }: CreateTaxesProps) {
  const [form, setForm] = useState<TaxeCreate>(defaultForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedFreq = FREQUENCES.find(f => f.value === form.frequence);
  const isOccasionnel = form.frequence === 'Occasionnel';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'montant_base' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFreqSelect = (value: string) => {
    const freq = FREQUENCES.find(f => f.value === value);
    setForm(prev => ({
      ...prev,
      frequence: value,
      prix_libre: !!freq?.prixLibre,
      montant_base: freq?.prixLibre ? 0 : prev.montant_base,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.nom.trim()) return setError('Le nom de la taxe est requis.');
    if (!isOccasionnel && form.montant_base <= 0)
      return setError('Le montant doit être supérieur à 0.');

    setLoading(true);
    try {
      const newTaxe = await taxeApi.create(form);
      onCreated(newTaxe);
      setForm(defaultForm());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-150 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-outline-variant/10">
          <div>
            <h2 className="text-lg font-black text-on-surface">Nouvelle Taxe</h2>
            <p className="text-xs text-on-surface-variant">Configurer une nouvelle catégorie de taxe</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 max-h-[80vh] overflow-y-auto">

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-3">
              <span className="material-symbols-outlined text-red-500 text-xl">error</span>
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          )}

          {/* Nom de la taxe */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">
              Nom de la Taxe *
            </label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Ex: Taxe de Place, Taxe d'Hygiène..."
              className="w-full bg-surface-container px-4 py-3 rounded-xl text-sm outline-none ring-1 ring-outline-variant/30 focus:ring-primary/60 transition-all placeholder:text-on-surface-variant/40 font-medium"
            />
          </div>

          {/* Fréquence — card selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">
              Fréquence *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FREQUENCES.map(f => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => handleFreqSelect(f.value)}
                  className={`relative flex flex-col items-start gap-1 p-3 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                    form.frequence === f.value
                      ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                      : 'border-outline-variant/20 hover:border-primary/30 bg-surface-container'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    form.frequence === f.value ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">{f.icon}</span>
                  </div>
                  <span className={`text-xs font-black ${form.frequence === f.value ? 'text-primary' : 'text-on-surface'}`}>
                    {f.label}
                  </span>
                  <span className="text-[10px] text-on-surface-variant leading-tight">{f.desc}</span>
                  {/* Checkmark */}
                  {form.frequence === f.value && (
                    <span className="absolute top-2 right-2 material-symbols-outlined text-primary text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Montant de base — hidden for Occasionnel */}
          {!isOccasionnel ? (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                Montant de Base (CDF) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="montant_base"
                  value={form.montant_base || ''}
                  onChange={handleChange}
                  placeholder="500"
                  min={1}
                  className="w-full bg-surface-container px-4 py-3 pr-16 rounded-xl text-sm outline-none ring-1 ring-outline-variant/30 focus:ring-primary/60 transition-all placeholder:text-on-surface-variant/40 font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant/60">CDF</span>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-200 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <span className="material-symbols-outlined text-amber-500 text-2xl flex-shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
              <div>
                <p className="text-xs font-black text-amber-700">Prix libre — Occasionnel</p>
                <p className="text-[11px] text-amber-600 mt-0.5">
                  Le montant sera saisi par l'agent au moment de la collecte.
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">
              Description <span className="font-normal normal-case text-on-surface-variant/50">(optionnelle)</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ex: Marchés & Trottoirs, applicable quotidiennement..."
              rows={2}
              className="w-full bg-surface-container px-4 py-3 rounded-xl text-sm outline-none ring-1 ring-outline-variant/30 focus:ring-primary/60 transition-all placeholder:text-on-surface-variant/40 font-medium resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="flex-1"
              loading={loading}
              leftIcon={<span className="material-symbols-outlined text-lg">save</span>}
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
