'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle } from 'lucide-react';

interface ValidatedInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  validator?: (value: string) => boolean;
  validationMessage?: string;
  mask?: (value: string) => string;
}

export function ValidatedInput({
  id,
  value,
  onChange,
  disabled = false,
  type = 'text',
  placeholder,
  validator,
  validationMessage,
  mask,
}: ValidatedInputProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Aplicar máscara se fornecida
    if (mask) {
      newValue = mask(newValue);
    }

    // Validar se fornecido
    if (validator && newValue) {
      setIsValid(validator(newValue));
    } else {
      setIsValid(null);
    }

    onChange(newValue);
  };

  return (
    <div className="relative">
      <Input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`pr-10 ${
          isValid === true
            ? 'border-green-500 focus:border-green-500'
            : isValid === false
              ? 'border-red-500 focus:border-red-500'
              : ''
        }`}
      />
      {isValid !== null && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
          {isValid ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
      )}
      {isValid === false && validationMessage && (
        <p className="mt-1 text-sm text-red-500">{validationMessage}</p>
      )}
    </div>
  );
}

// Utilitários de validação
export const validators = {
  cpf: (cpf: string): boolean => {
    // Remove caracteres não numéricos
    const cleanCpf = cpf.replace(/\D/g, '');

    if (cleanCpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

    // Valida primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf[i]) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (parseInt(cleanCpf[9]) !== digit) return false;

    // Valida segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf[i]) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;

    return parseInt(cleanCpf[10]) === digit;
  },

  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  },

  cep: (cep: string): boolean => {
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.length === 8;
  },
};

// Utilitários de máscara
export const masks = {
  cpf: (value: string): string => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  },

  phone: (value: string): string => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 10) {
      return cleanValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return cleanValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  },

  cep: (value: string): string => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/(\d{5})(\d)/, '$1-$2');
  },
};
