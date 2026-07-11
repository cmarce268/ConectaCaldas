import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { supabase } from '../services/supabase'

function Home() {
  const { session } = useContext(AuthContext)

  async function cerrarSesion() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="page-container">
      <section className="hero">
        <h1>
          Conecta<strong>Caldas</strong>
        </h1>

        <p>
          Encuentra servicios locales confiables, recibe cotizaciones y conecta
          con prestadores verificados cerca de ti.
        </p>

        {session ? (
          <div className="actions">
            <Link to={session ? "/crear-solicitud" : "/registro"}>
              <button className="button-primary">Crear solicitud</button>
            </Link>

            <Link to={session ? "/mis-solicitudes" : "/registro"}>
              <button className="button-secondary">Ver solicitudes</button>
            </Link>
          </div>
        ) : (
          <div className="actions">
            <Link to="/login">
              <button className="button-primary">Iniciar sesión</button>
            </Link>

            <Link to="/register">
              <button className="button-secondary">Registrarse</button>
            </Link>
          </div>
        )}
      </section>

      <section className="cards-grid">
        <div className="card">
          <h3>Publica lo que necesitas</h3>
          <p>
            Crea una solicitud y recibe cotizaciones de prestadores locales.
          </p>
          <Link to={session ? "/crear-solicitud" : "/registro"}>
            <button className="button-primary">Crear solicitud</button>
          </Link>
        </div>

        <div className="card">
          <h3>Compara cotizaciones</h3>
          <p>
            Revisa precios, perfil, foto, calificaciones y verificación del prestador.
          </p>
          <Link to={session ? "/mis-solicitudes" : "/registro"}>
            <button className="button-secondary">Mis solicitudes</button>
          </Link>
        </div>

        <div className="card">
          <h3>Ofrece tus servicios</h3>
          <p>
            Registra tus servicios, recibe oportunidades y construye reputación.
          </p>
          <Link to={session ? "/crear-servicio" : "/registro"}>
            <button className="button-secondary">Crear servicio</button>
          </Link>
        </div>
      </section>

      <section className="cards-grid">
        <div className="card">
          <h3>Confianza</h3>
          <p>
            Prestadores con foto, calificaciones reales y estado de verificación.
          </p>
        </div>

        <div className="card">
          <h3>Comunidad local</h3>
          <p>
            Una plataforma pensada para conectar personas y servicios en Caldas.
          </p>
        </div>

        <div className="card">
          <h3>Todo en un lugar</h3>
          <p>
            Solicitudes, cotizaciones, servicios, perfiles y calificaciones organizados.
          </p>
        </div>
      </section>
        <section className="como-funciona">

  <h2>¿Cómo funciona?</h2>

  <div className="pasos">

    <div className="paso">
      <div className="numero">1</div>
      <h3>Publica tu necesidad</h3>
      <p>
        Describe el servicio que necesitas y tu ubicación.
      </p>
    </div>

    <div className="paso">
      <div className="numero">2</div>
      <h3>Recibe cotizaciones</h3>
      <p>
        Prestadores locales te enviarán sus propuestas.
      </p>
    </div>

    <div className="paso">
      <div className="numero">3</div>
      <h3>Compara opciones</h3>
      <p>
        Revisa precios, perfiles, fotos y calificaciones.
      </p>
    </div>

    <div className="paso">
      <div className="numero">4</div>
      <h3>Contrata con confianza</h3>
      <p>
        Elige la mejor opción y califica el servicio.
      </p>
    </div>

  </div>

</section>


       </div>
  )
}

export default Home