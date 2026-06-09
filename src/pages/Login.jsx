import { useState } from 'react'
import { supabase } from '../services/supabase'

function Login() {

  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e) {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password,
    })

    if (error) {
      alert(error.message)
      return
    }

    alert('Inicio de sesión correcto')
    window.location.href = '/'
  }

  return (
    <div>

      <h1>Login</h1>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Ingresar
        </button>

      </form>

    </div>
  )
}

export default Login