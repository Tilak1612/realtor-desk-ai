import i18n from "./config";

// Strings for the /ai-assistant page itself, merged into the `aiChat` key.
// (The "report this response" strings are a separate module and key, see
// ./aiResponseReport.ts.) Kept out of config.ts for the same reason: several
// people edit config.ts at once. Importing the module registers it.
//
// Why these replace three older `ai.*` strings that are still in config.ts:
//
//   welcomeDesc         The old line promised to "manage contacts, analyze
//                       deals, create tasks, and provide real estate insights".
//                       The claude-chat function can do none of the verbs that
//                       change anything: it has no tools, so it writes nothing
//                       to the CRM. It is sent a short summary (top-scored
//                       contacts, most recent deals, pending tasks) and returns
//                       text. The new line says that and no more.
//   actions.draftTask   Was "Create task". It cannot create one; it can word
//                       one for the person to add.
//   (no market action)  "Market research" is gone, not reworded: the product
//                       holds no market data, so the only possible answer was
//                       an invented figure.
//
// `prompts` are what a quick action sends, and they appear in the person's own
// message bubble, so they are translated like any other visible text. A French
// prompt also gets a French answer.
//
// The failure wording says what happened and what to do next. It does not
// repeat the server's error text ("Edge Function returned a non-2xx status
// code" means nothing to an agent) and does not promise when it will work.

export const aiChatEn = {
  welcomeDesc:
    "I can answer questions from a short summary of your CRM (your top-scored contacts, most recent deals and pending tasks) and draft emails or tasks for you to copy. I can’t change anything in your CRM, and I don’t have market data. Try one of the quick actions above!",
  actions: {
    draftTask: "Draft a task",
  },
  prompts: {
    analyzePipeline: "Can you analyze my current pipeline and provide insights?",
    draftEmail: "Help me draft a follow-up email for my top contact",
    draftTask: "Help me draft a task for today that I can add to my task list myself",
  },
  thinking: "The assistant is preparing a response…",
  error: "The assistant could not answer right now.",
  retry: "Try again",
};

export const aiChatFr: typeof aiChatEn = {
  welcomeDesc:
    "Je peux répondre à vos questions à partir d’un bref résumé de votre CRM (vos contacts les mieux cotés, vos transactions les plus récentes et vos tâches en attente) et rédiger des courriels ou des tâches que vous pourrez copier. Je ne peux rien modifier dans votre CRM et je n’ai pas de données de marché. Essayez une des actions rapides ci-dessus!",
  actions: {
    draftTask: "Rédiger une tâche",
  },
  prompts: {
    analyzePipeline: "Pouvez-vous analyser mon pipeline actuel et me donner des pistes?",
    draftEmail: "Aidez-moi à rédiger un courriel de suivi pour mon meilleur contact",
    draftTask: "Aidez-moi à rédiger une tâche pour aujourd’hui que j’ajouterai moi-même à ma liste de tâches",
  },
  thinking: "L’assistant prépare une réponse…",
  error: "L’assistant n’a pas pu répondre pour le moment.",
  retry: "Réessayer",
};

i18n.addResourceBundle("en", "translation", { aiChat: aiChatEn }, true, true);
i18n.addResourceBundle("fr", "translation", { aiChat: aiChatFr }, true, true);
