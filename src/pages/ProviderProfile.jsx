import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../services/supabase'

function ProviderProfile() {
  const { id } = useParams()
  const [prestador, setPrestador] = useState(null)
  const [calificaciones, setCalificaciones] = useState([])
  const [promedio, setPromedio] = useState(0)

  useEffect(() => {
    cargarPrestador()
    cargarCalificaciones()
  }, [])

  async function cargarPrestador() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      alert(error.message)
      return
    }

    setPrestador(data)
  }

  async function cargarCalificaciones() {
    const { data, error } = await supabase
      .from('calificaciones')
      .select('*')
      .eq('prestador_id', id)

    if (error) {
      alert(error.message)
      return
    }

    setCalificaciones(data)

    if (data.length > 0) {
      const suma = data.reduce((total, item) => total + item.puntuacion, 0)
      const promedioCalculado = suma / data.length
      setPromedio(promedioCalculado.toFixed(1))
    }
  }

  if (!prestador) {
    return <p>Cargando perfil...</p>
  }

  return (
    <div>
      <h1>Perfil del prestador</h1>

      {prestador.foto_url ? (
        <img
          src={prestador.foto_url}
          alt="Foto del prestador"
          width="100"
          style={{ borderRadius: '50%' }}
        />
      ) : (
        <p>Sin foto de perfil</p>
      )}

      <h2>
        {prestador.nombre} {prestador.apellido}
      </h2>

      <p>✅ Prestador verificado</p>

      <p>Ciudad: {prestador.ciudad}</p>

      <p>Barrio/Zona: {prestador.barrio || 'No registrado'}</p>

      <h3>Calificación</h3>

      {calificaciones.length > 0 ? (
        <p>
          ⭐ {promedio} / 5 - {calificaciones.length} calificación(es)
        </p>
      ) : (
        <p>Este prestador aún no tiene calificaciones.</p>
      )}

      <h3>Comentarios</h3>

      {calificaciones.length > 0 ? (
        calificaciones.map((calificacion) => (
          <div
            key={calificacion.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '8px'
            }}
          >
            <p>Puntuación: ⭐ {calificacion.puntuacion} / 5</p>
            <p>{calificacion.comentario || 'Sin comentario'}</p>
          </div>
        ))
      ) : (
        <p>No hay comentarios todavía.</p>
      )}

      <p>
        Información adicional del prestador y experiencia se agregará más adelante.
      </p>

      <button onClick={() => window.history.back()}>
        Volver
      </button>
    </div>
  )
}

export default ProviderProfile