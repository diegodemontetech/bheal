import { supabase } from './supabase';

export async function createAdminUser() {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'diego.demonte@vpjalimentos.com.br',
      password: 'Kabul@21'
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create user profile with admin role
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: 'diego.demonte@vpjalimentos.com.br',
          name: 'Diego Demonte',
          role: 'admin',
          pipelines: ['hunting', 'carteira', 'positivacao', 'resgate', 'lixeira']
        });

      if (profileError) throw profileError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, error };
  }
}