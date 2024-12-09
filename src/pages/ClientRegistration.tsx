import React, { useState } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { Card } from '../types';
import { Check, X, AlertCircle, Upload, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const mockPendingRegistrations: Card[] = [
  {
    id: '1',
    dentistName: 'Dr. João Silva',
    clinicName: 'Clínica Silva',
    phone: '(11) 99999-9999',
    email: 'joao.silva@email.com',
    registrationStatus: 'pending',
    registrationDate: '2024-03-15T10:00:00Z',
    cro: '123456-SP'
  },
  // Add more mock data as needed
];

export default function ClientRegistration() {
  const { canApproveClientRegistration } = usePermissions();
  const [registrations, setRegistrations] = useState(mockPendingRegistrations);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [creditLimit, setCreditLimit] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success('Documento anexado com sucesso');
    }
  };

  const handleApprove = (id: string) => {
    if (!creditLimit) {
      toast.error('Informe o limite de crédito');
      return;
    }

    if (!selectedFile) {
      toast.error('Anexe a documentação necessária');
      return;
    }

    setRegistrations(prev => prev.map(reg => 
      reg.id === id ? { 
        ...reg, 
        registrationStatus: 'approved', 
        credit_limit: parseFloat(creditLimit),
        documentationFile: selectedFile.name
      } : reg
    ));
    toast.success('Cadastro aprovado com sucesso');
    setSelectedFile(null);
    setCreditLimit('');
  };

  const handleReject = (id: string, reason: string) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === id ? { ...reg, registrationStatus: 'rejected', registrationNotes: reason } : reg
    ));
    toast.success('Cadastro rejeitado');
  };

  if (!canApproveClientRegistration) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 font-poppins">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-900 font-poppins">
        Aprovar Cadastros
      </h1>

      <div className="space-y-4">
        {registrations.map(registration => (
          <div
            key={registration.id}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900 font-poppins">
                  {registration.dentistName}
                </h2>
                <p className="text-sm text-gray-500 font-poppins mt-1">
                  {registration.clinicName}
                </p>
                <p className="text-sm text-gray-500 font-poppins">
                  CRO: {registration.cro}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {registration.registrationStatus === 'pending' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Pendente
                  </span>
                ) : registration.registrationStatus === 'approved' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="w-4 h-4 mr-1" />
                    Aprovado
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <X className="w-4 h-4 mr-1" />
                    Rejeitado
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-poppins">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900 font-poppins">
                  {registration.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 font-poppins">
                  Telefone
                </label>
                <p className="mt-1 text-sm text-gray-900 font-poppins">
                  {registration.phone}
                </p>
              </div>
            </div>

            {registration.registrationStatus === 'pending' && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-poppins mb-1">
                      Limite de Crédito
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={creditLimit}
                        onChange={(e) => setCreditLimit(e.target.value)}
                        className="pl-10 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-poppins"
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-poppins mb-1">
                      Documentação
                    </label>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Anexar Documentos
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </label>
                      {selectedFile && (
                        <span className="text-sm text-gray-500 font-poppins">
                          {selectedFile.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      const reason = prompt('Motivo da rejeição:');
                      if (reason) handleReject(registration.id, reason);
                    }}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 font-poppins"
                  >
                    Rejeitar
                  </button>
                  <button
                    onClick={() => handleApprove(registration.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 font-poppins"
                  >
                    Aprovar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}