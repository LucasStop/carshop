import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-4 w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
