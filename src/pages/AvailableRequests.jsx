import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

function AvailableRequests() {
  const [solicitudes, setSolicitudes] = useState([])

  useEffect(() => {
    cargarSolicitudes()
  }, [])

  async function cargarSolicitudes() {
    const { data, error } = await supabase
      .from('solicitudes')
      .select(`
        *,
        categorias(nombre)
      `)
      .eq('estado', 'pendiente')
      .order('creado_en', { ascending: false })

    if (error) {
      alert(error.message)
      return
    }

    setSolicitudes(data)
  }

  return (
    <div>
      <h1>Solicitudes disponibles</h1>

      {solicitudes.length === 0 ? (
        <p>No hay solicitudes disponibles</p>
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

            <button
             onClick={() => window.location.href = `/cotizar/${solicitud.id}`}
            >
            Cotizar
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default AvailableRequests