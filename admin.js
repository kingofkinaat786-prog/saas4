import { useEffect, useState } from 'react'
export default function Admin(){
  const [rows, setRows] = useState([])
  useEffect(()=>{ fetch('/api/admin/transactions', { headers: { Authorization: 'Basic ' + btoa((process.env.NEXT_PUBLIC_ADMIN_USER || 'admin') + ':' + (process.env.NEXT_PUBLIC_ADMIN_PASS || 'change_me')) } }).then(r=>r.json()).then(d=>setRows(d.rows||[])).catch(()=>{}) },[])
  return (
    <div className="container">
      <div className="card">
        <h1>Admin — Transactions</h1>
        <table className="table"><thead><tr><th>ID</th><th>Provider</th><th>Amount</th><th>Currency</th><th>Time</th></tr></thead>
        <tbody>{rows.map(r=>(
          <tr key={r.id}><td>{r.id}</td><td>{r.provider}</td><td>{r.amount}</td><td>{r.currency}</td><td>{r.created_at}</td></tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
