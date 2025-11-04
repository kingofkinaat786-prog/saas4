export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const { orderID } = req.body || {}
    if (!orderID) return res.status(400).json({ error: 'orderID required' })
    const client = process.env.PAYPAL_CLIENT_ID
    const secret = process.env.PAYPAL_CLIENT_SECRET
    const env = process.env.PAYPAL_ENVIRONMENT || 'sandbox'
    const base = env === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
    const tRes = await fetch(base + '/v1/oauth2/token', {
      method:'POST',
      headers: { Authorization: 'Basic ' + Buffer.from(client + ':' + secret).toString('base64'), 'Content-Type':'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials'
    })
    const tJson = await tRes.json()
    const token = tJson.access_token
    const capRes = await fetch(base + `/v2/checkout/orders/${orderID}/capture`, { method:'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type':'application/json' } })
    const capJson = await capRes.json()
    // store transaction in supabase if configured, else local /tmp store
    await storeTransaction({provider:'paypal', provider_id: capJson.id || orderID, amount: capJson.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || null, currency: capJson.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code || 'USD'})
    return res.status(200).json(capJson)
  } catch(err){
    console.error('capture-order', err)
    return res.status(500).json({ error: err.message })
  }
}

import { storeTransaction } from '../../utils/store.js'
