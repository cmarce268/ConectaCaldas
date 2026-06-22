import { useState, useEffect, useContext } from 'react'
import { supabase } from '../services/supabase'
import { AuthContext } from '../context/AuthContext'

function CreateRequest() {

  const { session } = useContext(AuthContext)

  const [categorias, setCategorias] = useState([])

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [direccion, setDireccion] = useState('')
  const [categoriaId, setCategoriaId] = useState('')

  useEffect(() => {
    cargarCategorias()
  }, [])

  async function cargarCategorias() {

    const { data } = await supabase
      .from('categorias')
      .select('*')
      .eq('activa', true)
      .order('nombre')

    setCategorias(data || [])
  }

  async function guardarSolicitud(e) {

    e.preventDefault()

    const { error } = await supabase
      .from('solicitudes')
      .insert([
        {
          cliente_id: session.user.id,
          categoria_id: categoriaId,
          titulo,
          descripcion,
          direccion,
          estado: 'pendiente'
        }
      ])

    if (error) {
      alert(error.message)
      return
    }

    alert('Solicitud creada correctamente')

    setTitulo('')
    setDescripcion('')
    setDireccion('')
    setCategoriaId('')
  }

  return (
    <div>

      <h1>Solicitar Servicio</h1>

      <form onSubmit={guardarSolicitud}>

        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
        />

        <br /><br />

        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          required
        >
          <option value="">
            Seleccione categoría
          </option>

          {categorias.map((categoria) => (
            <option
              key={categoria.id}
              value={categoria.id}
            >
              {categoria.nombre}
            </option>
          ))}
        </select>

        <br /><br />

        <button type="submit">
          Crear solicitud
        </button>

      </form>

    </div>
  )
}

export default CreateRequest