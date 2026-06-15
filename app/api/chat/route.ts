import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Retry helper with exponential backoff
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 5, baseDelayMs = 1500): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const isRetryable =
        err?.status === 429 ||
        err?.status === 503 ||
        err?.message?.includes('quota') ||
        err?.message?.includes('overloaded') ||
        err?.message?.includes('Resource has been exhausted');

      if (!isRetryable || attempt === maxRetries) throw err;

      const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 500;
      console.warn(`Gemini retry ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms:`, err?.message);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

export async function POST(request: NextRequest) {
  try {
    const { message, history, context } = await request.json();

    if (!message?.trim()) {
      return Response.json({ success: false, message: 'Message is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `Kamu adalah Vanka-AI, asisten virtual resmi PT. Prima Integrasi Network (PINET) yang terintegrasi di website perusahaan kami.
Berbicara sebagai bagian dari perusahaan — gunakan sudut pandang orang pertama: "kami", "perusahaan kami", "layanan kami", "tim kami".
JANGAN pernah bicara seperti pembaca dokumen: hindari frasa seperti "Berdasarkan informasi yang tersedia...", "Menurut konteks yang diberikan...", "Data menunjukkan bahwa...".
CONTOH YANG BENAR: "Kami menyediakan solusi IT terpadu...", "Layanan unggulan kami meliputi...", "Tim kami siap membantu..."
CONTOH YANG SALAH: "Berdasarkan informasi, PT. PINET menyediakan...", "Dari konteks yang ada..."
Nada: profesional, hangat, percaya diri — seperti staf senior perusahaan yang senang membantu.
Gunakan Bahasa Indonesia secara default; ikuti bahasa pengguna jika ia berbicara dalam bahasa lain.
Jika ditanya hal di luar perusahaan, jawab dengan singkat lalu arahkan kembali ke bagaimana kami bisa membantu.
Jangan ungkapkan bahwa kamu adalah model AI atau language model kecuali ditanya langsung.

Data Perusahaan Kami:
---
${context || 'Informasi perusahaan sedang dimuat.'}
---`,
    });

    // Convert chat history to Gemini format
    const chatHistory = (history || []).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const chat = await withRetry(() =>
            Promise.resolve(model.startChat({ history: chatHistory }))
          );

          const result = await withRetry(() =>
            chat.sendMessageStream(message)
          );

          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              // Send as SSE data
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }

          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (err: any) {
          console.error('Stream error:', err);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: err.message || 'Terjadi kesalahan pada server' })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
