import QRCode from 'qrcode'
export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const { amount='1.00', note='Payment', name } = req.body || {}
    const pa = process.env.NEXT_PUBLIC_PERSONAL_PAYMENT_LINK_UPI || 'owais@okicici'
    const pn = name || process.env.UPI_MERCHANT_NAME || 'OwaisMerchant'
    const upiLink = `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&tn=${encodeURIComponent(note)}&am=${encodeURIComponent(amount)}&cu=INR`
    const qrDataUrl = await QRCode.toDataURL(upiLink)
    await storeTransaction({provider:'upi', provider_id: null, amount, currency:'INR'})
    return res.status(200).json({ upiLink, qrDataUrl })
  } catch(err){
    console.error('upi create', err)
    return res.status(500).json({ error: err.message })
  }
}

import { storeTransaction } from '../../utils/store.js'
