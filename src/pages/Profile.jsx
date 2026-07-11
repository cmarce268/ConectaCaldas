import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { supabase } from '../services/supabase'

function Profile() {
  const { session } = useContext(AuthContext)
  const [usuario, setUsuario] = useState(null)
  const [archivo, setArchivo] = useState(null)
  const [subiendo, setSubiendo] = useState(false)

  useEffect(() => {
    cargarUsuario()
  }, [session])

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

  async function subirFoto() {
    if (!archivo) {
      alert('Selecciona una imagen primero')
      return
    }

    setSubiendo(true)

    const extension = archivo.name.split('.').pop()
    const nombreArchivo = `${session.user.id}-${Date.now()}.${extension}`

    const { error: errorUpload } = await supabase.storage
      .from('perfiles')
      .upload(nombreArchivo, archivo)

    if (errorUpload) {
      alert(errorUpload.message)
      setSubiendo(false)
      return
    }

    const { data } = supabase.storage
      .from('perfiles')
      .getPublicUrl(nombreArchivo)

    const fotoUrl = data.publicUrl

    const { error: errorUpdate } = await supabase
      .from('usuarios')
      .update({ foto_url: fotoUrl })
      .eq('id', session.user.id)

    if (errorUpdate) {
      alert(errorUpdate.message)
      setSubiendo(false)
      return
    }

    alert('Foto actualizada correctamente')
    setArchivo(null)
    setSubiendo(false)
    cargarUsuario()
  }

  if (!session) {
    return <h2>Debes iniciar sesión</h2>
  }

  return (
    <div>
      <h1>Mi perfil</h1>

      {usuario ? (
        <div>
          {usuario.foto_url ? (
            <img
              src={usuario.foto_url}
              alt="Foto de perfil"
              width="120"
              style={{ borderRadius: '50%' }}
            />
          ) : (
            <p>Sin foto de perfil</p>
          )}

          <br />
          <br />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setArchivo(e.target.files[0])}
          />

          <br />
          <br />

          <button onClick={subirFoto} disabled={subiendo}>
            {subiendo ? 'Subiendo...' : 'Subir foto'}
          </button>

          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Apellido:</strong> {usuario.apellido}</p>
          <p><strong>Teléfono:</strong> {usuario.telefono}</p>
          <p><strong>Rol:</strong> {usuario.rol}</p>
          <p><strong>Ciudad:</strong> {usuario.ciudad}</p>
          <p><strong>Barrio/Zona:</strong> {usuario.barrio || 'No registrado'}</p>
        </div>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  )
}

export default Profile