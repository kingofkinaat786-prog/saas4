export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const headers = req.headers
    const body = req.body
    const client = process.env.PAYPAL_CLIENT_ID
    const secret = process.env.PAYPAL_CLIENT_SECRET
    const env = process.env.PAYPAL_ENVIRONMENT || 'sandbox'
    const base = env === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
    // get access token
    const tRes = await fetch(base + '/v1/oauth2/token', {
      method:'POST',
      headers: { Authorization: 'Basic ' + Buffer.from(client + ':' + secret).toString('base64'), 'Content-Type':'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials'
    })
    const tJson = await tRes.json()
    const accessToken = tJson.access_token
    const verifyRes = await fetch(base + '/v1/notifications/verify-webhook-signature', {
      method:'POST',
      headers: { 'Content-Type':'application/json', Authorization: 'Bearer ' + accessToken },
      body: JSON.stringify({
        transmission_id: headers['paypal-transmission-id'],
        transmission_time: headers['paypal-transmission-time'],
        cert_url: headers['paypal-cert-url'],
        auth_algo: headers['paypal-auth-algo'],
        transmission_sig: headers['paypal-transmission-sig'],
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: body
      })
    })
    const verifyJson = await verifyRes.json()
    if (verifyJson.verification_status !== 'SUCCESS') {
      console.warn('paypal verify failed', verifyJson)
      return res.status(400).json({ok:false})
    }
    const eventType = body.event_type
    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = body.resource || {}
      const providerId = resource.id || null
      const amount = resource.amount && resource.amount.value ? resource.amount.value : null
      const currency = resource.amount && resource.amount.currency_code ? resource.amount.currency_code : 'USD'
      await storeTransaction({provider:'paypal', provider_id:providerId, payer_email: resource.payer?.email_address || null, amount, currency})
    }
    return res.status(200).json({ok:true})
  } catch(err){
    console.error('paypal webhook error', err)
    return res.status(500).json({ok:false, error: err.message})
  }
}
