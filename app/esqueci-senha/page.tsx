import { ForgotPasswordForm } from '@/components/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-4 w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
