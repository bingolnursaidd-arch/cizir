export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'E-posta ve doğrulama kodu gereklidir.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Cizre Ejderi - Doğrulama Kodunuz',
        html: `<div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #fff; border-radius: 8px;">
                <h2 style="color: #f59e0b;">Cizre Ejderi Portal</h2>
                <p>Kayıt işlemini tamamlamak için doğrulama kodunuz:</p>
                <h1 style="font-size: 32px; letter-spacing: 5px; color: #10b981;">${code}</h1>
               </div>`,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(400).json({ error: data.message || 'Mail gönderilemedi.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}
