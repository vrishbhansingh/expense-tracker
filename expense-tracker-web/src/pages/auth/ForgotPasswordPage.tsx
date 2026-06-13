import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-purple-50 px-4 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <div className="w-full max-w-md">
        <Link to="/login" className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
        {sent ? (
          <div className="card text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold">Check your email</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">We've sent a password reset link to {email}</p>
            <Link to="/login" className="btn-primary mt-6 w-full">Back to sign in</Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Forgot password?</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Enter your email and we'll send you a reset link</p>
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="card mt-8 space-y-4">
              <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="h-4 w-4" />} />
              <Button type="submit" className="w-full">Send reset link</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
