import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Network, Route, TrendingDown, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteData {
  network: string;
  nextHop: string;
  ad: number;
  metric: number;
  isBest?: boolean;
}

interface RouteCardProps {
  route: RouteData;
  explanation?: {
    prefixMatch: string;
    adReason: string;
    metricReason: string;
  };
}

export const RouteCard = ({ route, explanation }: RouteCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg border-2",
      route.isBest 
        ? "border-primary bg-card shadow-[0_0_20px_hsl(var(--primary)/0.2)]" 
        : "border-border bg-card"
    )}>
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              route.isBest ? "bg-primary/20" : "bg-secondary"
            )}>
              <Network className={cn(
                "w-5 h-5",
                route.isBest ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {route.network}
                {route.isBest && (
                  <Badge className="bg-success text-success-foreground">
                    Melhor Rota
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                via {route.nextHop}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Distância Admin.</p>
                <p className="text-sm font-medium">{route.ad}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Métrica</p>
                <p className="text-sm font-medium">{route.metric}</p>
              </div>
            </div>
          </div>

          {explanation && route.isBest && (
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Por que esta é a melhor rota?
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="bg-secondary/50 p-3 rounded-md">
                  <p className="font-medium text-primary mb-1">1. Longest Prefix Match</p>
                  <p className="text-muted-foreground">{explanation.prefixMatch}</p>
                </div>
                
                <div className="bg-secondary/50 p-3 rounded-md">
                  <p className="font-medium text-primary mb-1">2. Distância Administrativa</p>
                  <p className="text-muted-foreground">{explanation.adReason}</p>
                </div>
                
                <div className="bg-secondary/50 p-3 rounded-md">
                  <p className="font-medium text-primary mb-1">3. Métrica</p>
                  <p className="text-muted-foreground">{explanation.metricReason}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
