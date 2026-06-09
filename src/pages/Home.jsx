import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { supabase } from '../services/supabase'

function Home() {

  const { session } = useContext(AuthContext)

  async function cerrarSesion() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div>

      <h1>Inicio ConectaCaldas</h1>

      {
        session ? (
          <div>

            <h2>Sesión iniciada</h2>

            <p>
              {session.user.email}
            </p>

            <button onClick={cerrarSesion}>
              Cerrar sesión
            </button>

          </div>
        ) : (
          <h2>No hay sesión</h2>
        )
      }

    </div>
  )
}

export default Home