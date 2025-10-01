import { useEffect, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { supabase, type Message } from '../lib/supabase';

export default function MessagesBoard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    author_name: '',
    message_text: '',
  });

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (data) {
      setMessages(data);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.author_name.trim() || !formData.message_text.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from('messages').insert([
      {
        author_name: formData.author_name,
        message_text: formData.message_text,
        is_approved: true,
      },
    ]);

    if (!error) {
      setFormData({ author_name: '', message_text: '' });
      setShowMessageForm(false);
      loadMessages();
    }
    setSubmitting(false);
  }

  const messageColors = [
    'bg-gradient-to-br from-pink-100 to-rose-100 border-pink-200',
    'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-200',
    'bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-200',
    'bg-gradient-to-br from-amber-100 to-yellow-100 border-amber-200',
    'bg-gradient-to-br from-green-100 to-emerald-100 border-green-200',
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">הקדשות ומסרים</h2>
        <button
          onClick={() => setShowMessageForm(!showMessageForm)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <MessageCircle size={20} />
          הוסף הקדשה
        </button>
      </div>

      {showMessageForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                השם שלך *
              </label>
              <input
                type="text"
                required
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="שם מלא"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ההקדשה שלך *
              </label>
              <textarea
                required
                value={formData.message_text}
                onChange={(e) => setFormData({ ...formData, message_text: e.target.value })}
                placeholder="כתוב מסר חם ומיוחד..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                <Send size={20} />
                {submitting ? 'שולח...' : 'שלח הקדשה'}
              </button>
              <button
                type="button"
                onClick={() => setShowMessageForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <MessageCircle size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">עדיין אין הקדשות. היה הראשון לכתוב!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`${
                messageColors[index % messageColors.length]
              } rounded-xl shadow-lg p-6 border-2 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
            >
              <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap mb-4">
                {message.message_text}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 font-semibold">
                  — {message.author_name}
                </p>
                <p className="text-gray-400 text-sm">
                  {new Date(message.created_at).toLocaleDateString('he-IL')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
