import { useState } from 'react'
export default function Checkout(){
  const [amount, setAmount] = useState('1.00')
  const [qr, setQr] = useState(null)
  const createUpi = async ()=>{
    const res = await fetch('/api/upi/create', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({amount, note:'Purchase from Infinite SaaS'})})
    const data = await res.json()
    setQr(data.qrDataUrl)
  }
  return (
    <div className="container">
      <div className="card">
        <h1>Checkout — Ultra Premium</h1>
        <div style={{display:'flex',gap:20}}>
          <div style={{flex:1}}>
            <h3>Pay with PayPal</h3>
            <p className="small">Secure Smart Buttons (sandbox client id in env)</p>
            <input className="input" value={amount} onChange={e=>setAmount(e.target.value)} />
            <div id="paypal-buttons" style={{marginTop:12}}></div>
            <script dangerouslySetInnerHTML={{__html: `(function(){
              const clientId = "${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''}";
              const currency = "USD";
              if (!window.paypal && clientId){
                const s = document.createElement('script');
                s.src = "https://www.paypal.com/sdk/js?client-id="+clientId+"&currency="+currency;
                s.onload = () => { renderButtons(); };
                document.body.appendChild(s);
              } else { renderButtons(); }
              function renderButtons(){
                if (!window.paypal) return;
                window.paypal.Buttons({
                  createOrder: function() {
                    return fetch('/api/paypal/create-order', {
                      method:'POST', headers:{'Content-Type':'application/json'},
                      body: JSON.stringify({ amount: document.querySelector('input').value || '1.00', currency: 'USD' })
                    }).then(res=>res.json()).then(data=>data.id);
                  },
                  onApprove: function(data){
                    return fetch('/api/paypal/capture-order', {
                      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ orderID: data.orderID })
                    }).then(res=>res.json()).then(res=>{ alert('Payment captured') })
                  }
                }).render('#paypal-buttons');
              }
            })();`}} />
          </div>
          <div style={{width:320}}>
            <h3>Pay with UPI (India)</h3>
            <input className="input" value={amount} onChange={e=>setAmount(e.target.value)} />
            <button className="button" onClick={createUpi} style={{marginTop:8}}>Generate UPI QR</button>
            {qr && <div style={{marginTop:12}}><img src={qr} alt="UPI QR" style={{width:220}}/></div>}
            <div style={{marginTop:18}}>
              <h4 className="small">Direct Links</h4>
              <a href={process.env.NEXT_PUBLIC_PERSONAL_PAYMENT_LINK_UPI || '#'}>Pay via UPI</a><br/>
              <a href={process.env.NEXT_PUBLIC_PERSONAL_PAYMENT_LINK_PAYPALME || '#'} target="_blank" rel="noreferrer">Pay via PayPal.me</a>
            </div>
          </div>
        </div>

        <div style={{marginTop:20}}>
          <h4>AdSense</h4>
          <p className="small">AdSense will show after you replace the publisher id and site is approved.</p>
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
          <ins className="adsbygoogle" style={{display:'block'}} data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true"></ins>
          <script dangerouslySetInnerHTML={{__html: `(adsbygoogle = window.adsbygoogle || []).push({});`}} />
        </div>
      </div>
    </div>
  )
}
