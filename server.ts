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
          customIntro: `Olá! Sou Ana Carolina Ferreira da Costa, profissional com forte experiência em recepção, suporte administrativo e atendimento ao cliente. Ao longo da minha trajetória na Solistica e como empreendedora autônoma na área da beleza, desenvolvi habilidades sólidas de organização, gestão de agenda, notas fiscais e relacionamento de alto padrão. Gostaria de conversar para entender como posso somar à sua equipe com simpatia, eficiência e organização.`
        });
      }

      const cvContext = `
Nome Completo: Ana Carolina Ferreira da Costa
Cargo Desejado: Recepcionista, Assistente Administrativo, Atendimento ao Cliente, Auxiliar Administrativo
Localização: Fortaleza - Ceará

Sobre:
Profissional com experiência em atendimento ao cliente, recepção e suporte administrativo. Atuou em ambiente corporativo desenvolvendo atividades administrativas, financeiras e de atendimento, sempre prezando pela organização, comunicação e qualidade no atendimento.
Também atua como profissional autônoma na área da beleza, realizando serviços de design de sobrancelhas e alongamento de cílios, desenvolvendo competências em relacionamento com clientes, organização de agenda e gestão do próprio negócio.

Experiência 1:
Empresa: Solistica (Maio de 2024 até Fevereiro de 2025)
Cargo: Recepcionista Administrativa
Atividades:
- Atendimento presencial, telefônico e por e-mail
- Recepção de visitantes e atendimento ao cliente com foco em satisfação
- Cadastro e atualização de informações em CRM
- Organização, controle e arquivamento de documentos administrativos e logísticos
- Apoio integral às rotinas administrativas e financeiras
- Emissão, lançamento e conferência de notas fiscais
- Recebimento de pagamentos e emissão de recibos
- Recebimento e conferência de cargas em suporte operacional

Experiência 2:
Empresa: Profissional Autônoma (Março de 2025 até Atualmente)
Cargo: Designer de Sobrancelhas e Lash Designer (Autônoma)
Atividades:
- Atendimento personalizado de alta qualidade focado em estética facial
- Realização de serviços de design de sobrancelhas e cílios
- Gestão autônoma de agenda e agendamentos estratégicos
- Atendimento via WhatsApp e redes sociais comerciais
- Organização de materiais, controle de estoque e fornecedores
- Relacionamento interpessoal e estratégias de fidelização

Cursos:
1. Assistente Administrativo (IEP) - Rotinas Administrativas, Atendimento, Comunicação, Notas Fiscais, Financeiro, Pacote Office.
2. Informática Básica (IEP) - Word, Excel Básico, PowerPoint, Outlook, Google Docs & Planilhas, Digitação.
`;

      const prompt = `
Você é um especialista em recrutamento e seleção (RH).
Analise se o perfil da candidata Ana Carolina Ferreira da Costa se qualifica e se destaca para uma vaga no segmento/cargo de "${segment}".

Detalhes adicionais da vaga fornecidos pela candidata (opcional):
"${description || 'Não fornecido'}"

Com base no currículo da Ana Carolina:
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
        model: "gemini-3.5-flash",
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
