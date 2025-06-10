"use client";

import { useWatch } from "react-hook-form";
import { CheckCircle, XCircle, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { UtilsService } from "@/services";

interface FormValidationSummaryProps {
  control: any;
}

export function FormValidationSummary({ control }: FormValidationSummaryProps) {
  const watchedFields = useWatch({
    control,
    name: [
      "name",
      "email", 
      "password",
      "password_confirmation",
      "phone",
      "cpf",
      "rg",
      "birth_date",
      "address.zip_code",
      "address.address",
      "address.number",
      "address.city",
      "address.state",
      "agreeToTerms"
    ]
  });

  const [
    name,
    email,
    password,
    passwordConfirmation,
    phone,
    cpf,
    rg,
    birthDate,
    zipCode,
    address,
    number,
    city,
    state,
    agreeToTerms
  ] = watchedFields;

  const validations = [
    {
      label: "Nome completo",
      isValid: name && name.trim().split(" ").length >= 2 && name.trim().split(" ").every((n: string) => n.length >= 2),
      field: name
    },
    {
      label: "Email válido",
      isValid: email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      field: email
    },
    {
      label: "Senha forte",
      isValid: password && password.length >= 6 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password),
      field: password
    },
    {
      label: "Senhas coincidem",
      isValid: password && passwordConfirmation && password === passwordConfirmation,
      field: passwordConfirmation
    },
    {
      label: "Telefone válido",
      isValid: phone && phone.replace(/\D/g, "").length >= 10,
      field: phone
    },
    {
      label: "CPF válido",
      isValid: cpf && UtilsService.validateCPF(cpf),
      field: cpf
    },
    {
      label: "RG preenchido",
      isValid: rg && rg.length >= 7,
      field: rg
    },
    {
      label: "Data de nascimento válida",
      isValid: birthDate && (() => {
        const date = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
          age--;
        }
        return age >= 18 && age <= 120;
      })(),
      field: birthDate
    },
    {
      label: "CEP válido",
      isValid: zipCode && zipCode.replace(/\D/g, "").length === 8,
      field: zipCode
    },
    {
      label: "Endereço completo",
      isValid: address && address.length >= 5 && number && city && state && state.length === 2,
      field: address
    },
    {
      label: "Termos aceitos",
      isValid: agreeToTerms === true,
      field: agreeToTerms
    }
  ];
  const validCount = validations.filter(v => v.isValid).length;
  const totalCount = validations.length;
  const progress = (validCount / totalCount) * 100;

  // Só mostra o resumo se pelo menos um campo foi preenchido
  const hasAnyField = watchedFields.some(field => field && field !== "" && field !== false);
  
  if (!hasAnyField) return null;

  const getIcon = (isValid: boolean, hasField: boolean) => {
    if (isValid) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (hasField) return <XCircle className="h-4 w-4 text-red-500" />;
    return <Circle className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">Progresso do Formulário</h4>
        <span className="text-sm text-gray-600">{validCount}/{totalCount}</span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {validations.map((validation, index) => (
          <div key={index} className="flex items-center space-x-2">
            {getIcon(validation.isValid, !!validation.field)}
            <span className={`text-xs ${
              validation.isValid ? "text-green-700" : 
              validation.field ? "text-red-600" : "text-gray-500"
            }`}>
              {validation.label}
            </span>
          </div>
        ))}
      </div>
      
      {progress === 100 && (
        <div className="text-center py-2">
          <span className="text-sm text-green-600 font-medium">
            ✓ Formulário pronto para envio!
          </span>
        </div>
      )}
    </div>
  );
}
