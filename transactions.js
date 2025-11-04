import { readTransactions } from '../../utils/store.js'
export default async function handler(req, res){
  const auth = req.headers.authorization || ''
  const expected = 'Basic ' + Buffer.from((process.env.ADMIN_USER||'admin') + ':' + (process.env.ADMIN_PASS||'change_me')).toString('base64')
  if (auth !== expected) return res.status(401).json({error:'Unauthorized'})
  const rows = await readTransactions()
  return res.status(200).json({ rows })
}
