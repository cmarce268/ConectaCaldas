import { useState, useEffect, useContext } from 'react'
import { supabase } from '../services/supabase'
import { AuthContext } from '../context/AuthContext'

function CreateService() {
  const { session } = useContext(AuthContext)

  const [categorias, setCategorias] = useState([])
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [precioBase, setPrecioBase] = useState('')

  useEffect(() => {
    cargarCategorias()
  }, [])

  async function cargarCategorias() {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('activa', true)
      .order('nombre')

    if (!error) {
      setCategorias(data)
    }
  }

  async function guardarServicio(e) {
    e.preventDefault()

    if (!session) {
      alert('Debes iniciar sesión para crear un servicio')
      return
    }

    const { error } = await supabase
      .from('servicios')
      .insert([
        {
          usuario_id: session.user.id,
          categoria_id: Number(categoriaId),
          titulo,
          descripcion,
          precio_base: Number(precioBase),
          disponible: true
        }
      ])

    if (error) {
      alert(error.message)
      return
    }

    alert('Servicio creado correctamente')

    setTitulo('')
    setDescripcion('')
    setCategoriaId('')
    setPrecioBase('')
  }

  return (
    <div>
      <h1>Crear Servicio</h1>

      <form onSubmit={guardarServicio}>
        <input
          type="text"
          placeholder="Título del servicio"
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
          type="number"
          placeholder="Precio base"
          value={precioBase}
          onChange={(e) => setPrecioBase(e.target.value)}
          required
        />

        <br /><br />

        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          required
        >
          <option value="">Seleccione categoría</option>

          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>

        <br /><br />

        <button type="submit">Guardar servicio</button>
      </form>
    </div>
  )
}

export default CreateService