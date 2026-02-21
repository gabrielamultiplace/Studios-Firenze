// API para lista de espera
// GET: Retorna lista (requer auth)
// POST: Adiciona novo interessado

export async function onRequestGet(context) {
  try {
    const auth = context.request.headers.get('Authorization');
    if (!auth || !auth.startsWith('Basic ')) {
      return new Response('Não autorizado', { status: 401 });
    }
    const decoded = atob(auth.slice(6));
    if (decoded !== 'redemultiplace424@gmail.com:123456') {
      return new Response('Credenciais inválidas', { status: 401 });
    }
    const data = await context.env.UNITS_KV.get('waitlist', 'json');
    return new Response(JSON.stringify(data || []), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const existing = await context.env.UNITS_KV.get('waitlist', 'json') || [];
    existing.push({
      nome: body.nome,
      telefone: body.telefone,
      data: new Date().toISOString()
    });
    await context.env.UNITS_KV.put('waitlist', JSON.stringify(existing));
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

export async function onRequestDelete(context) {
  try {
    const auth = context.request.headers.get('Authorization');
    if (!auth || !auth.startsWith('Basic ')) {
      return new Response('Não autorizado', { status: 401 });
    }
    const decoded = atob(auth.slice(6));
    if (decoded !== 'redemultiplace424@gmail.com:123456') {
      return new Response('Credenciais inválidas', { status: 401 });
    }
    await context.env.UNITS_KV.put('waitlist', JSON.stringify([]));
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
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
