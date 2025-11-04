import Link from 'next/link'
export default function Home(){
  return (
    <div className="container">
      <div className="card">
        <h1>Infinite SaaS — Ultra Premium</h1>
        <p className="small">Ready for Vercel — PayPal, UPI, Supabase, AdSense integrated (placeholders).</p>
        <ul>
          <li><Link href='/checkout'><a>Checkout (PayPal / UPI)</a></Link></li>
          <li><Link href='/admin'><a>Admin (transactions)</a></Link></li>
        </ul>
      </div>
    </div>
  )
}
