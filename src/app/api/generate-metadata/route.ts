import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

export async function POST(req: Request) {
    // 1. Dapatkan semua API keys dari environment variable
    const apiKeysRaw = process.env.GROQ_API_KEYS || process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKeysRaw) {
        return NextResponse.json(
            { error: "Groq API Key (GROQ_API_KEYS) is not configured in .env.local" },
            { status: 500 }
        );
    }

    // Pisahkan string berdasarkan koma menjadi array of strings (trim untuk hilangkan spasi sisa)
    const apiKeys = apiKeysRaw.split(',').map(key => key.trim()).filter(Boolean);

    if (apiKeys.length === 0) {
        return NextResponse.json(
            { error: "Format GROQ_API_KEYS tidak valid atau kosong." },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const { imageBase64, filename, language = "Indonesia" } = body;

        if (!imageBase64) {
            return NextResponse.json({ error: "Gambar thumbnail wajib dikirim." }, { status: 400 });
        }

        // Clean base64 string if it contains data URI prefix
        const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|webp);base64,/, "");

        const prompt = `Ini adalah thumbnail dari sebuah video yang akan di-upload ke platform bernama Vidgram.
Nama file aslinya adalah: "${filename || 'Tidak diketahui'}".
Bahasa yang diminta: ${language}.

Tugas Anda:
1. Analisis gambar thumbnail ini secara mendetail.
2. Buat judul video yang sangat menarik (clickbait SEO friendly), maksimal 60 karakter. Tulis dengan gaya yang kekinian. Gunakan bahasa ${language}.
3. Buat deskripsi video yang panjang dan komprehensif (minimal 2-3 paragraf) yang menceritakan secara menarik tentang isi video berdasarkan gambar tersebut. Tambahkan setidaknya 5-10 hashtag yang relevan di bagian akhir. Gunakan bahasa ${language}.

PENTING FORMAT BALASAN:
Kembalikan HANYA format JSON valid tanpa tanda kutip markdown, dengan struktur persis seperti ini:
{
  "title": "judul video disini",
  "description": "deskripsi video yang panjang disini beserta hashtag"
}`;

        let successfulResult: any = null;
        let lastError: any = null;

        // Loop melalui setiap API Key
        for (let i = 0; i < apiKeys.length; i++) {
            const currentApiKey = apiKeys[i];

            try {
                // Instansiasi Groq SDK dengan key yang sedang aktif
                const groq = new Groq({ apiKey: currentApiKey });

                const completion = await groq.chat.completions.create({
                    model: "meta-llama/llama-4-scout-17b-16e-instruct",
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: prompt },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: `data:image/jpeg;base64,${base64Data}`,
                                    },
                                },
                            ],
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 250,
                    response_format: { type: "json_object" }
                });

                const responseContent = completion.choices[0]?.message?.content;

                if (!responseContent) {
                    throw new Error("Groq API returned empty response");
                }

                successfulResult = JSON.parse(responseContent);

                // Jika berhasil, hentikan loop
                console.log(`Berhasil menggunakan API Key ke-${i + 1}`);
                break;

            } catch (error: any) {
                console.warn(`Failed calling API using key index ${i + 1}:`, error.message);
                lastError = error;
                // If failed, loop continues to the next key
            }
        }

        // Jika setelah semua loop tidak ada result yang didapat, kembalikan Error terakhir
        if (!successfulResult) {
            console.error("All API Keys in rotation FAILED.");
            return NextResponse.json(
                { error: lastError?.message || "All API Keys failed. Bad request or Groq server is down." },
                { status: 500 }
            );
        }

        return NextResponse.json(successfulResult);
    } catch (error: any) {
        console.error("Fatall Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate metadata." },
            { status: 500 }
        );
    }
}
