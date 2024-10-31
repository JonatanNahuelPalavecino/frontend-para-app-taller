import ImportExportIcon from '@mui/icons-material/ImportExport';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import PaymentIcon from '@mui/icons-material/Payment';
import HomeIcon from '@mui/icons-material/Home';

export const options = [
    {
      title: "Inicio", 
      icon: <HomeIcon/>,
      href: "/dashboard"
    }, 
    {
      title: "Crear Movimiento",
      icon: <AddIcon/>,
      href: "/movimiento/crear-movimiento"
    },
    {
      title: "Ver Movimientos",
      icon: <ImportExportIcon/>,
      href: "/ver-movimientos/1"
    },
    {
      title: "Crear Pedido",
      icon: <LocalShippingIcon/>,
      href: "/pedido/crear-pedido"
    },
    {
      title: "Ver Pedidos",
      icon:  <SearchIcon/>,
      href: "/ver-pedidos/1"
    },
    {
      title: "Actualizar Equipos",
      icon: <RotateLeftIcon/>,
      href: "/actualizar-equipos"
    },
    {
      title: "Ingresar Cobranzas",
      icon: <PaymentIcon/>,
      href: "/ingresar-cobranzas"
    },
    {
      title: "Ver Cobranzas",
      icon: <SearchIcon/>,
      href: "/ver-cobranzas/1"
    }
  ]