import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { supabase } from '../services/supabase'

function Navbar() {
  const { session } = useContext(AuthContext)
  const [usuario, setUsuario] = useState(null)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    cargarUsuario()
  }, [session])

  async function cargarUsuario() {
    if (!session) return

    const { data } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', session.user.id)
      .single()

    setUsuario(data)
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <header className="app-navbar">
      <Link to="/" className="app-logo">
        Conecta<span>Caldas</span>
      </Link>

      <div className="app-links">
        <Link to="/">Inicio</Link>

        {session && (
          <>
            <Link to="/crear-solicitud">Solicitar</Link>
            <Link to="/mis-solicitudes">Mis solicitudes</Link>
            <Link to="/crear-servicio">Crear servicio</Link>
            <Link to="/mis-servicios">Mis servicios</Link>
            <Link to="/solicitudes-disponibles">Solicitudes</Link>
          </>
        )}
      </div>

      {session && usuario ? (
        <div className="app-user">
          <button
            className="app-user-button"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {usuario.foto_url ? (
              <img
                src={usuario.foto_url}
                alt="Usuario"
                className="app-user-img"
              />
            ) : (
              <span className="app-user-avatar">👤</span>
            )}

            <span>{usuario.nombre}</span>
            <span>▼</span>
          </button>

          {menuAbierto && (
            <div className="app-dropdown">
              <Link to="/perfil">Mi perfil</Link>
              <button onClick={cerrarSesion}>Cerrar sesión</button>
            </div>
          )}
        </div>
      ) : (
        <div className="app-auth">
          <Link to="/login">Ingresar</Link>
          <Link to="/registro">Registrarse</Link>
        </div>
      )}
    </header>
  )
}

export default Navbar