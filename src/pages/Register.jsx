import { useState } from 'react'
import { supabase } from '../services/supabase'

function Register() {

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('cliente')

  async function handleRegister(e) {
    e.preventDefault()

    try {

      // 1. Crear usuario en Auth
      const { data, error } = await supabase.auth.signUp({
        email: correo,
        password: password,
      })

      if (error) {
        alert(error.message)
        return
      }

      const user = data.user

      // 2. Guardar datos adicionales
      const { error: errorUsuario } = await supabase
        .from('usuarios')
        .insert([
          {
            id: user.id,
            nombre,
            apellido,
            telefono,
            rol
          }
        ])

      if (errorUsuario) {
        alert(errorUsuario.message)
        return
      }

      alert('Usuario registrado correctamente')

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>

      <h1>Registro</h1>

      <form onSubmit={handleRegister}>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <br /><br />

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

        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          <option value="cliente">Cliente</option>
          <option value="prestador">Prestador</option>
        </select>

        <br /><br />

        <button type="submit">
          Registrarse
        </button>

      </form>

    </div>
  )
}

export default Register