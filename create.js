import QRCode from 'qrcode'
export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).end()
  const { amount='1.00', note='Payment' } = req.body || {}
  const pa = process.env.NEXT_PUBLIC_PERSONAL_PAYMENT_LINK_UPI || 'owais@okicici'
  const pn = process.env.UPI_MERCHANT_NAME || 'OwaisMerchant'
  const upiLink = `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&tn=${encodeURIComponent(note)}&am=${encodeURIComponent(amount)}&cu=INR`
  const qrDataUrl = await QRCode.toDataURL(upiLink)
  return res.status(200).json({ upiLink, qrDataUrl })
}
