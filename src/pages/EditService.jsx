import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

function EditService() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precioBase, setPrecioBase] = useState('')

  useEffect(() => {
    cargarServicio()
  }, [])

  async function cargarServicio() {

    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('id', id)
      .single()

    if (!error) {
      setTitulo(data.titulo)
      setDescripcion(data.descripcion)
      setPrecioBase(data.precio_base)
    }
  }

  async function actualizarServicio(e) {

    e.preventDefault()

    const { error } = await supabase
      .from('servicios')
      .update({
        titulo,
        descripcion,
        precio_base: precioBase
      })
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    alert('Servicio actualizado correctamente')

    navigate('/mis-servicios')
  }

  return (
    <div>

      <h1>Editar Servicio</h1>

      <form onSubmit={actualizarServicio}>

        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <br /><br />

        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          value={precioBase}
          onChange={(e) => setPrecioBase(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Guardar cambios
        </button>

      </form>

    </div>
  )
}

export default EditService