import { useEffect, useState, useContext } from 'react'
import { supabase } from '../services/supabase'
import { AuthContext } from '../context/AuthContext'

function MyRequests() {
  const { session } = useContext(AuthContext)
  const [solicitudes, setSolicitudes] = useState([])

  useEffect(() => {
    if (session) {
      cargarSolicitudes()
    }
  }, [session])

  async function cargarSolicitudes() {
    const { data, error } = await supabase
      .from('solicitudes')
      .select(`
        *,
        categorias(nombre)
      `)
      .eq('cliente_id', session.user.id)
      .order('creado_en', { ascending: false })

    if (error) {
      alert(error.message)
      return
    }

    setSolicitudes(data)
  }

  return (
    <div>
      <h1>Mis Solicitudes</h1>

      {solicitudes.length === 0 ? (
        <p>No tienes solicitudes creadas</p>
      ) : (
        solicitudes.map((solicitud) => (
          <div
            key={solicitud.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px'
            }}
          >
            <h3>{solicitud.titulo}</h3>
            <p>{solicitud.descripcion}</p>
            <p>Dirección: {solicitud.direccion}</p>
            <p>Categoría: {solicitud.categorias?.nombre}</p>
            <p>Estado: {solicitud.estado}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default MyRequests