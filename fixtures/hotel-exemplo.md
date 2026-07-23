---
# Fixture fictícia para testes — exercita todos os módulos do formato.
# Hotel turístico, verba no degrau Google R$ 2.000+ (Pesquisa/PMax/Hotel Ads/Remarketing).
cliente: Hotel Exemplo
unidade: Hotéis
cidade: Praia Grande
favicon: "🏨"
objetivo: reservas diretas
subtitulo: Distribuição de investimento mensal entre Meta Ads e Google Ads. Hotel fictício usado como fixture de testes.
footer: Arquitetura de Reservas Diretas
verba_mensal: 10000
split: { meta: 60, google: 40 }

meta_ads:
  sub: Crescimento, conversão e recuperação de quem já visitou.
  frentes:
    - nome: Crescimento de perfil
      pct: 25
    - nome: Conversão
      pct: 50
      sub_frentes:
        - nome: Always-on → site
          pct: 60
        - nome: Pacotes
          pct: 40
          pendencia: "Próximo passo: definir os pacotes da temporada"
    - nome: Remarketing
      pct: 25
  nota: "Geografia: capitais num raio de 500 km + público de teste."

google_ads:
  sub: Pesquisa qualificada, PMax, Hotel Ads e recuperação com remarketing.
  blocos:
    - nome: Rede de Pesquisa
      pct: 50
      sub_frentes:
        - { nome: Proteção de marca, pct: 10 }
        - { nome: Destino · topo de funil, pct: 20 }
        - { nome: Intenção qualificada, pct: 45 }
        - { nome: Pacotes, pct: 25 }
    - nome: PMax
      pct: 20
    - nome: Hotel Ads
      pct: 15
    - nome: Remarketing
      pct: 15

keywords:
  sub: As quatro campanhas de Pesquisa e a lista de negativas. Clique em cada campanha para expandir.
  campanhas:
    - nome: Proteção de Marca
      pct: 10
      aberta: true
      desc: "Defensiva: impede OTAs de comprarem o nome do hotel."
      grupos:
        - titulo: Nome principal
          tipo: exata
          termos: [hotel exemplo, hotel exemplo praia grande]
        - titulo: Nome + intenção
          tipo: frase
          termos: [hotel exemplo reservas, hotel exemplo diárias, hotel exemplo site oficial]
    - nome: Destino — Topo de Funil
      pct: 20
      desc: Captura quem pesquisa o destino e ainda não decidiu onde ficar.
      grupos:
        - titulo: Destino geral
          tipo: frase
          termos: [praia grande, viagem praia grande, o que fazer em praia grande, "melhor praia da região|exata"]
      obs: '"Como chegar" ativo só aqui — negativado nas demais.'
    - nome: Intenção Qualificada
      pct: 45
      desc: Quem procura hospedagem no destino e ainda não conhece o hotel.
      grupos:
        - titulo: Genéricas de hospedagem
          tipo: frase
          termos: [hotel em praia grande, onde ficar em praia grande, pousada praia grande]
        - titulo: Atributos
          tipo: frase
          termos: [hotel com piscina praia grande, hotel pé na areia praia grande, hotel para família praia grande]
    - nome: Pacotes
      pct: 25
      desc: Um grupo de anúncios por slot definido.
      grupos:
        - titulo: Réveillon
          tipo: frase
          termos: [réveillon praia grande, pacote réveillon praia]
        - titulo: Férias de julho
          tipo: frase
          termos: [férias de julho hotel, pacote férias julho praia]
  negativas:
    desc: Aplicar como lista compartilhada na Pesquisa e como exclusões no PMax.
    grupos:
      - titulo: Preço / perfil errado
        termos: [barato, hostel, camping, cupom]
      - titulo: Ruído
        termos: [vagas, emprego, clima, mapa]
      - titulo: Concorrentes diretos
        termos: [hotel concorrente fictício]
    obs: "Sem conquesting: concorrentes entram como negativas."

pacotes:
  sub: R$ 1.200 no Meta + R$ 500 no Google. Rodam conforme a temporada.
  slots:
    - { nome: Réveillon, definido: true }
    - { nome: Férias de julho, definido: true }
    - { nome: A definir, definido: false }
  sugestoes: [Carnaval, Romântico, Feriadões]
  nota: "Oferta de reserva direta: 10% OFF em todos os pacotes."

briefing_criativos:
  sub: Crescimento roda com posts já selecionados. As artes de Conversão seguem o briefing.
  grupos:
    - titulo: Crescimento do Perfil — posts selecionados
      sub: Alcance e crescimento da base — R$ 1.500
      cards:
        - { tag: Post, nome: Crescimento · Post 1, url: "https://www.instagram.com/p/EXEMPLO1/" }
        - { tag: Reel, nome: Crescimento · Reel 1, url: "https://www.instagram.com/reel/EXEMPLO2/" }
    - titulo: Conversão — Always-on
      sub: Campanha always-on — R$ 1.800
      briefings:
        - tag: Always-on
          conceito: O mar como quintal
          headline: '"Acorde com o mar na janela."'
          texto: Texto de apoio fictício para a arte always-on.
          destaques: [Pé na areia, Café da manhã incluso]
          cta: Reserve Agora
        - tag: Pacote
          conceito: Réveillon
          headline: '"Vire o ano com os pés na areia."'
          texto: Texto de apoio fictício para a arte de pacote.
          oferta: 10% OFF na reserva direta
          cta: Garanta sua vaga

aprovacao_criativos:
  sub: Organizados por frente do Meta Ads.
  grupos:
    - titulo: Remarketing — Prova Social
      sub: Depoimentos e selos — R$ 1.500
      itens:
        - { tag: Post, nome: Depoimento 1, url: "https://www.instagram.com/p/EXEMPLO3/" }
        - { tag: Stories, nome: Destaque Transfer, url: "https://www.instagram.com/stories/highlights/000/", sem_preview: true }

funil:
  sub: Do investimento ao faturamento, etapa por etapa.
  linhas:
    - { label: Investimento, valor: R$ 10.000 }
    - { label: CPM, valor: "R$ 20,00", taxa: true }
    - { label: Impressões, valor: 500.000 }
    - { label: CTR, valor: "1,50%", taxa: true }
    - { label: Cliques, valor: 7.500 }
    - { label: Vendas, valor: 20 }
    - { label: Ticket médio, valor: "R$ 5.000,00", taxa: true }
    - { label: Faturamento, valor: R$ 100.000, destaque: true }
    - { label: ROAS, valor: "10,0x", taxa: true, positivo: true }

callout:
  frase: A gente não mede vaidade. Medimos negócio.
  grande: R$ 10 mil investidos → **R$ 100 mil** em vendas
---
