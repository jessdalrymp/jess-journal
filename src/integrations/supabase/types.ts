export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          api_key: string
          created_at: string
          id: number
          service_name: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: never
          service_name: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: never
          service_name?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          summary: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          summary?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          summary?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number | null
          description: string | null
          discount_amount: number | null
          discount_percent: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_unlimited: boolean | null
          max_uses: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_unlimited?: boolean | null
          max_uses?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_unlimited?: boolean | null
          max_uses?: number | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          mood: string | null
          prompt: string
          topic: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          mood?: string | null
          prompt: string
          topic?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          mood?: string | null
          prompt?: string
          topic?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          id: string
          role: string
          timestamp: string
        }
        Insert: {
          content: string
          conversation_id: string
          id?: string
          role: string
          timestamp?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          id?: string
          role?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_plans: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          interval: string
          is_active: boolean | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          interval: string
          is_active?: boolean | null
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          interval?: string
          is_active?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          description: string | null
          id: string
          square_payment_id: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          square_payment_id?: string | null
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          square_payment_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          assessment_answers: Json | null
          assessment_completed: boolean | null
          assessment_data: Json | null
          booktext: boolean | null
          communication_style: string | null
          created_at: string
          email: string
          emotional_state: string | null
          goals: string[] | null
          growth_stage: string | null
          id: string
          last_session: string | null
          learning_style: string | null
          updated_at: string | null
        }
        Insert: {
          assessment_answers?: Json | null
          assessment_completed?: boolean | null
          assessment_data?: Json | null
          booktext?: boolean | null
          communication_style?: string | null
          created_at?: string
          email: string
          emotional_state?: string | null
          goals?: string[] | null
          growth_stage?: string | null
          id: string
          last_session?: string | null
          learning_style?: string | null
          updated_at?: string | null
        }
        Update: {
          assessment_answers?: Json | null
          assessment_completed?: boolean | null
          assessment_data?: Json | null
          booktext?: boolean | null
          communication_style?: string | null
          created_at?: string
          email?: string
          emotional_state?: string | null
          goals?: string[] | null
          growth_stage?: string | null
          id?: string
          last_session?: string | null
          learning_style?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_prompts: {
        Row: {
          created_at: string
          favorite: boolean
          id: string
          prompt_data: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          favorite?: boolean
          id?: string
          prompt_data: Json
          user_id: string
        }
        Update: {
          created_at?: string
          favorite?: boolean
          id?: string
          prompt_data?: Json
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          coupon_code: string | null
          created_at: string | null
          current_period_ends_at: string | null
          id: string
          is_trial: boolean | null
          is_unlimited: boolean | null
          status: string
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string | null
          current_period_ends_at?: string | null
          id?: string
          is_trial?: boolean | null
          is_unlimited?: boolean | null
          status?: string
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coupon_code?: string | null
          created_at?: string | null
          current_period_ends_at?: string | null
          id?: string
          is_trial?: boolean | null
          is_unlimited?: boolean | null
          status?: string
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      therapy_sessions: {
        Row: {
          action_items: Json[] | null
          content: string
          created_at: string
          id: string
          limiting_beliefs: string[] | null
          reframed_narrative: string | null
          themes: string[] | null
          user_id: string
        }
        Insert: {
          action_items?: Json[] | null
          content: string
          created_at?: string
          id?: string
          limiting_beliefs?: string[] | null
          reframed_narrative?: string | null
          themes?: string[] | null
          user_id: string
        }
        Update: {
          action_items?: Json[] | null
          content?: string
          created_at?: string
          id?: string
          limiting_beliefs?: string[] | null
          reframed_narrative?: string | null
          themes?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapy_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          completed_at: string | null
          created_at: string
          deadline: string
          id: string
          status: string
          steps: string[]
          title: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          deadline: string
          id?: string
          status?: string
          steps: string[]
          title: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          deadline?: string
          id?: string
          status?: string
          steps?: string[]
          title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_unlimited_access: {
        Args: {
          p_user_id: string
          p_coupon_code: string
        }
        Returns: boolean
      }
      check_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      delete_journal_entry: {
        Args: {
          p_entry_id: string
        }
        Returns: undefined
      }
      get_journal_entries: {
        Args: Record<PropertyKey, never>
        Returns: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          mood: string | null
          prompt: string
          topic: string | null
          type: string | null
          user_id: string
        }[]
      }
      get_subscription_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      insert_journal_entry: {
        Args: {
          p_user_id: string
          p_prompt: string
          p_content: string
          p_topic?: string
          p_mood?: string
        }
        Returns: undefined
      }
      make_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_journal_entry: {
        Args: {
          p_entry_id: string
          p_content: string
        }
        Returns: undefined
      }
      update_types: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
