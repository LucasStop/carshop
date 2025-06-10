import { RegisterForm } from '@/components/register-form';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 py-8">
      <div className="mx-4 w-full max-w-6xl">
        <RegisterForm />
      </div>
    </main>
  );
}
