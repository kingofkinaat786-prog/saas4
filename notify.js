import crypto from 'crypto'
export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const signature = req.headers['x-upi-signature'] || ''
    const secret = process.env.UPI_WEBHOOK_SECRET || ''
    const raw = JSON.stringify(req.body || {})
    if (secret) {
      const hmac = crypto.createHmac('sha256', secret).update(raw).digest('hex')
      if (hmac !== signature) return res.status(400).json({ok:false, reason:'invalid_signature'})
    }
    const payload = req.body || {}
    const providerId = payload.txn_id || payload.payment_id || payload.order_id || null
    const amount = payload.amount || payload.value || '0.00'
    const currency = payload.currency || 'INR'
    const payer = payload.payer_vpa || payload.payer || null
    await storeTransaction({provider:'upi', provider_id:providerId, payer_email: payer, amount, currency})
    return res.status(200).json({ok:true})
  } catch(err){
    console.error('upi notify err', err)
    return res.status(500).json({ok:false, error: err.message})
  }
}
