import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { supabase } from '../services/supabase'

function Profile() {
  const { session } = useContext(AuthContext)
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    async function cargarUsuario() {
      if (!session) return

      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error(error.message)
      } else {
        setUsuario(data)
      }
    }

    cargarUsuario()
  }, [session])

  if (!session) {
    return <h2>Debes iniciar sesión</h2>
  }

  return (
    <div>
      <h1>Mi perfil</h1>

      {usuario ? (
        <div>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Apellido:</strong> {usuario.apellido}</p>
          <p><strong>Teléfono:</strong> {usuario.telefono}</p>
          <p><strong>Rol:</strong> {usuario.rol}</p>
          <p><strong>Ciudad:</strong> {usuario.ciudad}</p>
        </div>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  )
}

export default Profile