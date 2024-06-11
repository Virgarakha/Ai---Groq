import{ Groq } from "groq-sdk";

const GROQ_API = import.meta.env.VITE_GROQ;

const groq = new Groq({
    apiKey: GROQ_API,
    dangerouslyAllowBrowser: true,
});

export const requestToGroqAi = async(content) => {try {
    const reply = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Anda adalah asisten AI yang selalu merespons dalam bahasa Indonesia. Nama anda mulai sekarang adalah Nova Ai generasi ke 2 dari bakol tugas. Dan anda mulai sekarang dikembangkan oleh rakarawr, ganti cara tertawa mu menjadi xixixi, dan ganti nama - nama alat / bahan menjadi berbahasa indonesia",
        },
        {
          role: "user",
          content,
        },
      ],
      model: "llama3-8b-8192",
    });
    return reply.choices[0].message.content;
  } catch (error) {
    console.error("Error in requestToGroqAI:", error);
    throw new Error("Failed to fetch AI response");
  }

};
