import fs from 'fs'
const PATH = process.env.STORE_PATH || '/tmp/transactions.json'
export async function storeTransaction({provider, provider_id, payer_email, amount, currency}){
  const obj = { id: Date.now() + '-' + Math.random().toString(36).slice(2,8), provider, provider_id, payer_email, amount, currency, created_at: new Date().toISOString() }
  let arr = []
  try { if (fs.existsSync(PATH)) arr = JSON.parse(fs.readFileSync(PATH,'utf8')||'[]') } catch(e){}
  arr.unshift(obj)
  try { fs.writeFileSync(PATH, JSON.stringify(arr,null,2),'utf8') } catch(e){ console.error('store write err', e) }
  return obj
}
export async function readTransactions(){
  try{ if (fs.existsSync(PATH)) return JSON.parse(fs.readFileSync(PATH,'utf8')||'[]') }catch(e){}
  return []
}
