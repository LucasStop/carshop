import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-6xl w-full mx-4">
        <RegisterForm />
      </div>
    </main>
  );
}
