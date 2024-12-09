import { create } from 'zustand';

interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  active: boolean;
}

interface NewsStore {
  news: News[];
  latestNews: News[];
  loading: boolean;
  error: string | null;
  addNews: (news: Omit<News, 'id'>) => void;
  updateNews: (id: string, data: Partial<News>) => void;
  deleteNews: (id: string) => void;
}

// Mock data
const mockNews: News[] = [
  {
    id: '1',
    title: 'Avanços em Regeneração Óssea: Nova Tecnologia Revoluciona Implantes Dentários',
    content: `<p>Uma nova tecnologia de barreira óssea está revolucionando o campo da implantodontia, oferecendo resultados superiores em regeneração tecidual guiada. Desenvolvida após anos de pesquisa, esta inovação promete reduzir significativamente o tempo de recuperação dos pacientes.</p>
    
    <p>O material, que combina propriedades bioativas avançadas com uma estrutura otimizada, demonstrou em estudos clínicos uma taxa de sucesso 40% superior aos métodos tradicionais. "É um avanço significativo que beneficiará tanto profissionais quanto pacientes", afirma Dr. Ricardo Santos, especialista em implantodontia.</p>`,
    excerpt: 'Nova tecnologia de barreira óssea promete revolucionar procedimentos de implante dentário com resultados superiores e menor tempo de recuperação.',
    imageUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800',
    author: 'Dr. Ricardo Santos',
    publishedAt: '2024-03-15T10:00:00Z',
    active: true
  },
  {
    id: '2',
    title: 'Boneheal Expande Presença no Mercado Internacional',
    content: `<p>A Boneheal anuncia sua expansão para novos mercados internacionais, marcando um momento significativo em sua trajetória de crescimento. Com a abertura de novos centros de distribuição estrategicamente localizados, a empresa fortalece sua posição como líder no setor de biomateriais.</p>
    
    <p>Esta expansão inclui parcerias com importantes centros de pesquisa e desenvolvimento, garantindo que a inovação continue sendo o pilar central da empresa. "Nossa missão é levar soluções de qualidade para profissionais em todo o mundo", destaca Maria Oliveira, Diretora de Expansão Internacional.</p>`,
    excerpt: 'Empresa anuncia abertura de novos centros de distribuição e parcerias estratégicas em mercados internacionais.',
    imageUrl: 'https://images.unsplash.com/photo-1584363854442-d9f8ef05f777?w=800',
    author: 'Maria Oliveira',
    publishedAt: '2024-03-14T14:30:00Z',
    active: true
  }
];

export const useNewsStore = create<NewsStore>((set) => ({
  news: mockNews,
  latestNews: mockNews.filter(n => n.active).slice(0, 3),
  loading: false,
  error: null,

  addNews: async (news) => {
    const newNews = {
      id: crypto.randomUUID(),
      ...news
    };
    set((state) => ({
      news: [...state.news, newNews],
      latestNews: [...state.news, newNews].filter(n => n.active).slice(0, 3)
    }));
  },

  updateNews: async (id, data) => {
    set((state) => {
      const updatedNews = state.news.map((news) =>
        news.id === id ? { ...news, ...data } : news
      );
      return {
        news: updatedNews,
        latestNews: updatedNews.filter(n => n.active).slice(0, 3)
      };
    });
  },

  deleteNews: async (id) => {
    set((state) => {
      const filteredNews = state.news.filter((news) => news.id !== id);
      return {
        news: filteredNews,
        latestNews: filteredNews.filter(n => n.active).slice(0, 3)
      };
    });
  }
}));