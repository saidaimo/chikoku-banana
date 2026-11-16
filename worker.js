// Cloudflare Worker: ブラウザからの通信をApps Scriptへ中継します。
// ユーザーの認証トークンはURLではなくPOST本文で送られます。
const GAS_URL = "https://script.google.com/macros/s/AKfycbzYCr53q0KbJQ-QwVVZSgXCiaw1LduwH3OblMWi_BaZfchR213QYpVbeY5_N1jy7TNOJQ/exec";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

export default {
  async fetch(request) {
    const cors = corsHeaders();
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return new Response(JSON.stringify({ ok: false, error: "POST only" }), {
      status: 405, headers: { ...cors, "Content-Type": "application/json; charset=utf-8" }
    });

    const body = await request.text();
    if (!body || body.length > 30000) return new Response(JSON.stringify({ ok: false, error: "リクエストが空、またはサイズ上限を超えています。" }), {
      status: 413, headers: { ...cors, "Content-Type": "application/json; charset=utf-8" }
    });

    try {
      const upstream = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body,
        redirect: "follow"
      });
      const responseText = await upstream.text();
      return new Response(responseText, {
        status: upstream.status,
        headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
      });
    } catch (_) {
      return new Response(JSON.stringify({ ok: false, error: "Apps Scriptサーバーへ接続できませんでした。" }), {
        status: 502, headers: { ...cors, "Content-Type": "application/json; charset=utf-8" }
      });
    }
  }
};
