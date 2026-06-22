import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import CreateService from '../pages/CreateService'
import MyServices from '../pages/MyServices'
import EditService from '../pages/EditService'
import CreateRequest from '../pages/CreateRequest'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/crear-servicio" element={<CreateService />} />
        <Route path="/mis-servicios" element={<MyServices />} />
        <Route path="/editar-servicio/:id" element={<EditService />} />
        <Route path="/crear-solicitud" element={<CreateRequest />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes