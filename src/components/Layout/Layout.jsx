import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../Login/Login"
import Dashboard from "../Dashboard/Dashboard"
import Signout from "../Signout/Signout"
import Navbar from "../Navbar/Navbar"
import Loading  from "../Loading/Loading"
import { useContext } from "react"
import { Context } from "../Context/Context"
import Footer from "../Footer/Footer"
import CrearMovimiento from "../Movimientos/CrearMovimiento"
import VerMovimientos from "../Movimientos/VerMovimientos"
import Pedidos from "../Pedidos/Pedidos"
import VerPedidos from "../Pedidos/VerPedidos"
import Equipos from "../Equipos/Equipos"
import CrearCobranza from "../Cobranzas/CrearCobranza"
import VerCobranzas from "../Cobranzas/VerCobranzas"

const Layout = () => {

  const {loading} = useContext(Context)

  return (
    <>
        <BrowserRouter>
        <Navbar/>
        <Loading loading={loading}/>
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/registrarse" element={<Signout/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/movimiento/:type" element={<CrearMovimiento/>}/>
            <Route path="/ver-movimientos/:page" element={<VerMovimientos/>}/>
            <Route path="/pedido/:type" element={<Pedidos/>}/>
            <Route path="/ver-pedidos/:page" element={<VerPedidos/>}/>
            <Route path="/actualizar-equipos" element={<Equipos/>}/>
            <Route path="/ingresar-cobranzas" element={<CrearCobranza/>}/>
            <Route path="/ver-cobranzas/:page" element={<VerCobranzas/>}/>
        </Routes>
        <Footer/>
        </BrowserRouter>
    </>
  )
}

export default Layout
