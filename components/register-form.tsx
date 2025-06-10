"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Car, Eye, EyeOff } from "lucide-react";
import { IMaskInput } from "react-imask";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordStrength } from "@/components/password-strength";
import { FormValidationSummary } from "@/components/form-validation-summary";
import {
  ValidationIndicator,
  useValidationStatus,
  validators,
  getValidationMessage,
} from "@/components/validation-indicator";
import { AuthService, ApiError, UtilsService } from "@/services";

// Schema de validação simplificado com Yup
const registerSchema = yup.object({
  role_id: yup.number().default(1),

  name: yup
    .string()
    .required()
    .min(2)
    .max(100)
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .test("full-name", (value) => {
      if (!value) return false;
      const names = value.trim().split(" ");
      return names.length >= 2 && names.every((name) => name.length >= 2);
    }),

  email: yup.string().required().email().max(255).lowercase(),

  password: yup
    .string()
    .required()
    .min(6)
    .max(128)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),

  password_confirmation: yup
    .string()
    .required()
    .oneOf([yup.ref("password")]),

  phone: yup
    .string()
    .required()
    .min(10)
    .max(15)
    .test("phone-format", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 11;
    }),

  cpf: yup
    .string()
    .required()
    .test("cpf-length", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 11;
    })
    .test("cpf-valid", (value) => {
      if (!value) return false;

      // Verificar se o serviço de validação existe
      if (typeof UtilsService?.validateCPF === "function") {
        return UtilsService.validateCPF(value);
      }

      // Validação básica alternativa se o serviço não existir
      const digits = value.replace(/\D/g, "");
      return digits.length === 11 && !/^(.)\1+$/.test(digits);
    }),

  rg: yup
    .string()
    .required()
    .min(7)
    .max(20)
    .matches(/^[0-9X.-]+$/i),

  birth_date: yup
    .string()
    .required()
    .test("valid-date", (value) => {
      if (!value) return false;
      const birthDate = new Date(value);
      const today = new Date();

      // Verificar se a data é válida
      if (isNaN(birthDate.getTime())) return false;

      // Calcular idade
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age >= 18 && age <= 120;
    }),

  address: yup.object({
    address: yup.string().required().min(5).max(255),

    number: yup.string().required().max(10),

    complement: yup.string().max(100).optional(),

    city: yup
      .string()
      .required()
      .min(2)
      .max(100)
      .matches(/^[a-zA-ZÀ-ÿ\s.-]+$/),

    state: yup
      .string()
      .required()
      .length(2)
      .uppercase()
      .matches(/^[A-Z]{2}$/),

    zip_code: yup
      .string()
      .required()
      .test("cep-format", (value) => {
        if (!value) return false;
        const digits = value.replace(/\D/g, "");
        return digits.length === 8;
      }),
  }),

  agreeToTerms: yup.boolean().required().oneOf([true]),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [error, setError] = useState<string>("");
  const form = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      role_id: 1,
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone: "",
      cpf: "",
      rg: "",
      birth_date: "",
      address: {
        address: "",
        number: "",
        complement: "",
        city: "",
        state: "",
        zip_code: "",
      },
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const { agreeToTerms, ...submitData } = data;

      console.log("Register data:", submitData);

      const result = await AuthService.register(submitData);
      console.log("Registro bem-sucedido:", result);

      window.location.href = "/login";
    } catch (error) {
      console.error("Erro no registro:", error);
      const apiError = error as ApiError;
      setError(apiError.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const addressData = await UtilsService.getAddressByCep(cleanCep);
        if (addressData) {
          form.setValue("address.address", addressData.address);
          form.setValue("address.city", addressData.city);
          form.setValue("address.state", addressData.state);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Car className="h-12 w-12 text-black" />
        </div>
        <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
        <CardDescription>
          Junte-se à LuxuryCars e encontre o carro dos seus sonhos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {" "}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}{" "}
            {/* Resumo de Validação */}
            {/* <FormValidationSummary control={form.control} /> */}
            {/* Layout de duas colunas para Dados Pessoais e Endereço */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Coluna 1: Dados Pessoais */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dados Pessoais
                  </h3>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>{" "}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Digite seu nome completo"
                            {...field}
                          />
                          {field.value && field.value.length > 0 && (
                            <ValidationIndicator
                              status={useValidationStatus(
                                field.value,
                                validators.fullName,
                                2
                              )}
                            />
                          )}
                        </div>
                      </FormControl>
                      {field.value && field.value.length > 0 && (
                        <p
                          className={`text-xs mt-1 ${
                            useValidationStatus(
                              field.value,
                              validators.fullName,
                              2
                            ) === "valid"
                              ? "text-green-600"
                              : useValidationStatus(
                                  field.value,
                                  validators.fullName,
                                  2
                                ) === "pending"
                              ? "text-gray-500"
                              : "text-red-600"
                          }`}
                        >
                          {getValidationMessage(
                            "fullName",
                            field.value,
                            useValidationStatus(
                              field.value,
                              validators.fullName,
                              2
                            )
                          )}
                        </p>
                      )}
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="seu.email@exemplo.com"
                            type="email"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value.toLowerCase());
                            }}
                          />
                          {field.value &&
                            field.value.length > 0 &&
                            (field.value.includes("@") ? (
                              <ValidationIndicator
                                status={useValidationStatus(
                                  field.value,
                                  validators.email,
                                  3
                                )}
                              />
                            ) : (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <span className="text-orange-500 text-sm">
                                  @
                                </span>
                              </div>
                            ))}
                        </div>
                      </FormControl>
                      {field.value && field.value.length > 0 && (
                        <p
                          className={`text-xs mt-1 ${
                            useValidationStatus(
                              field.value,
                              validators.email,
                              3
                            ) === "valid"
                              ? "text-green-600"
                              : useValidationStatus(
                                  field.value,
                                  validators.email,
                                  3
                                ) === "pending"
                              ? "text-gray-500"
                              : !field.value.includes("@")
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                        >
                          {getValidationMessage(
                            "email",
                            field.value,
                            useValidationStatus(
                              field.value,
                              validators.email,
                              3
                            )
                          )}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {" "}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Controller
                              name="phone"
                              control={form.control}
                              render={({
                                field: { onChange, onBlur, value, ref },
                              }) => (
                                <IMaskInput
                                  mask="(00) 00000-0000"
                                  value={value || ""}
                                  onAccept={(currentValue) => {
                                    onChange(currentValue);
                                  }}
                                  onBlur={onBlur}
                                  inputRef={ref}
                                  placeholder="(11) 99999-9999"
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                />
                              )}
                            />
                            {field.value && field.value.length > 0 && (
                              <ValidationIndicator
                                status={useValidationStatus(
                                  field.value,
                                  validators.phone,
                                  8
                                )}
                              />
                            )}
                          </div>
                        </FormControl>
                        {field.value && field.value.length > 0 && (
                          <p
                            className={`text-xs mt-1 ${
                              useValidationStatus(
                                field.value,
                                validators.phone,
                                8
                              ) === "valid"
                                ? "text-green-600"
                                : useValidationStatus(
                                    field.value,
                                    validators.phone,
                                    8
                                  ) === "pending"
                                ? "text-gray-500"
                                : "text-red-600"
                            }`}
                          >
                            {getValidationMessage(
                              "phone",
                              field.value,
                              useValidationStatus(
                                field.value,
                                validators.phone,
                                8
                              )
                            )}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />{" "}
                  <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="date" {...field} />
                            {field.value && (
                              <ValidationIndicator
                                status={useValidationStatus(
                                  field.value,
                                  validators.birthDate
                                )}
                              />
                            )}
                          </div>
                        </FormControl>
                        {field.value &&
                          (() => {
                            const birthDate = new Date(field.value);
                            const today = new Date();
                            let age =
                              today.getFullYear() - birthDate.getFullYear();
                            const monthDiff =
                              today.getMonth() - birthDate.getMonth();

                            if (
                              monthDiff < 0 ||
                              (monthDiff === 0 &&
                                today.getDate() < birthDate.getDate())
                            ) {
                              age--;
                            }

                            const status = useValidationStatus(
                              field.value,
                              validators.birthDate
                            );
                            return (
                              <p
                                className={`text-xs mt-1 ${
                                  status === "valid"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {getValidationMessage(
                                  "birthDate",
                                  field.value,
                                  status,
                                  { age }
                                )}
                              </p>
                            );
                          })()}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {" "}
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Controller
                              name="cpf"
                              control={form.control}
                              render={({
                                field: { onChange, onBlur, value, ref },
                              }) => (
                                <IMaskInput
                                  mask="000.000.000-00"
                                  value={value || ""}
                                  onAccept={(currentValue) => {
                                    onChange(currentValue);
                                  }}
                                  onBlur={onBlur}
                                  inputRef={ref}
                                  placeholder="000.000.000-00"
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                />
                              )}
                            />
                            {field.value && field.value.length > 0 && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {(() => {
                                  const digits = field.value.replace(/\D/g, "");
                                  if (digits.length < 11) {
                                    return (
                                      <span className="text-gray-400 text-sm">
                                        ○
                                      </span>
                                    );
                                  }
                                  return UtilsService.validateCPF(
                                    field.value
                                  ) ? (
                                    <span className="text-green-600 text-sm">
                                      ✓
                                    </span>
                                  ) : (
                                    <span className="text-red-600 text-sm">
                                      ✗
                                    </span>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        {field.value &&
                          field.value.length > 0 &&
                          (() => {
                            const digits = field.value.replace(/\D/g, "");
                            if (digits.length < 11) {
                              return (
                                <p className="text-xs text-gray-500 mt-1">
                                  Digite os 11 dígitos do CPF
                                </p>
                              );
                            } else if (UtilsService.validateCPF(field.value)) {
                              return (
                                <p className="text-xs text-green-600 mt-1">
                                  CPF válido
                                </p>
                              );
                            } else {
                              return (
                                <p className="text-xs text-red-600 mt-1">
                                  CPF inválido
                                </p>
                              );
                            }
                          })()}
                      </FormItem>
                    )}
                  />{" "}
                  <FormField
                    control={form.control}
                    name="rg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RG *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Controller
                              name="rg"
                              control={form.control}
                              render={({
                                field: { onChange, onBlur, value, ref },
                              }) => (
                                <IMaskInput
                                  mask="00.000.000-a"
                                  definitions={{
                                    a: /[0-9X]/,
                                  }}
                                  value={value || ""}
                                  onAccept={(currentValue) => {
                                    onChange(currentValue);
                                  }}
                                  onBlur={onBlur}
                                  inputRef={ref}
                                  placeholder="00.000.000-0"
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                />
                              )}
                            />
                            {field.value && field.value.length > 0 && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {field.value.length >= 7 &&
                                /^[0-9X.-]+$/i.test(field.value) ? (
                                  <span className="text-green-600 text-sm">
                                    ✓
                                  </span>
                                ) : field.value.length < 7 ? (
                                  <span className="text-gray-400 text-sm">
                                    ○
                                  </span>
                                ) : (
                                  <span className="text-red-600 text-sm">
                                    ✗
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        {field.value &&
                          field.value.length > 0 &&
                          (() => {
                            if (field.value.length < 7) {
                              return (
                                <p className="text-xs text-gray-500 mt-1">
                                  RG deve ter pelo menos 7 caracteres
                                </p>
                              );
                            } else if (!/^[0-9X.-]+$/i.test(field.value)) {
                              return (
                                <p className="text-xs text-red-600 mt-1">
                                  Use apenas números, pontos, hífens e X
                                </p>
                              );
                            } else {
                              return (
                                <p className="text-xs text-green-600 mt-1">
                                  RG válido
                                </p>
                              );
                            }
                          })()}
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Coluna 2: Endereço */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Endereço
                  </h3>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>{" "}
                <FormField
                  control={form.control}
                  name="address.zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Controller
                            name="address.zip_code"
                            control={form.control}
                            render={({
                              field: { onChange, onBlur, value, ref },
                            }) => (
                              <IMaskInput
                                mask="00000-000"
                                value={value || ""}
                                onAccept={(currentValue) => {
                                  onChange(currentValue);
                                  handleCepChange(currentValue);
                                }}
                                onBlur={onBlur}
                                inputRef={ref}
                                placeholder="00000-000"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              />
                            )}
                          />
                          {isLoadingCep ? (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                            </div>
                          ) : (
                            field.value &&
                            field.value.length === 9 && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {(() => {
                                  const digits = field.value.replace(/\D/g, "");
                                  return digits.length === 8 ? (
                                    <span className="text-green-600 text-sm">
                                      ✓
                                    </span>
                                  ) : (
                                    <span className="text-red-600 text-sm">
                                      ✗
                                    </span>
                                  );
                                })()}
                              </div>
                            )
                          )}
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        O endereço será preenchido automaticamente
                      </p>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logradouro *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome da rua, avenida, etc."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address.number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número *</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="UF"
                            maxLength={2}
                            {...field}
                            style={{ textTransform: "uppercase" }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da cidade" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.complement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Apartamento, bloco, casa, etc. (opcional)"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            {/* Seção de Segurança - Separada embaixo */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Segurança
                </h3>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {" "}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Digite sua senha"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <div className="mt-2">
                        <PasswordStrength password={field.value || ""} />
                      </div>
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar senha *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Confirme sua senha"
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          {field.value && field.value.length > 0 && (
                            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                              {(() => {
                                const password = form.getValues("password");
                                return field.value === password ? (
                                  <span className="text-green-600 text-sm">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="text-red-600 text-sm">
                                    ✗
                                  </span>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      {field.value &&
                        (() => {
                          const password = form.getValues("password");
                          if (
                            field.value !== password &&
                            field.value.length > 0
                          ) {
                            return (
                              <p className="text-xs text-red-600 mt-1">
                                As senhas não coincidem
                              </p>
                            );
                          } else if (
                            field.value === password &&
                            field.value.length > 0
                          ) {
                            return (
                              <p className="text-xs text-green-600 mt-1">
                                Senhas coincidem
                              </p>
                            );
                          }
                          return null;
                        })()}
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Termos e Botão de Submit */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        Aceito os{" "}
                        <Link
                          href="/termos"
                          className="text-black hover:underline font-medium"
                        >
                          termos e condições
                        </Link>{" "}
                        e a{" "}
                        <Link
                          href="/privacidade"
                          className="text-black hover:underline font-medium"
                        >
                          política de privacidade
                        </Link>
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Criando conta...</span>
                  </div>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-6">
          <Separator className="my-4" />

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="font-medium text-black hover:underline"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
