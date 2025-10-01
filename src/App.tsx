import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthForm from './components/AuthForm';
import GreetingCard from './components/GreetingCard';
import PhotoGallery from './components/PhotoGallery';
import MessagesBoard from './components/MessagesBoard';
import { Heart, LogOut } from 'lucide-react';

type View = 'greeting' | 'main';

function App() {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('greeting');
  const [activeTab, setActiveTab] = useState<'photos' | 'messages'>('photos');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="text-pink-500 animate-pulse mx-auto mb-4" size={48} fill="currentColor" />
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  if (currentView === 'greeting') {
    return <GreetingCard onContinue={() => setCurrentView('main')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 justify-center">
              <Heart className="text-pink-500" size={32} fill="currentColor" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                אלבום הזיכרונות של אמא
              </h1>
              <Heart className="text-pink-500" size={32} fill="currentColor" />
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="התנתק"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 bg-white/80 backdrop-blur-md rounded-xl p-2 shadow-lg">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'photos'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            גלריית תמונות
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'messages'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            הקדשות ומסרים
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {activeTab === 'photos' ? <PhotoGallery /> : <MessagesBoard />}
      </main>

      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-gray-600">
            נוצר באהבה ליום ההולדת המיוחד שלך ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
