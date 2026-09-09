// Shared quiz history for Civics Champ, stored in Cloudflare Workers KV
// (bound to this Pages project as SCORES). GET returns the list, POST
// appends one quiz record, DELETE clears it.
export async function onRequest({ request, env }) {
  const kv = env.SCORES;
  let history = (await kv.get("history", { type: "json" })) || [];

  if (request.method === "POST") {
    let rec;
    try { rec = await request.json(); } catch { rec = null; }
    const ok = rec && typeof rec === "object" &&
      typeof rec.date === "string" && rec.date.length < 40 &&
      Number.isInteger(rec.right) && Number.isInteger(rec.total) &&
      Number.isInteger(rec.percent);
    if (!ok) return new Response("Bad record", { status: 400 });
    const id = typeof rec.id === "string" ? rec.id.slice(0, 40) : rec.date;
    if (!history.some(r => (r.id || r.date) === id)) {
      const misses = Array.isArray(rec.misses)
        ? rec.misses.slice(0, 40)
            .filter(m => m && typeof m.q === "string" && typeof m.a === "string" && typeof m.c === "string")
            .map(m => ({ q: m.q.slice(0, 200), a: m.a.slice(0, 80), c: m.c.slice(0, 120) }))
        : [];
      history.push({ id, date: rec.date, right: rec.right, total: rec.total, percent: rec.percent, misses });
      history = history.slice(-500);
      await kv.put("history", JSON.stringify(history));
    }
  } else if (request.method === "DELETE") {
    history = [];
    await kv.put("history", JSON.stringify(history));
  }

  return Response.json(history);
}
