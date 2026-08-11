'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [tel, setTel] = useState('01010101');
  const [mdp, setMdp] = useState('admin123');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({telephone: tel, mot_de_passe: mdp})
    });
    if(res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } else alert('Erreur de connexion')
  }
  return <div className="p-10"><h1>Login Canal</h1><input value={tel} onChange={e=>setTel(e.target.value)}/><input type="password" value={mdp} onChange={e=>setMdp(e.target.value)}/><button onClick={handleLogin}>Se connecter</button></div>
}
