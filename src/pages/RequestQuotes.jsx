import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { AuthContext } from '../context/AuthContext'

function RequestQuotes() {
  const { id } = useParams()
  const { session } = useContext(AuthContext)

  const [cotizaciones, setCotizaciones] = useState([])
  const [mostrarCalificacion, setMostrarCalificacion] = useState(null)
  const [puntuacion, setPuntuacion] = useState(5)
  const [comentario, setComentario] = useState('')

  useEffect(() => {
    cargarCotizaciones()
  }, [])

  async function cargarCotizaciones() {
    const { data, error } = await supabase
      .from('cotizaciones')
      .select(`
        *,
        prestador:usuarios!cotizaciones_prestador_id_fkey(
          nombre,
          apellido,
          telefono,
          foto_url,
          verificado
        )
      `)
      .eq('solicitud_id', id)

    if (error) {
      alert(error.message)
      return
    }

    const cotizacionesConCalificacion = await Promise.all(
      data.map(async (cotizacion) => {
        const { data: calificaciones } = await supabase
          .from('calificaciones')
          .select('puntuacion')
          .eq('prestador_id', cotizacion.prestador_id)

        let promedio = 0
        let totalCalificaciones = 0

        if (calificaciones && calificaciones.length > 0) {
          totalCalificaciones = calificaciones.length
          const suma = calificaciones.reduce(
            (total, item) => total + item.puntuacion,
            0
          )
          promedio = (suma / totalCalificaciones).toFixed(1)
        }

        return {
          ...cotizacion,
          promedio,
          totalCalificaciones
        }
      })
    )

    setCotizaciones(cotizacionesConCalificacion)
  }

  async function aceptarCotizacion(cotizacionId) {
    const { error: errorAceptar } = await supabase
      .from('cotizaciones')
      .update({ estado: 'aceptada' })
      .eq('id', cotizacionId)

    if (errorAceptar) {
      alert(errorAceptar.message)
      return
    }

    const { error: errorRechazar } = await supabase
      .from('cotizaciones')
      .update({ estado: 'rechazada' })
      .eq('solicitud_id', id)
      .neq('id', cotizacionId)

    if (errorRechazar) {
      alert(errorRechazar.message)
      return
    }

    const { error: errorSolicitud } = await supabase
      .from('solicitudes')
      .update({ estado: 'aceptada' })
      .eq('id', id)

    if (errorSolicitud) {
      alert(errorSolicitud.message)
      return
    }

    alert('Cotización aceptada correctamente')
    cargarCotizaciones()
  }

  async function marcarServicioRealizado(cotizacionId) {
    const { error } = await supabase
      .from('cotizaciones')
      .update({ estado: 'completada' })
      .eq('id', cotizacionId)

    if (error) {
      alert(error.message)
      return
    }

    alert('Servicio marcado como realizado')
    cargarCotizaciones()
  }

  async function guardarCalificacion(cotizacion) {
    if (!session) {
      alert('Debes iniciar sesión para calificar')
      return
    }

    const { data: existente } = await supabase
      .from('calificaciones')
      .select('id')
      .eq('solicitud_id', cotizacion.solicitud_id)
      .eq('cliente_id', session.user.id)
      .eq('prestador_id', cotizacion.prestador_id)
      .maybeSingle()

    if (existente) {
      alert('Ya calificaste este servicio')
      return
    }

    const { error } = await supabase
      .from('calificaciones')
      .insert([
        {
          solicitud_id: cotizacion.solicitud_id,
          cliente_id: session.user.id,
          prestador_id: cotizacion.prestador_id,
          puntuacion,
          comentario
        }
      ])

    if (error) {
      alert(error.message)
      return
    }

    alert('Calificación guardada correctamente')
    setMostrarCalificacion(null)
    setPuntuacion(5)
    setComentario('')
    cargarCotizaciones()
  }

  return (
    <div>
      <h1>Cotizaciones recibidas</h1>

      {cotizaciones.length === 0 ? (
        <p>No hay cotizaciones</p>
      ) : (
        cotizaciones.map((cotizacion) => (
          <div
            key={cotizacion.id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px'
            }}
          >
            <h3>
              Prestador: {cotizacion.prestador?.nombre}{' '}
              {cotizacion.prestador?.apellido}
            </h3>

            {cotizacion.prestador?.foto_url ? (
              <img
                src={cotizacion.prestador.foto_url}
                alt="Prestador"
                width="80"
                style={{ borderRadius: '50%' }}
              />
            ) : (
              <p>Sin foto de perfil</p>
            )}

            {cotizacion.prestador?.verificado ? (
              <p style={{ color: 'green' }}>✅ Prestador verificado</p>
            ) : (
              <p style={{ color: 'orange' }}>
                ⏳ Prestador pendiente de verificación
              </p>
            )}

            {cotizacion.totalCalificaciones > 0 ? (
              <p>
                ⭐ {cotizacion.promedio} / 5 - {cotizacion.totalCalificaciones}{' '}
                opinión(es)
              </p>
            ) : (
              <p>⭐ Sin calificaciones todavía</p>
            )}

            <p>Valor: ${cotizacion.valor}</p>
            <p>Mensaje: {cotizacion.mensaje}</p>
            <p>Estado: {cotizacion.estado}</p>

            <button
              onClick={() =>
                window.location.href = `/perfil-prestador/${cotizacion.prestador_id}`
              }
            >
              Ver perfil
            </button>

            {' '}

            {cotizacion.estado === 'enviada' && (
              <button onClick={() => aceptarCotizacion(cotizacion.id)}>
                Aceptar cotización
              </button>
            )}

            {cotizacion.estado === 'aceptada' && (
              <div>
                <p>El servicio fue aceptado.</p>

                <button onClick={() => marcarServicioRealizado(cotizacion.id)}>
                  Marcar servicio como realizado
                </button>
              </div>
            )}

            {cotizacion.estado === 'completada' && (
              <div>
                <p>Servicio realizado.</p>

                <button onClick={() => setMostrarCalificacion(cotizacion.id)}>
                  Calificar prestador
                </button>

                {mostrarCalificacion === cotizacion.id && (
                  <div style={{ marginTop: '10px' }}>
                    <p>Puntuación</p>

                    <select
                      value={puntuacion}
                      onChange={(e) => setPuntuacion(Number(e.target.value))}
                    >
                      <option value={5}>5 - Excelente</option>
                      <option value={4}>4 - Muy bueno</option>
                      <option value={3}>3 - Bueno</option>
                      <option value={2}>2 - Regular</option>
                      <option value={1}>1 - Malo</option>
                    </select>

                    <br />
                    <br />

                    <textarea
                      placeholder="Escribe un comentario sobre el servicio"
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      rows="4"
                      cols="40"
                    />

                    <br />
                    <br />

                    <button onClick={() => guardarCalificacion(cotizacion)}>
                      Guardar calificación
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default RequestQuotes