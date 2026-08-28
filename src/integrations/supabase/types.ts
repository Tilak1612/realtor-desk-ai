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
    PostgrestVersion: "14.17"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      adoption_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
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
          prediction_confidence?: number
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
      apify_usage: {
        Row: {
          actor_id: string
          created_at: string
          id: string
          import_history_id: string | null
          records_fetched: number
          request_date: string
          user_id: string
        }
        Insert: {
          actor_id: string
          created_at?: string
          id?: string
          import_history_id?: string | null
          records_fetched?: number
          request_date?: string
          user_id: string
        }
        Update: {
          actor_id?: string
          created_at?: string
          id?: string
          import_history_id?: string | null
          records_fetched?: number
          request_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "apify_usage_import_history_id_fkey"
            columns: ["import_history_id"]
            isOneToOne: false
            referencedRelation: "import_history"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_steps: {
        Row: {
          action_config: Json
          action_type: string
          automation_id: string
          created_at: string
          delay_days: number
          id: string
          step_order: number
        }
        Insert: {
          action_config?: Json
          action_type: string
          automation_id: string
          created_at?: string
          delay_days?: number
          id?: string
          step_order: number
        }
        Update: {
          action_config?: Json
          action_type?: string
          automation_id?: string
          created_at?: string
          delay_days?: number
          id?: string
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "automation_steps_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "email_automations"
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
          bot_name?: string
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
          activity_date: string
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
          activity_date?: string
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
          activity_date?: string
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
          description: string | null
          duration: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          title: string | null
          variant: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          title?: string | null
          variant?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          title?: string | null
          variant?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          ai_score: number | null
          best_contact_time: string | null
          casl_consent: boolean | null
          consent_date: string | null
          consent_given: boolean | null
          consent_source: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_contact_date: string | null
          last_name: string | null
          metadata: Json | null
          next_followup_date: string | null
          notes: string | null
          phone: string | null
          preferred_language: string | null
          source: string | null
          stage: string | null
          tags: string[] | null
          unsubscribe_date: string | null
          unsubscribed: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_score?: number | null
          best_contact_time?: string | null
          casl_consent?: boolean | null
          consent_date?: string | null
          consent_given?: boolean | null
          consent_source?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_contact_date?: string | null
          last_name?: string | null
          metadata?: Json | null
          next_followup_date?: string | null
          notes?: string | null
          phone?: string | null
          preferred_language?: string | null
          source?: string | null
          stage?: string | null
          tags?: string[] | null
          unsubscribe_date?: string | null
          unsubscribed?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_score?: number | null
          best_contact_time?: string | null
          casl_consent?: boolean | null
          consent_date?: string | null
          consent_given?: boolean | null
          consent_source?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_contact_date?: string | null
          last_name?: string | null
          metadata?: Json | null
          next_followup_date?: string | null
          notes?: string | null
          phone?: string | null
          preferred_language?: string | null
          source?: string | null
          stage?: string | null
          tags?: string[] | null
          unsubscribe_date?: string | null
          unsubscribed?: boolean | null
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
      ddf_properties: {
        Row: {
          bathrooms: number | null
          bedrooms: number | null
          board: string | null
          city: string | null
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          listed_at: string | null
          listing_agent_name: string | null
          listing_agent_phone: string | null
          listing_brokerage: string | null
          listing_type: string | null
          longitude: number | null
          lot_size_sqft: number | null
          mls_number: string
          photo_urls: string[] | null
          postal_code: string | null
          price: number | null
          property_type: string | null
          province: string | null
          raw_payload: Json | null
          source: string
          square_feet: number | null
          status: string | null
          street_address: string | null
          synced_at: string
          updated_at: string
          virtual_tour_url: string | null
          year_built: number | null
        }
        Insert: {
          bathrooms?: number | null
          bedrooms?: number | null
          board?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          listed_at?: string | null
          listing_agent_name?: string | null
          listing_agent_phone?: string | null
          listing_brokerage?: string | null
          listing_type?: string | null
          longitude?: number | null
          lot_size_sqft?: number | null
          mls_number: string
          photo_urls?: string[] | null
          postal_code?: string | null
          price?: number | null
          property_type?: string | null
          province?: string | null
          raw_payload?: Json | null
          source?: string
          square_feet?: number | null
          status?: string | null
          street_address?: string | null
          synced_at?: string
          updated_at?: string
          virtual_tour_url?: string | null
          year_built?: number | null
        }
        Update: {
          bathrooms?: number | null
          bedrooms?: number | null
          board?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          listed_at?: string | null
          listing_agent_name?: string | null
          listing_agent_phone?: string | null
          listing_brokerage?: string | null
          listing_type?: string | null
          longitude?: number | null
          lot_size_sqft?: number | null
          mls_number?: string
          photo_urls?: string[] | null
          postal_code?: string | null
          price?: number | null
          property_type?: string | null
          province?: string | null
          raw_payload?: Json | null
          source?: string
          square_feet?: number | null
          status?: string | null
          street_address?: string | null
          synced_at?: string
          updated_at?: string
          virtual_tour_url?: string | null
          year_built?: number | null
        }
        Relationships: []
      }
      ddf_sync_log: {
        Row: {
          completed_at: string | null
          error_details: Json | null
          id: string
          listings_errors: number | null
          listings_fetched: number | null
          listings_upserted: number | null
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          error_details?: Json | null
          id?: string
          listings_errors?: number | null
          listings_fetched?: number | null
          listings_upserted?: number | null
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          error_details?: Json | null
          id?: string
          listings_errors?: number | null
          listings_fetched?: number | null
          listings_upserted?: number | null
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          closing_date: string | null
          commission_percentage: number | null
          contact_id: string | null
          created_at: string | null
          expected_close_date: string | null
          id: string
          listing_price: number | null
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
          closing_date?: string | null
          commission_percentage?: number | null
          contact_id?: string | null
          created_at?: string | null
          expected_close_date?: string | null
          id?: string
          listing_price?: number | null
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
          closing_date?: string | null
          commission_percentage?: number | null
          contact_id?: string | null
          created_at?: string | null
          expected_close_date?: string | null
          id?: string
          listing_price?: number | null
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
          created_at: string
          current_crm: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          province: string | null
          status: string
          team_size: string | null
        }
        Insert: {
          biggest_challenge?: string | null
          brokerage?: string | null
          comments?: string | null
          created_at?: string
          current_crm?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          province?: string | null
          status?: string
          team_size?: string | null
        }
        Update: {
          biggest_challenge?: string | null
          brokerage?: string | null
          comments?: string | null
          created_at?: string
          current_crm?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          province?: string | null
          status?: string
          team_size?: string | null
        }
        Relationships: []
      }
      email_automations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          trigger_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          trigger_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          trigger_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_captures: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string
          status?: string
        }
        Relationships: []
      }
      email_events: {
        Row: {
          event_type: string
          id: string
          metadata: Json | null
          recipient_email: string
          sent_at: string
          user_id: string
        }
        Insert: {
          event_type: string
          id?: string
          metadata?: Json | null
          recipient_email: string
          sent_at?: string
          user_id: string
        }
        Update: {
          event_type?: string
          id?: string
          metadata?: Json | null
          recipient_email?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_log: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          sent_at: string
          status: string
          type: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          sent_at?: string
          status?: string
          type: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          sent_at?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      email_suppressions: {
        Row: {
          contact_id: string | null
          created_at: string
          email: string
          source: string
          user_id: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          email: string
          source: string
          user_id?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          email?: string
          source?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_suppressions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
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
      import_history: {
        Row: {
          created_at: string
          duplicate_records: number | null
          error_message: string | null
          failed_records: number | null
          id: string
          import_type: string
          parser_version: string | null
          raw_payload: Json | null
          saved_records: number | null
          source_url: string
          status: string
          total_records: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duplicate_records?: number | null
          error_message?: string | null
          failed_records?: number | null
          id?: string
          import_type: string
          parser_version?: string | null
          raw_payload?: Json | null
          saved_records?: number | null
          source_url: string
          status?: string
          total_records?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duplicate_records?: number | null
          error_message?: string | null
          failed_records?: number | null
          id?: string
          import_type?: string
          parser_version?: string | null
          raw_payload?: Json | null
          saved_records?: number | null
          source_url?: string
          status?: string
          total_records?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      integration_connections: {
        Row: {
          connected_account_label: string | null
          connection_method: string | null
          created_at: string
          credentials_encrypted: string | null
          id: string
          last_reauth_email_sent_at: string | null
          last_sync_at: string | null
          last_sync_error: string | null
          last_sync_status: string | null
          status: string
          sync_config: Json | null
          sync_count_total: number | null
          sync_direction: string | null
          tool_slug: string
          updated_at: string
          user_id: string
          webhook_token: string | null
        }
        Insert: {
          connected_account_label?: string | null
          connection_method?: string | null
          created_at?: string
          credentials_encrypted?: string | null
          id?: string
          last_reauth_email_sent_at?: string | null
          last_sync_at?: string | null
          last_sync_error?: string | null
          last_sync_status?: string | null
          status?: string
          sync_config?: Json | null
          sync_count_total?: number | null
          sync_direction?: string | null
          tool_slug: string
          updated_at?: string
          user_id: string
          webhook_token?: string | null
        }
        Update: {
          connected_account_label?: string | null
          connection_method?: string | null
          created_at?: string
          credentials_encrypted?: string | null
          id?: string
          last_reauth_email_sent_at?: string | null
          last_sync_at?: string | null
          last_sync_error?: string | null
          last_sync_status?: string | null
          status?: string
          sync_config?: Json | null
          sync_count_total?: number | null
          sync_direction?: string | null
          tool_slug?: string
          updated_at?: string
          user_id?: string
          webhook_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_interest: {
        Row: {
          created_at: string
          id: string
          tool_slug: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tool_slug: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tool_slug?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_interest_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_requests: {
        Row: {
          created_at: string
          id: string
          tool_name: string
          use_case: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tool_name: string
          use_case?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tool_name?: string
          use_case?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      lead_magnet_requests: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      oauth_state_store: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          state: string
          tool_slug: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          state: string
          tool_slug: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          state?: string
          tool_slug?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_preferences: Json | null
          city: string | null
          company_name: string | null
          created_at: string | null
          email: string
          first_contact_added_at: string | null
          full_name: string
          id: string
          is_demo: boolean
          license_number: string | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          phone: string | null
          preferred_language: string
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
          first_contact_added_at?: string | null
          full_name: string
          id: string
          is_demo?: boolean
          license_number?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          phone?: string | null
          preferred_language?: string
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
          first_contact_added_at?: string | null
          full_name?: string
          id?: string
          is_demo?: boolean
          license_number?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          phone?: string | null
          preferred_language?: string
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
      property_listings: {
        Row: {
          address: string
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          country: string | null
          created_at: string
          currency: string | null
          data_source: string | null
          description: string | null
          features: Json | null
          id: string
          image_url: string | null
          images: Json | null
          listing_type: string | null
          lot_size: number | null
          metadata: Json | null
          mls_number: string | null
          photos_json: Json | null
          postal_code: string | null
          price: number | null
          property_type: string | null
          province: string | null
          raw_source_payload: Json | null
          realtor_ca_url: string | null
          source: string | null
          source_listing_id: string | null
          square_feet: number | null
          status: string | null
          street: string | null
          title: string
          updated_at: string
          user_id: string
          year_built: number | null
        }
        Insert: {
          address: string
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          data_source?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          images?: Json | null
          listing_type?: string | null
          lot_size?: number | null
          metadata?: Json | null
          mls_number?: string | null
          photos_json?: Json | null
          postal_code?: string | null
          price?: number | null
          property_type?: string | null
          province?: string | null
          raw_source_payload?: Json | null
          realtor_ca_url?: string | null
          source?: string | null
          source_listing_id?: string | null
          square_feet?: number | null
          status?: string | null
          street?: string | null
          title: string
          updated_at?: string
          user_id: string
          year_built?: number | null
        }
        Update: {
          address?: string
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          data_source?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          images?: Json | null
          listing_type?: string | null
          lot_size?: number | null
          metadata?: Json | null
          mls_number?: string | null
          photos_json?: Json | null
          postal_code?: string | null
          price?: number | null
          property_type?: string | null
          province?: string | null
          raw_source_payload?: Json | null
          realtor_ca_url?: string | null
          source?: string | null
          source_listing_id?: string | null
          square_feet?: number | null
          status?: string | null
          street?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          year_built?: number | null
        }
        Relationships: []
      }
      scheduled_emails: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          scheduled_for: string
          status: string
          type: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          scheduled_for: string
          status?: string
          type: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          scheduled_for?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      sms_consent: {
        Row: {
          consent_source: string | null
          consent_type: string
          contact_id: string
          created_at: string
          expires_at: string | null
          id: string
          opted_in: boolean
          opted_in_at: string | null
          opted_out_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consent_source?: string | null
          consent_type?: string
          contact_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          opted_in?: boolean
          opted_in_at?: string | null
          opted_out_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consent_source?: string | null
          consent_type?: string
          contact_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          opted_in?: boolean
          opted_in_at?: string | null
          opted_out_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_consent_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: true
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
      user_feedback: {
        Row: {
          comment: string | null
          created_at: string | null
          feedback_type: string | null
          id: string
          metadata: Json | null
          page_url: string | null
          user_id: string
          was_helpful: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          feedback_type?: string | null
          id?: string
          metadata?: Json | null
          page_url?: string | null
          user_id: string
          was_helpful?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          feedback_type?: string | null
          id?: string
          metadata?: Json | null
          page_url?: string | null
          user_id?: string
          was_helpful?: boolean | null
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          created_at: string
          dismissed_at: string | null
          step_calendar_connected_at: string | null
          step_first_contact_at: string | null
          step_first_property_at: string | null
          step_profile_at: string | null
          step_website_widget_ack_at: string | null
          updated_at: string
          user_id: string
          wizard_state: Json | null
        }
        Insert: {
          created_at?: string
          dismissed_at?: string | null
          step_calendar_connected_at?: string | null
          step_first_contact_at?: string | null
          step_first_property_at?: string | null
          step_profile_at?: string | null
          step_website_widget_ack_at?: string | null
          updated_at?: string
          user_id: string
          wizard_state?: Json | null
        }
        Update: {
          created_at?: string
          dismissed_at?: string | null
          step_calendar_connected_at?: string | null
          step_first_contact_at?: string | null
          step_first_property_at?: string | null
          step_profile_at?: string | null
          step_website_widget_ack_at?: string | null
          updated_at?: string
          user_id?: string
          wizard_state?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          connection_id: string | null
          id: string
          payload: Json | null
          received_at: string | null
          tool_slug: string
          user_id: string
        }
        Insert: {
          connection_id?: string | null
          id?: string
          payload?: Json | null
          received_at?: string | null
          tool_slug: string
          user_id: string
        }
        Update: {
          connection_id?: string | null
          id?: string
          payload?: Json | null
          received_at?: string | null
          tool_slug?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "integration_connections"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_apify_rate_limit: {
        Args: { checking_user_id: string; max_daily_imports?: number }
        Returns: boolean
      }
      check_concurrent_import: {
        Args: { checking_user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
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
      app_role: "admin" | "user"
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
  graphql_public: {
    Enums: {},
  },
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
      app_role: ["admin", "user"],
      subscription_status: ["trial", "active", "cancelled", "expired"],
      subscription_tier: ["agent", "team", "brokerage"],
    },
  },
} as const
