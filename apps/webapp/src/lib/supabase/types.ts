export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          display_name: string | null;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name?: string | null;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          display_name?: string | null;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_stats: {
        Row: {
          user_id: string;
          xp: number;
          streak: number;
          last_activity_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          xp?: number;
          streak?: number;
          last_activity_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          xp?: number;
          streak?: number;
          last_activity_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      learning_exercises: {
        Row: {
          id: string;
          category_id: string;
          exercise_type: string;
          xp_reward: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          category_id: string;
          exercise_type: string;
          xp_reward?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          exercise_type?: string;
          xp_reward?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      learning_progress: {
        Row: {
          user_id: string;
          exercise_id: string;
          category_id: string;
          exercise_type: string;
          completed_at: string;
          xp_earned: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          exercise_id: string;
          category_id: string;
          exercise_type: string;
          completed_at?: string;
          xp_earned?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          exercise_id?: string;
          category_id?: string;
          exercise_type?: string;
          completed_at?: string;
          xp_earned?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      exercise_attempts: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          category_id: string;
          exercise_type: string;
          correct: boolean;
          xp_earned: number;
          answer: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          category_id: string;
          exercise_type: string;
          correct?: boolean;
          xp_earned?: number;
          answer?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exercise_id?: string;
          category_id?: string;
          exercise_type?: string;
          correct?: boolean;
          xp_earned?: number;
          answer?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      record_learning_attempt: {
        Args: {
          p_exercise_id: string;
          p_correct: boolean;
          p_answer?: Json | null;
        };
        Returns: Database["public"]["Tables"]["exercise_attempts"]["Row"];
      };
      complete_learning_exercises: {
        Args: {
          p_exercise_ids: string[];
        };
        Returns: Database["public"]["Tables"]["user_stats"]["Row"];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
