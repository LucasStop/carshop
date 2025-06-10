import React from "react";

// Tipo para importação dinâmica do UtilsService

// Importação dinâmica para evitar problemas de SSR
if (typeof window !== "undefined") {
  import("@/services").then((services) => {});
}

export type ValidationStatus = "pending" | "valid" | "invalid" | "empty";

interface ValidationIndicatorProps {
  status: ValidationStatus;
  className?: string;
}

export function ValidationIndicator({
  status,
  className = "",
}: ValidationIndicatorProps) {
  const getIndicator = () => {
    switch (status) {
      case "valid":
        return <span className={`text-green-600 text-sm ${className}`}>✓</span>;
      case "invalid":
        return <span className={`text-red-600 text-sm ${className}`}>✗</span>;
      case "pending":
        return <span className={`text-gray-400 text-sm ${className}`}>○</span>;
      case "empty":
      default:
        return null;
    }
  };

  return (
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
      {getIndicator()}
    </div>
  );
}

// Hook personalizado para calcular o status de validação
export function useValidationStatus(
  value: string | undefined,
  validator?: (value: string) => boolean,
  minLength?: number
): ValidationStatus {
  if (!value || value.length === 0) {
    return "empty";
  }

  if (minLength && value.length < minLength) {
    return "pending";
  }

  if (validator) {
    return validator(value) ? "valid" : "invalid";
  }

  return "valid";
}

// Validadores específicos para diferentes tipos de campo
export const validators = {
  email: (value: string): boolean => {
    if (value.length < 3) return false;
    if (!value.includes("@")) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },

  fullName: (value: string): boolean => {
    if (value.length < 2) return false;
    const names = value.trim().split(" ");
    return names.length >= 2 && names.every((name) => name.length >= 2);
  },

  phone: (value: string): boolean => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 11;
  },
  cpf: (value: string): boolean => {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 11) return false;

    // Validação básica - verifica se não são todos os dígitos iguais
    return !/^(.)\1+$/.test(digits);
  },

  rg: (value: string): boolean => {
    return value.length >= 7 && /^[0-9X.-]+$/i.test(value);
  },

  cep: (value: string): boolean => {
    const digits = value.replace(/\D/g, "");
    return digits.length === 8;
  },

  birthDate: (value: string): boolean => {
    if (!value) return false;
    const birthDate = new Date(value);
    const today = new Date();

    if (isNaN(birthDate.getTime())) return false;

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 18 && age <= 120;
  },

  passwordMatch: (value: string, originalPassword: string): boolean => {
    return value === originalPassword && value.length > 0;
  },
};

// Utilitário para obter mensagens de feedback
export const getValidationMessage = (
  fieldType: keyof typeof validators,
  value: string,
  status: ValidationStatus,
  extraData?: any
): string | null => {
  if (status === "empty") return null;

  switch (fieldType) {
    case "email":
      if (status === "pending") return "Continue digitando...";
      if (value.length < 3) return "Continue digitando...";
      if (!value.includes("@")) return "Digite um email válido";
      if (status === "invalid") return "Formato de email inválido";
      return "Email válido";

    case "fullName":
      if (status === "pending") return "Continue digitando...";
      const names = value.trim().split(" ");
      if (names.length < 2) return "Digite nome e sobrenome";
      if (names.some((name) => name.length < 2))
        return "Cada nome deve ter pelo menos 2 caracteres";
      return "Nome válido";

    case "phone":
      const digits = value.replace(/\D/g, "");
      if (digits.length < 8) return "Continue digitando...";
      if (status === "valid") return "Telefone válido";
      return "Telefone deve ter 10 ou 11 dígitos";

    case "cpf":
      const cpfDigits = value.replace(/\D/g, "");
      if (cpfDigits.length < 11) return "Digite os 11 dígitos do CPF";
      if (status === "valid") return "CPF válido";
      return "CPF inválido";

    case "rg":
      if (value.length < 7) return "RG deve ter pelo menos 7 caracteres";
      if (!/^[0-9X.-]+$/i.test(value))
        return "Use apenas números, pontos, hífens e X";
      return "RG válido";

    case "birthDate":
      if (extraData?.age < 18) return "Você deve ter pelo menos 18 anos";
      if (extraData?.age > 120) return "Data inválida";
      return `${extraData?.age} anos`;

    case "passwordMatch":
      if (status === "invalid") return "As senhas não coincidem";
      return "Senhas coincidem";

    default:
      return null;
  }
};
