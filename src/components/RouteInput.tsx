import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RouteInputProps {
  onSearch: (ip: string) => void;
  isLoading: boolean;
}

export const RouteInput = ({ onSearch, isLoading }: RouteInputProps) => {
  const [ip, setIp] = useState("");
  const { toast } = useToast();

  const validateIP = (ip: string): boolean => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    
    const parts = ip.split(".");
    return parts.every(part => {
      const num = parseInt(part);
      return num >= 0 && num <= 255;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ip.trim()) {
      toast({
        title: "IP obrigatório",
        description: "Por favor, insira um endereço IP válido",
        variant: "destructive",
      });
      return;
    }

    if (!validateIP(ip)) {
      toast({
        title: "IP inválido",
        description: "Formato esperado: xxx.xxx.xxx.xxx (0-255)",
        variant: "destructive",
      });
      return;
    }

    onSearch(ip);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Digite o IP de destino (ex: 192.168.1.50)"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Search className="w-4 h-4 mr-2" />
          {isLoading ? "Buscando..." : "Buscar"}
        </Button>
      </div>
    </form>
  );
};
