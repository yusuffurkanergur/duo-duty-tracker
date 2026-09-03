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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          acknowledged_at: string | null
          body: string | null
          couple_id: string
          created_at: string
          from_user: string
          id: string
          kind: string
          title: string
          to_user: string
        }
        Insert: {
          acknowledged_at?: string | null
          body?: string | null
          couple_id: string
          created_at?: string
          from_user: string
          id?: string
          kind: string
          title: string
          to_user: string
        }
        Update: {
          acknowledged_at?: string | null
          body?: string | null
          couple_id?: string
          created_at?: string
          from_user?: string
          id?: string
          kind?: string
          title?: string
          to_user?: string
        }
        Relationships: []
      }
      couples: {
        Row: {
          created_at: string
          id: string
          partner_a: string
          partner_b: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          partner_a: string
          partner_b?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          partner_a?: string
          partner_b?: string | null
        }
        Relationships: []
      }
      positions: {
        Row: {
          couple_id: string
          lat: number
          lng: number
          updated_at: string
          user_id: string
        }
        Insert: {
          couple_id: string
          lat: number
          lng: number
          updated_at?: string
          user_id: string
        }
        Update: {
          couple_id?: string
          lat?: number
          lng?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          couple_id: string | null
          created_at: string
          display_name: string
          id: string
          invite_code: string
        }
        Insert: {
          couple_id?: string | null
          created_at?: string
          display_name?: string
          id: string
          invite_code?: string
        }
        Update: {
          couple_id?: string | null
          created_at?: string
          display_name?: string
          id?: string
          invite_code?: string
        }
        Relationships: []
      }
      red_zones: {
        Row: {
          couple_id: string
          created_at: string
          created_by: string
          id: string
          lat: number
          lng: number
          name: string
          radius_m: number
        }
        Insert: {
          couple_id: string
          created_at?: string
          created_by: string
          id?: string
          lat: number
          lng: number
          name: string
          radius_m?: number
        }
        Update: {
          couple_id?: string
          created_at?: string
          created_by?: string
          id?: string
          lat?: number
          lng?: number
          name?: string
          radius_m?: number
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed_at: string | null
          couple_id: string
          created_at: string
          deadline_note: string | null
          id: string
          place_lat: number | null
          place_lng: number | null
          place_name: string | null
          receiver_id: string
          response_ms: number | null
          sender_id: string
          title: string
        }
        Insert: {
          completed_at?: string | null
          couple_id: string
          created_at?: string
          deadline_note?: string | null
          id?: string
          place_lat?: number | null
          place_lng?: number | null
          place_name?: string | null
          receiver_id: string
          response_ms?: number | null
          sender_id: string
          title: string
        }
        Update: {
          completed_at?: string | null
          couple_id?: string
          created_at?: string
          deadline_note?: string | null
          id?: string
          place_lat?: number | null
          place_lng?: number | null
          place_name?: string | null
          receiver_id?: string
          response_ms?: number | null
          sender_id?: string
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gen_invite_code: { Args: never; Returns: string }
      is_my_couple: { Args: { _couple_id: string }; Returns: boolean }
      join_couple: { Args: { _code: string }; Returns: string }
      my_couple_id: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
