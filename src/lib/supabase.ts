// Mock authentication service
class AuthService {
  async signInWithPassword(credentials: { email: string; password: string }) {
    // Mock authentication
    if (credentials.email === 'diego.demonte@vpjalimentos.com.br' && credentials.password === 'Kabul@21') {
      return {
        data: {
          user: {
            id: '1',
            email: 'diego.demonte@vpjalimentos.com.br',
            name: 'Diego Demonte',
            role: 'admin'
          }
        }
      };
    }
    throw new Error('Invalid credentials');
  }

  async signOut() {
    // Mock sign out
    return Promise.resolve();
  }
}

export const supabase = {
  auth: new AuthService()
};