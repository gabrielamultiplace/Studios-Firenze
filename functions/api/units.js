// API para gerenciar status das unidades
// GET: Retorna status salvos no KV
// POST: Atualiza status (requer autenticação admin)

export async function onRequestGet(context) {
  try {
    const data = await context.env.UNITS_KV.get('unit_statuses', 'json');
    return new Response(JSON.stringify(data || {}), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({}), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const auth = context.request.headers.get('Authorization');
    if (!auth || !auth.startsWith('Basic ')) {
      return new Response('Não autorizado', { status: 401 });
    }
    const decoded = atob(auth.slice(6));
    if (decoded !== 'redemultiplace424@gmail.com:123456') {
      return new Response('Credenciais inválidas', { status: 401 });
    }
    const body = await context.request.json();
    await context.env.UNITS_KV.put('unit_statuses', JSON.stringify(body));
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
