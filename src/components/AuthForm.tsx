import { useState } from 'react';
import { Heart, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('אימייל או סיסמה שגויים');
      } else if (error.message.includes('already registered')) {
        setError('משתמש זה כבר רשום במערכת');
      } else {
        setError(error.message);
      }
    } else if (!isLogin) {
      setError('');
      alert('נרשמת בהצלחה! כעת אפשר להתחבר');
      setIsLogin(true);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <Heart
              className="text-pink-300 opacity-20"
              size={20 + Math.random() * 30}
              fill="currentColor"
            />
          </div>
        ))}
      </div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Heart className="text-pink-500" size={32} fill="currentColor" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              אלבום הזיכרונות
            </h1>
          </div>
          <p className="text-gray-600">
            {isLogin ? 'התחבר כדי להוסיף תמונות והקדשות' : 'הירשם כדי להצטרף לחגיגה'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline ml-2" size={16} />
              אימייל
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline ml-2" size={16} />
              סיסמה
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              dir="ltr"
            />
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">
                לפחות 6 תווים
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'רגע...' : isLogin ? 'התחבר' : 'הירשם'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            {isLogin ? 'עדיין אין לך חשבון? הירשם כאן' : 'כבר יש לך חשבון? התחבר'}
          </button>
        </div>
      </div>
    </div>
  );
}
