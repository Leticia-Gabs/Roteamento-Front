import { useState } from "react";
import { RouteInput } from "@/components/RouteInput";
import { RouteResults } from "@/components/RouteResults";
import { Network, Sparkles } from "lucide-react";

// 1. Defina a URL da sua API Flask
const API_URL = "http://localhost:5000";

interface Route {
  network: string;
  nextHop: string; // <-- 'nextHop' (camelCase)
  ad: number;
  metric: number; // <-- 'metric' (camelCase)
  isBest?: boolean;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchedIp, setSearchedIp] = useState<string>("");
  const [routes, setRoutes] = useState<Route[]>([]);

  // 2. A função mockApiCall foi REMOVIDA

  // 3. Atualize a função handleSearch
  const handleSearch = async (ip: string) => {
    setIsLoading(true);
    setSearchedIp(ip);
    
    try {
      // --- ESTA É A CHAMADA REAL ---
      const response = await fetch(`${API_URL}/api/simular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ip_destino: ip })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.erro || "Falha ao buscar dados da API");
      }
      
      const data: { routes: Route[] } = await response.json();
      setRoutes(data.routes); // A API agora retorna a lista 'routes'

    } catch (error) {
      console.error("Error fetching routes:", error);
      setRoutes([]); // Limpa as rotas em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  const bestRoute = routes.find(r => r.isBest) || null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzNmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iaHNsKDE5NSAxMDAlIDUwJSAvIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-40"></div>
        
        <div className="container mx-auto px-4 py-16 relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm">
              <Network className="w-8 h-8 text-primary" />
            </div>
            <Sparkles className="w-6 h-6 text-accent animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Simulador de Roteamento
          </h1>
          
          <p className="text-lg text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Visualize a lógica de decisão de roteamento em tempo real. 
            Entenda como funciona o <span className="text-primary font-semibold">Longest Prefix Match</span>, 
            <span className="text-primary font-semibold"> Distância Administrativa</span> e 
            <span className="text-primary font-semibold"> Métrica</span>.
          </p>
          
          <RouteInput onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        {searchedIp && !isLoading && (
          <RouteResults 
            searchedIp={searchedIp} 
            routes={routes}
            bestRoute={bestRoute}
          />
        )}
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Processando roteamento...</p>
          </div>
        )}

        {!searchedIp && !isLoading && (
          <div className="text-center py-12 space-y-8">
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="text-2xl font-semibold">Como funciona?</h2>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="p-6 rounded-lg bg-card border border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Longest Prefix Match</h3>
                  <p className="text-sm text-muted-foreground">
                    A rota mais específica (maior prefixo) sempre tem prioridade
                  </p>
                </div>
                
                <div className="p-6 rounded-lg bg-card border border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Distância Admin.</h3>
                  <p className="text-sm text-muted-foreground">
                    Se o prefixo for igual, a menor AD (fonte mais confiável) vence
                  </p>
                </div>
                
                <div className="p-6 rounded-lg bg-card border border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Métrica</h3>
                  <p className="text-sm text-muted-foreground">
                    Se a AD também for igual, a menor métrica (menor custo) é escolhida
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;