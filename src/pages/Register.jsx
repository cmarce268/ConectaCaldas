import { useState } from 'react'
import { supabase } from '../services/supabase'

function Register() {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  const [ciudad, setCiudad] = useState('Manizales')
  const [barrio, setBarrio] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('cliente')

  async function handleRegister(e) {
    e.preventDefault()

    try {
      const { data, error } = await supabase.auth.signUp({
        email: correo,
        password: password,
      })

      if (error) {
        alert(error.message)
        return
      }

      const user = data.user

      const { error: errorUsuario } = await supabase
        .from('usuarios')
        .insert([
          {
            id: user.id,
            nombre,
            apellido,
            telefono,
            ciudad,
            barrio,
            rol
          }
        ])

      if (errorUsuario) {
        alert(errorUsuario.message)
        return
      }

      alert('Usuario registrado correctamente')

      setNombre('')
      setApellido('')
      setTelefono('')
      setCiudad('Manizales')
      setBarrio('')
      setCorreo('')
      setPassword('')
      setRol('cliente')

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
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Barrio o zona"
          value={barrio}
          onChange={(e) => setBarrio(e.target.value)}
        />

        <br /><br />

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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