export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const { amount='1.00', currency='USD' } = req.body || {}
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
    const orderRes = await fetch(base + '/v2/checkout/orders', {
      method:'POST',
      headers: { 'Content-Type':'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ intent: 'CAPTURE', purchase_units:[{ amount:{ currency_code: currency, value: amount } }] })
    })
    const orderJson = await orderRes.json()
    return res.status(200).json(orderJson)
  } catch(err){
    console.error('create-order', err)
    return res.status(500).json({ error: err.message })
  }
}
