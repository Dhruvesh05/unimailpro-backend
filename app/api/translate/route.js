import { translate } from 'google-translate-open-api';

export async function POST(req) {
  try {
    const body = await req.json();
    const { text, target } = body;

    const result = await translate(text, { tld: "com", to: target });
    const translatedText = result.data[0];

    return new Response(JSON.stringify({ translatedText }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
