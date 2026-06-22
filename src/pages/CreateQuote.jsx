import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function CreateQuote() {

  const { id } = useParams()
  const navigate = useNavigate()
  const { session } = useContext(AuthContext)

  const [valor, setValor] = useState('')
  const [mensaje, setMensaje] = useState('')

  async function guardarCotizacion(e) {

    e.preventDefault()

    const { error } = await supabase
      .from('cotizaciones')
      .insert([
        {
          solicitud_id: id,
          prestador_id: session.user.id,
          valor,
          mensaje,
          estado: 'enviada'
        }
      ])

    if (error) {
      alert(error.message)
      return
    }

    alert('Cotización enviada correctamente')

    navigate('/solicitudes-disponibles')
  }

  return (
    <div>

      <h1>Enviar Cotización</h1>

      <form onSubmit={guardarCotizacion}>

        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Mensaje para el cliente"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">
          Enviar Cotización
        </button>

      </form>

    </div>
  )
}

export default CreateQuote