import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini safely
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API endpoint for smart resume analysis
  app.post("/api/analyze-job", async (req, res) => {
    try {
      const { segment, description } = req.body;
      if (!segment) {
        return res.status(400).json({ error: "O segmento é obrigatório." });
      }

      if (!ai) {
        // Fallback simulated response if API Key is not set yet, so app is gracefully operational
        return res.json({
          matchPercentage: 85,
          justification: "Seu perfil possui excelente aderência a este segmento! Sua experiência administrativa e de recepção na Solistica, combinada com a sua proatividade comercial autônoma, oferece ao recrutador o melhor dos dois mundos: técnica e relacionamento empático com o cliente.",
          strengths: [
            "Atendimento de excelência e recepção corporativa comprovados (Solistica)",
            "Gestão autônoma de agenda e relacionamento via WhatsApp (Lash Designer)",
            "Formação completa de Assistente Administrativo e Informática Básica",
            "Perfil altamente organizado, focado em proatividade e simpatia"
          ],
          pitchTips: [
            "Destaque o controle de notas fiscais e suporte logístico da Solistica para demonstrar atenção aos detalhes.",
            "Comente sobre a fidelização de clientes na sua carreira autônoma de beleza para mostrar excelente relacionamento interpessoal.",
            "Frise sua agilidade em aprender novos sistemas de CRM e planilhas digitais."
          ],
          customIntro: `Olá! Sou Carolina Ferreira, profissional com forte experiência em recepção, suporte administrativo e atendimento ao cliente. Ao longo da minha trajetória na Solistica e como empreendedora autônoma na área da beleza, desenvolvi habilidades sólidas de organização, gestão de agenda, notas fiscais e relacionamento de alto padrão. Gostaria de conversar para entender como posso somar à sua equipe com simpatia, eficiência e organização.`
        });
      }

      const cvContext = `
Nome Completo: Ana Carolina Ferreira da Costa (Carolina Ferreira)
Cargo Desejado: Recepcionista Corporativa, Assistente Administrativo, Atendimento ao Cliente de Alta Performance, Recepção de Clínicas
Localização: Fortaleza e Região Metropolitana - CE
Portfólio Web: https://carolina-ferreira.vercel.app/

Sobre:
Profissional dedicada com sólida experiência em recepção corporativa, rotinas administrativas, suporte financeiro e excelência no atendimento ao cliente. Possui vivência no ambiente corporativo da Solistica (recepção de visitantes, conferência e lançamento de notas fiscais, controle de fluxo de caixa, emissão de recibos e gestão documental). Atua também como empreendedora autônoma na área de estética e beleza facial (design de sobrancelhas e lash designer), aprimorando competências de autogestão, atendimento humanizado, fidelização, negociação via WhatsApp e organização criteriosa de agendas.

Experiência 1:
Empresa: Solistica (Maio de 2024 até Fevereiro de 2025)
Cargo: Recepcionista Administrativa
Atividades:
- Recepção presencial e acolhimento cordial de clientes, visitantes e fornecedores
- Atendimento telefônico via central PABX, triagem de chamadas e recados
- Gerenciamento de correspondências, malotes e circulação de documentos
- Cadastro e atualização contínua de clientes no sistema de CRM
- Emissão, lançamento e conferência minuciosa de Notas Fiscais (NF-e/Danfe) e romaneios
- Apoio ao departamento financeiro: recebimento de valores, emissão de recibos e conciliação
- Controle e arquivo físico e digital de prontuários, contratos e relatórios
- Suporte à equipe de expedição e logística na conferência física e documental de cargas
- Redação de comunicados e e-mails corporativos, agendamento de reuniões

Experiência 2:
Empresa: Profissional Autônoma / Empreendedora (Março de 2025 até Atualmente)
Cargo: Designer de Sobrancelhas e Lash Designer
Atividades:
- Gestão autônoma de negócio de estética facial, atendimento comercial e pós-venda
- Prestação de serviços especializados com mapeamento facial e extensão de cílios
- Gestão estratégica de agenda de atendimentos e confirmações antecipadas
- Atendimento consultivo humanizado focado em fidelização e indicações
- Atendimento e negociação via WhatsApp Business e redes sociais
- Gestão financeira: fluxo de caixa diário, controle de despesas e recebimentos
- Controle criterioso de estoque de insumos e normas de biossegurança

Cursos:
1. Assistente Administrativo Completo (IEP - 160h) - Rotinas Administrativas, Atendimento de Excelência, Redação Oficial, Arquivos, Noções Financeiras, Notas Fiscais, DP/RH, Ética, PABX, Agendas.
2. Informática Corporativa & Pacote Office (IEP - 120h) - Word, Excel (Planilhas e Fórmulas), PowerPoint, Outlook, Google Workspace, Digitação Rápida.
3. Atendimento ao Cliente & Comunicação Assertiva (60h) - Acolhimento, Escuta Ativa, Resolução de Conflitos, Fidelização.
4. Organização do Trabalho & Gestão de Tempo (40h) - Metodologia 5S, Priorização e Produtividade.
`;

      const prompt = `
Você é um especialista em recrutamento e seleção (RH).
Analise se o perfil da candidata Carolina Ferreira se qualifica e se destaca para uma vaga no segmento/cargo de "${segment}".

Detalhes adicionais da vaga fornecidos pela candidata (opcional):
"${description || 'Não fornecido'}"

Com base no currículo da Carolina Ferreira:
${cvContext}

Por favor, faça uma análise detalhada e retorne um objeto JSON contendo:
1. matchPercentage: Um valor inteiro de 0 a 100 indicando o quão compatível ela é para essa vaga.
2. justification: Um parágrafo curto e empático justificando a porcentagem e incentivando-a.
3. strengths: Uma lista de até 4 pontos fortes do currículo dela que se aplicam diretamente a essa vaga.
4. pitchTips: Uma lista de até 3 dicas práticas sobre o que ela deve destacar na entrevista para esse cargo específico.
5. customIntro: Um mini-texto de apresentação (elevator pitch) de 3-4 frases, amigável e focado, que ela pode mandar para o recrutador dessa vaga.

Responda em português brasileiro.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchPercentage: { type: Type.INTEGER },
              justification: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              pitchTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              customIntro: { type: Type.STRING }
            },
            required: ["matchPercentage", "justification", "strengths", "pitchTips", "customIntro"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Resposta vazia do Gemini");
      }

      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Erro na análise do Gemini:", error);
      res.status(500).json({ error: "Erro ao processar análise inteligente. Por favor, tente novamente." });
    }
  });

  // Serve static files in production / Vite in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
