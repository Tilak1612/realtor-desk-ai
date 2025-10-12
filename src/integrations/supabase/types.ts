export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_lead_scores: {
        Row: {
          calculated_at: string
          contact_id: string
          created_at: string
          factors: Json
          id: string
          insights: string | null
          optimal_contact_time: string | null
          prediction_confidence: number
          recommended_actions: string[]
          score: number
          updated_at: string
        }
        Insert: {
          calculated_at?: string
          contact_id: string
          created_at?: string
          factors?: Json
          id?: string
          insights?: string | null
          optimal_contact_time?: string | null
          prediction_confidence: number
          recommended_actions?: string[]
          score: number
          updated_at?: string
        }
        Update: {
          calculated_at?: string
          contact_id?: string
          created_at?: string
          factors?: Json
          id?: string
          insights?: string | null
          optimal_contact_time?: string | null
          prediction_confidence?: number
          recommended_actions?: string[]
          score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_lead_scores_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: true
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_settings: {
        Row: {
          availability: Json | null
          buffer_time: number | null
          created_at: string | null
          id: string
          meeting_types: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability?: Json | null
          buffer_time?: number | null
          created_at?: string | null
          id?: string
          meeting_types?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability?: Json | null
          buffer_time?: number | null
          created_at?: string | null
          id?: string
          meeting_types?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_settings: {
        Row: {
          bot_name: string
          created_at: string | null
          greeting_message: string | null
          handoff_rules: string | null
          id: string
          is_active: boolean | null
          qualification_questions: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bot_name: string
          created_at?: string | null
          greeting_message?: string | null
          handoff_rules?: string | null
          id?: string
          is_active?: boolean | null
          qualification_questions?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bot_name?: string
          created_at?: string | null
          greeting_message?: string | null
          handoff_rules?: string | null
          id?: string
          is_active?: boolean | null
          qualification_questions?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          contact_id: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          contact_id: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          contact_id?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_documents: {
        Row: {
          contact_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_documents_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_notes: {
        Row: {
          contact_id: string
          content: string
          created_at: string
          id: string
          is_pinned: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_id: string
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_id?: string
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_notes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          ai_score: number | null
          best_contact_time: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_contact_date: string | null
          last_name: string | null
          metadata: Json | null
          phone: string | null
          source: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_score?: number | null
          best_contact_time?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_contact_date?: string | null
          last_name?: string | null
          metadata?: Json | null
          phone?: string | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_score?: number | null
          best_contact_time?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_contact_date?: string | null
          last_name?: string | null
          metadata?: Json | null
          phone?: string | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          contact_id: string | null
          created_at: string | null
          expected_close_date: string | null
          id: string
          metadata: Json | null
          notes: string | null
          probability: number | null
          stage: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
          value: number | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          expected_close_date?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          probability?: number | null
          stage?: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          value?: number | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          expected_close_date?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          probability?: number | null
          stage?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_requests: {
        Row: {
          biggest_challenge: string | null
          brokerage: string | null
          comments: string | null
          created_at: string | null
          current_crm: string | null
          email: string
          full_name: string
          id: string
          phone: string
          province: string
          status: string | null
          team_size: string | null
          updated_at: string | null
        }
        Insert: {
          biggest_challenge?: string | null
          brokerage?: string | null
          comments?: string | null
          created_at?: string | null
          current_crm?: string | null
          email: string
          full_name: string
          id?: string
          phone: string
          province: string
          status?: string | null
          team_size?: string | null
          updated_at?: string | null
        }
        Update: {
          biggest_challenge?: string | null
          brokerage?: string | null
          comments?: string | null
          created_at?: string | null
          current_crm?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string
          province?: string
          status?: string | null
          team_size?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      email_captures: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
          status?: string | null
        }
        Relationships: []
      }
      engagement_stats: {
        Row: {
          avg_session_duration: number | null
          contact_id: string
          created_at: string
          documents_viewed: number | null
          emails_clicked: number | null
          emails_opened: number | null
          emails_replied: number | null
          emails_sent: number | null
          id: string
          last_email_opened: string | null
          properties_viewed: number | null
          updated_at: string
          website_visits: number | null
        }
        Insert: {
          avg_session_duration?: number | null
          contact_id: string
          created_at?: string
          documents_viewed?: number | null
          emails_clicked?: number | null
          emails_opened?: number | null
          emails_replied?: number | null
          emails_sent?: number | null
          id?: string
          last_email_opened?: string | null
          properties_viewed?: number | null
          updated_at?: string
          website_visits?: number | null
        }
        Update: {
          avg_session_duration?: number | null
          contact_id?: string
          created_at?: string
          documents_viewed?: number | null
          emails_clicked?: number | null
          emails_opened?: number | null
          emails_replied?: number | null
          emails_sent?: number | null
          id?: string
          last_email_opened?: string | null
          properties_viewed?: number | null
          updated_at?: string
          website_visits?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_stats_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: true
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          provider: string
          provider_type: string
          refresh_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          provider: string
          provider_type: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          provider?: string
          provider_type?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_preferences: Json | null
          city: string | null
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          license_number: string | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          phone: string | null
          primary_language: string | null
          province: string | null
          role: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          business_preferences?: Json | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          license_number?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          phone?: string | null
          primary_language?: string | null
          province?: string | null
          role?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          business_preferences?: Json | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          license_number?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          phone?: string | null
          primary_language?: string | null
          province?: string | null
          role?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      property_interests: {
        Row: {
          address: string
          contact_id: string
          created_at: string
          id: string
          image_url: string | null
          interest_level: string | null
          notes: string | null
          price: number | null
          property_type: string | null
          updated_at: string
          user_id: string
          viewed_date: string | null
        }
        Insert: {
          address: string
          contact_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          interest_level?: string | null
          notes?: string | null
          price?: number | null
          property_type?: string | null
          updated_at?: string
          user_id: string
          viewed_date?: string | null
        }
        Update: {
          address?: string
          contact_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          interest_level?: string | null
          notes?: string | null
          price?: number | null
          property_type?: string | null
          updated_at?: string
          user_id?: string
          viewed_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_interests_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          contact_id: string | null
          created_at: string | null
          deal_id: string | null
          description: string | null
          due_date: string | null
          due_time: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics: {
        Row: {
          active_deals_count: number | null
          annual_goal: number | null
          id: string
          leads_change_percent: number | null
          monthly_leads: number | null
          pipeline_value: number | null
          updated_at: string | null
          user_id: string
          ytd_revenue: number | null
        }
        Insert: {
          active_deals_count?: number | null
          annual_goal?: number | null
          id?: string
          leads_change_percent?: number | null
          monthly_leads?: number | null
          pipeline_value?: number | null
          updated_at?: string | null
          user_id: string
          ytd_revenue?: number | null
        }
        Update: {
          active_deals_count?: number | null
          annual_goal?: number | null
          id?: string
          leads_change_percent?: number | null
          monthly_leads?: number | null
          pipeline_value?: number | null
          updated_at?: string | null
          user_id?: string
          ytd_revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type:
        | "email_sent"
        | "email_received"
        | "call_made"
        | "call_received"
        | "sms_sent"
        | "sms_received"
        | "meeting_held"
        | "note_added"
        | "status_changed"
        | "tag_added"
        | "tag_removed"
        | "property_viewed"
        | "deal_created"
        | "deal_updated"
      subscription_status: "trial" | "active" | "cancelled" | "expired"
      subscription_tier: "agent" | "team" | "brokerage"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: [
        "email_sent",
        "email_received",
        "call_made",
        "call_received",
        "sms_sent",
        "sms_received",
        "meeting_held",
        "note_added",
        "status_changed",
        "tag_added",
        "tag_removed",
        "property_viewed",
        "deal_created",
        "deal_updated",
      ],
      subscription_status: ["trial", "active", "cancelled", "expired"],
      subscription_tier: ["agent", "team", "brokerage"],
    },
  },
} as const
