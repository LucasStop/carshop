"use client";

import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    const checks = {
      length: password.length >= 6,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // Pontuação baseada nos critérios
    if (checks.length) score += 20;
    if (checks.lowercase) score += 20;
    if (checks.uppercase) score += 20;
    if (checks.number) score += 20;
    if (checks.special) score += 20;

    // Bônus por comprimento
    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 10;

    // Determinar label e cor
    let label = "";
    let color = "";

    if (score < 40) {
      label = "Muito fraca";
      color = "bg-red-500";
    } else if (score < 60) {
      label = "Fraca";
      color = "bg-orange-500";
    } else if (score < 80) {
      label = "Média";
      color = "bg-yellow-500";
    } else if (score < 100) {
      label = "Forte";
      color = "bg-blue-500";
    } else {
      label = "Muito forte";
      color = "bg-green-500";
    }

    return { score: Math.min(score, 100), label, color, checks };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">Força da senha:</span>
        <span className={`text-xs font-medium ${
          strength.score < 40 ? "text-red-600" :
          strength.score < 60 ? "text-orange-600" :
          strength.score < 80 ? "text-yellow-600" :
          strength.score < 100 ? "text-blue-600" : "text-green-600"
        }`}>
          {strength.label}
        </span>
      </div>
      
      <Progress value={strength.score} className="h-2" />
      
      <div className="grid grid-cols-2 gap-1 text-xs">
        <div className={`flex items-center space-x-1 ${
          strength.checks?.length ? "text-green-600" : "text-gray-400"
        }`}>
          <span>{strength.checks?.length ? "✓" : "○"}</span>
          <span>6+ caracteres</span>
        </div>
        
        <div className={`flex items-center space-x-1 ${
          strength.checks?.lowercase ? "text-green-600" : "text-gray-400"
        }`}>
          <span>{strength.checks?.lowercase ? "✓" : "○"}</span>
          <span>Letra minúscula</span>
        </div>
        
        <div className={`flex items-center space-x-1 ${
          strength.checks?.uppercase ? "text-green-600" : "text-gray-400"
        }`}>
          <span>{strength.checks?.uppercase ? "✓" : "○"}</span>
          <span>Letra maiúscula</span>
        </div>
        
        <div className={`flex items-center space-x-1 ${
          strength.checks?.number ? "text-green-600" : "text-gray-400"
        }`}>
          <span>{strength.checks?.number ? "✓" : "○"}</span>
          <span>Número</span>
        </div>
      </div>
    </div>
  );
}
