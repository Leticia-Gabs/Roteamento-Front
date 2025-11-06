# Simulador de Tabela de Roteamento

Este projeto é um aplicativo Python que simula a lógica de decisão de roteamento (Longest Prefix Match, AD, Métrica) com base em uma tabela de rotas estáticas.

## O Conceito por trás do projeto

### O que é Roteamento?

Pense no roteamento como o "GPS da internet". É o processo que dispositivos de rede chamados **roteadores** usam para decidir qual o melhor caminho para enviar pacotes de dados de uma rede para outra.

Quando um roteador recebe um pacote, ele olha o endereço IP de destino e consulta sua **Tabela de Roteamento**. Esta tabela é um conjunto de regras que diz: "Para chegar na rede X, envie o pacote para o roteador Y".
<div style="background-color: #fff">
  <img src="https://cf-assets.www.cloudflare.com/slt3lc6tev37/5biqo5wm6nM8GSmiNyiAnl/b6b5c9befeda6ba99b4380d84953de18/routing-diagram.svg" alt="Minha Figura">
</div>

O desafio é que, muitas vezes, existem *vários caminhos* possíveis para o mesmo destino. Para escolher o **melhor caminho**, o roteador segue uma lógica de decisão hierárquica e muito estrita:

1.  **Longest Prefix Match (Prefixo Mais Longo):** A rota mais específica *sempre* vence. Uma rota para `192.168.1.0/24` (254 IPs) é mais específica que uma para `192.168.0.0/16` (65.534 IPs).
2.  **Distância Administrativa (AD):** Se duas rotas tiverem o *mesmo prefixo*, o roteador escolhe aquela que veio de uma fonte mais "confiável". A confiabilidade é medida por um número (a AD), e o *menor* número vence. (Ex: Uma Rota Estática [AD 1] é mais confiável que uma rota OSPF [AD 110]).
3.  **Métrica:** Se a AD também for igual, o roteador usa a "métrica" do protocolo de roteamento. A métrica é o "custo" do caminho (baseado em velocidade, saltos, etc.), e o *menor* custo vence.

### Como Estamos Simulando Isso?

Este projeto recria exatamente essa **lógica de decisão** em Python, de forma simplificada:

* **O Roteador:** É simulado pela classe `Roteador`, que orquestra o processo.
* **A Tabela de Roteamento:** Em vez de uma tabela complexa em hardware, usamos um arquivo `rotas.json`. Este arquivo é lido pela classe `TabelaRoteamento` e armazenado em memória como uma lista de objetos `Rota`.
* **O Pacote de Dados:** É simulado por uma simples `string` contendo um IP de destino (ex: `"192.168.1.50"`), que fornecemos ao programa.
* **A Lógica de Decisão:** É o coração do projeto. O método `encontrar_melhor_rota` implementa as 3 regras (Prefix, AD e Métrica), usando a biblioteca `ipaddress` para verificar se um IP pertence a uma rede e qual o tamanho do prefixo.
* **O Resultado:** Em vez de encaminhar um pacote real, o simulador imprime no console qual seria a "melhor rota" escolhida e para qual "próximo salto" (`proximo_salto`) o pacote seria enviado.

---

## 1. Tema
Simulação da lógica de decisão de um roteador (Best Path Selection) em Python.

## 2. Escopo do Projeto
O aplicativo deve:
* Carregar uma tabela de rotas estáticas de um arquivo externo (JSON).
* Implementar a lógica de roteamento em três níveis:
    1.  *Longest Prefix Match* (Prefixo Mais Longo).
    2.  *Distância Administrativa (AD)* (Menor AD vence).
    3.  *Métrica* (Menor Métrica vence).
* Receber um IP de destino (string) como entrada.
* Retornar (imprimir no console) qual foi a "melhor rota" escolhida para aquele destino.

## 3. Tecnologias Utilizadas
* **Python 3.x**
* Biblioteca Padrão: `ipaddress` (para manipulação de redes e IPs)
* Biblioteca Padrão: `json` (para leitura da tabela de rotas)

## 4. Como Executar
1.  Clone o repositório.
2.  (Opcional, mas recomendado) Crie e ative um ambiente virtual:
    ```bash
    python -m venv .venv
    source .venv/bin/activate
    ```
3.  Execute o simulador:
    ```bash
    python main.py
    ```

