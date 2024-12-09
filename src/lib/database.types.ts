export interface Database {
  public: {
    Tables: {
      boneheal_leads: {
        Row: {
          id: string
          created_at: string
          dentist_name: string
          clinic_name: string | null
          cnpj: string | null
          cpf: string | null
          phone: string
          email: string
          address: string | null
          socioeconomic_class: string | null
          demographic_density: number | null
          consumption_potential: number | null
          website: string | null
          specialty: string | null
          purchase_history: string | null
          purchase_frequency: string | null
          purchase_volume: number | null
          last_purchase_date: string | null
          average_order_value: number | null
          bone_barriers_type: string | null
          preferred_brands: string | null
          needs_samples: boolean
          other_interests: string | null
          last_contact: string | null
          preferred_communication: string | null
          conversation_notes: string | null
          feedback: string | null
          opportunity_status: string | null
          next_steps: string | null
          expected_close_date: string | null
          potential_value: number | null
          competitors: string | null
          payment_terms: string | null
          credit_limit: number | null
          payment_history: string | null
          delivery_address: string | null
          delivery_preferences: string | null
          special_instructions: string | null
          contracts: string | null
          quotes: string | null
          responsible_id: string
          support_team: string | null
          team_interactions: string | null
          pipeline: string
          status: string
          lead_source: string | null
        }
        Insert: Omit<Database['public']['Tables']['boneheal_leads']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['boneheal_leads']['Row']>
      }
      boneheal_users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string
          role: 'admin' | 'user' | 'manager'
          pipelines: string[]
        }
        Insert: Omit<Database['public']['Tables']['boneheal_users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['boneheal_users']['Row']>
      }
      boneheal_events: {
        Row: {
          id: string
          created_at: string
          title: string
          date: string
          time: string
          type: string
          contact: string
          location: string
          description: string | null
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['boneheal_events']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['boneheal_events']['Row']>
      }
    }
  }
}