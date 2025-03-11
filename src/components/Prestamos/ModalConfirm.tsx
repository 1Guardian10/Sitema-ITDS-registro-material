import React from "react";
import { X } from "lucide-react";

interface ObservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: number) => void;
}

const ObservationsModal = ({ isOpen, onClose, onSubmit }: ObservationsModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(1); // Enviar 1 cuando el usuario acepta
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-dark">Agregar Observaciones</h2>
          <button 
            onClick={onClose} 
            className="text-neutral hover:text-dark transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-dark mb-1">
              ¿Desea agregar alguna observación antes de devolver el material?
            </label>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                onSubmit(0); // Enviar 0 cuando el usuario cancela
                onClose();
              }}
              className="px-4 py-2 border border-neutral/20 rounded-md text-sm font-medium text-dark hover:bg-neutral/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-primary-light transition-colors"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ObservationsModal;