import { useState } from "react";
import { RouteInput } from "@/components/RouteInput";
import { RouteResults } from "@/components/RouteResults";
import { Network, Sparkles } from "lucide-react";

interface Route {
  network: string;
  nextHop: string;
  ad: number;
  metric: number;
  isBest?: boolean;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchedIp, setSearchedIp] = useState<string>("");
  const [routes, setRoutes] = useState<Route[]>([]);

  // Mock data for demonstration - replace with actual API call to Python backend
  const mockApiCall = async (ip: string): Promise<{ routes: Route[]; bestRoute: Route | null }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock routing table
    const routingTable = [
      { network: "192.168.1.0/24", nextHop: "10.0.0.1", ad: 1, metric: 10 },
      { network: "192.168.0.0/16", nextHop: "10.0.0.2", ad: 1, metric: 10 },
      { network: "192.168.1.70/32", nextHop: "10.0.0.3", ad: 1, metric: 10 },
      { network: "172.16.0.0/16", nextHop: "10.0.0.4", ad: 110, metric: 20 },
      { network: "172.16.0.0/16", nextHop: "10.0.0.5", ad: 1, metric: 10 },
      { network: "0.0.0.0/0", nextHop: "200.1.1.1", ad: 1, metric: 0 },
    ];

    // Simple mock logic to find matching routes
    const matchingRoutes = routingTable.filter(route => {
      // This is simplified - in real implementation, use ipaddress library logic
      if (route.network === "0.0.0.0/0") return true;
      
      const [network] = route.network.split("/");
      const networkParts = network.split(".");
      const ipParts = ip.split(".");
      
      // Check if first octets match
      return networkParts[0] === ipParts[0] && 
             (networkParts[1] === ipParts[1] || route.network.includes("/8"));
    });

    if (matchingRoutes.length === 0) {
      return { routes: [], bestRoute: null };
    }

    // Sort by prefix length (desc), then AD (asc), then metric (asc)
    const sorted = [...matchingRoutes].sort((a, b) => {
      const prefixA = parseInt(a.network.split("/")[1]);
      const prefixB = parseInt(b.network.split("/")[1]);
      
      if (prefixA !== prefixB) return prefixB - prefixA;
      if (a.ad !== b.ad) return a.ad - b.ad;
      return a.metric - b.metric;
    });

    const bestRoute = { ...sorted[0], isBest: true };
    const allRoutes = matchingRoutes.map(r => 
      r.network === bestRoute.network && 
      r.nextHop === bestRoute.nextHop && 
      r.ad === bestRoute.ad && 
      r.metric === bestRoute.metric
        ? bestRoute 
        : r
    );

    return { routes: allRoutes, bestRoute };
  };

  const handleSearch = async (ip: string) => {
    setIsLoading(true);
    setSearchedIp(ip);
    
    try {
      // TODO: Replace with actual API call to Python backend
      // const response = await fetch(`/api/route?ip=${ip}`);
      // const data = await response.json();
      
      const data = await mockApiCall(ip);
      setRoutes(data.routes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setRoutes([]);
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
