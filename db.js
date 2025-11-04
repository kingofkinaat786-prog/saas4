import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
const SUPA_URL = process.env.SUPABASE_URL
const SUPA_KEY = process.env.SUPABASE_KEY
const LOCAL = !SUPA_URL || !SUPA_KEY
let supa = null
if (!LOCAL) {
  const { createClient } = require('@supabase/supabase-js')
}
export async function storeTransaction({provider, provider_id, payer_email, amount, currency}){
  if (!LOCAL) {
    try {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
      const { data, error } = await supabase.from('transactions').insert([{ provider, provider_id, payer_email, amount, currency }])
      if (error) throw error
      return data
    } catch(e){
      console.error('supabase store err', e)
    }
  }
  // fallback to local JSON
  const PATH = process.env.STORE_PATH || '/tmp/transactions.json'
  const obj = { id: Date.now() + '-' + Math.random().toString(36).slice(2,8), provider, provider_id, payer_email, amount, currency, created_at: new Date().toISOString() }
  let arr = []
  try { if (fs.existsSync(PATH)) arr = JSON.parse(fs.readFileSync(PATH,'utf8')||'[]') } catch(e){}
  arr.unshift(obj)
  try { fs.writeFileSync(PATH, JSON.stringify(arr,null,2),'utf8') } catch(e){ console.error('store write err', e) }
  return obj
}
