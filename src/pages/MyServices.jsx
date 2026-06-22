import { useEffect, useState, useContext } from 'react'
import { supabase } from '../services/supabase'
import { AuthContext } from '../context/AuthContext'

function MyServices() {

  const { session } = useContext(AuthContext)

  const [servicios, setServicios] = useState([])

  useEffect(() => {
    if (session) {
      cargarServicios()
    }
  }, [session])

  async function cargarServicios() {

    const { data, error } = await supabase
      .from('servicios')
      .select(`
        *,
        categorias(nombre)
      `)
      .eq('usuario_id', session.user.id)
       .eq('activo', true)

    if (!error) {
      setServicios(data)
    }
  }

  return (
    <div>

      <h1>Mis Servicios</h1>

      {servicios.length === 0 ? (
        <p>No tienes servicios registrados</p>
      ) : (
        servicios.map((servicio) => (
          <div
            key={servicio.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px'
            }}
          >
            <h3>{servicio.titulo}</h3>

            <p>{servicio.descripcion}</p>

            <p>
              Categoría:
              {' '}
              {servicio.categorias?.nombre}
            </p>

            <p>
              Precio base:
              {' '}
              ${servicio.precio_base}
            </p>

            <button
            onClick={() => window.location.href = `/editar-servicio/${servicio.id}`}
            >
             Editar
            </button>

            {' '}
            <button
            onClick={() => desactivarServicio(servicio.id)}
            >
             Desactivar
            </button>
            

          </div>
        ))
      )}

    </div>
  )

  async function desactivarServicio(id) {

  const { error } = await supabase
    .from('servicios')
    .update({ activo: false })
    .eq('id', id)

  if (error) {
    alert(error.message)
    return
  }

  alert('Servicio desactivado')

  cargarServicios()
}
}

export default MyServices