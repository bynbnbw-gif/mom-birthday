import { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { supabase, type GreetingCard as GreetingCardType } from '../lib/supabase';

export default function GreetingCard({ onContinue }: { onContinue: () => void }) {
  const [greeting, setGreeting] = useState<GreetingCardType | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    loadGreeting();
  }, []);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowMessage(true), 1000);
    const timer2 = setTimeout(() => setShowButton(true), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  async function loadGreeting() {
    const { data } = await supabase
      .from('greeting_card')
      .select('*')
      .maybeSingle();

    if (data) {
      setGreeting(data);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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

      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 relative z-10 transform transition-all duration-1000 animate-scale-in">
        <div className="text-center space-y-6">
          <div className="flex justify-center items-center gap-3 animate-bounce-slow">
            <Sparkles className="text-amber-400" size={32} fill="currentColor" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              {greeting?.title || 'יום הולדת שמח!'}
            </h1>
            <Sparkles className="text-amber-400" size={32} fill="currentColor" />
          </div>

          <div
            className={`transition-all duration-1000 transform ${
              showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
              {greeting?.main_message}
            </p>
          </div>

          <div className="pt-6">
            <div className="inline-flex items-center gap-2 text-pink-500">
              <Heart size={24} fill="currentColor" className="animate-pulse" />
              <Heart size={20} fill="currentColor" className="animate-pulse delay-100" />
              <Heart size={16} fill="currentColor" className="animate-pulse delay-200" />
            </div>
          </div>

          <button
            onClick={onContinue}
            className={`mt-8 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
              showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            המשך לאלבום הזיכרונות ←
          </button>
        </div>
      </div>
    </div>
  );
}
