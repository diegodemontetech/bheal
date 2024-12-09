export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatCPFCNPJ = (value: string): string => {
  // Remove non-digits
  const digits = value.replace(/\D/g, '');
  
  // Format as CNPJ
  if (digits.length > 11) {
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  }
  
  // Format as CPF
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
};

export const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 14);
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
};

export const formatCEP = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 9);
};

export const formatWeight = (value: number): string => {
  return `${value.toFixed(3)} kg`;
};

export const formatDate = (value: string): string => {
  return new Date(value).toLocaleDateString('pt-BR');
};

export const formatDateTime = (value: string): string => {
  return new Date(value).toLocaleString('pt-BR');
};