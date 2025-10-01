import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Photo = {
  id: string;
  url: string;
  caption: string;
  uploaded_by: string;
  display_order: number;
  created_at: string;
};

export type Message = {
  id: string;
  author_name: string;
  message_text: string;
  is_approved: boolean;
  created_at: string;
};

export type GreetingCard = {
  id: string;
  title: string;
  main_message: string;
  created_at: string;
  updated_at: string;
};
