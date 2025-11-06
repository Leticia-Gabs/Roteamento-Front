import { RouteCard } from "./RouteCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface Route {
  network: string;
  nextHop: string;
  ad: number;
  metric: number;
  isBest?: boolean;
}

interface RouteResultsProps {
  searchedIp: string;
  routes: Route[];
  bestRoute: Route | null;
}

export const RouteResults = ({ searchedIp, routes, bestRoute }: RouteResultsProps) => {
  if (routes.length === 0) {
    return (
      <Alert className="border-destructive/50 bg-destructive/10">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertTitle>Nenhuma rota encontrada</AlertTitle>
        <AlertDescription>
          Não há rotas disponíveis para o IP {searchedIp}
        </AlertDescription>
      </Alert>
    );
  }

  const getExplanation = (route: Route) => {
    if (!route.isBest) return undefined;

    const prefixLength = parseInt(route.network.split('/')[1]);
    const otherRoutes = routes.filter(r => r.network !== route.network);
    
    let prefixMatch = `Esta rota tem o prefixo /${prefixLength}, que é`;
    const otherPrefixes = otherRoutes.map(r => parseInt(r.network.split('/')[1]));
    if (otherPrefixes.length > 0 && prefixLength >= Math.max(...otherPrefixes)) {
      prefixMatch += ` o mais específico entre todas as rotas correspondentes.`;
    } else {
      prefixMatch += ` suficientemente específico para este destino.`;
    }

    let adReason = `AD = ${route.ad}. `;
    const samePrefix = otherRoutes.filter(r => r.network.split('/')[1] === route.network.split('/')[1]);
    if (samePrefix.length > 0) {
      const minAD = Math.min(...samePrefix.map(r => r.ad));
      if (route.ad <= minAD) {
        adReason += `Esta é a rota mais confiável (menor AD) entre as rotas com mesmo prefixo.`;
      }
    } else {
      adReason += `Única rota com este prefixo.`;
    }

    let metricReason = `Métrica = ${route.metric}. `;
    const sameAD = otherRoutes.filter(r => 
      r.network.split('/')[1] === route.network.split('/')[1] && r.ad === route.ad
    );
    if (sameAD.length > 0) {
      const minMetric = Math.min(...sameAD.map(r => r.metric));
      if (route.metric <= minMetric) {
        metricReason += `Esta rota tem o menor custo (métrica) entre as rotas equivalentes.`;
      }
    } else {
      metricReason += `Sem outras rotas com mesma AD para comparação.`;
    }

    return {
      prefixMatch,
      adReason,
      metricReason
    };
  };

  return (
    <div className="space-y-6">
      <Alert className="border-primary/50 bg-primary/10">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <AlertTitle>Rota encontrada para {searchedIp}</AlertTitle>
        <AlertDescription>
          {routes.length} {routes.length === 1 ? 'rota correspondente' : 'rotas correspondentes'} encontrada(s). 
          {bestRoute && ` Melhor caminho: ${bestRoute.network} via ${bestRoute.nextHop}`}
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {routes.length === 1 ? 'Rota Disponível' : 'Rotas Disponíveis'}
        </h3>
        {routes.map((route, index) => (
          <RouteCard 
            key={`${route.network}-${index}`} 
            route={route}
            explanation={getExplanation(route)}
          />
        ))}
      </div>
    </div>
  );
};
