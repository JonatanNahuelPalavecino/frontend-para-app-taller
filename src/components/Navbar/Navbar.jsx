import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useContext, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import logo from "../../assets/images/logo.png";
import { Context } from '../Context/Context';
import { notifySuccess } from '../Notificacion/Notificacion';
import { useNavigate } from 'react-router-dom';

export default function MenuAppBar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { setLoading, user, setUser } = useContext(Context);
  const navigate = useNavigate()

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogOut = () => {
    setLoading(true);
    setMenuOpen(false);
    setTimeout(() => {
      navigate("/")
      setUser(null);
      notifySuccess("Sesión Cerrada");
      setLoading(false);
    }, 2000);
  };

  const handleSidebar = () => {
    setOpen(!open);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleSidebar}
            >
              <MenuIcon />
            </IconButton>
            <img src={logo} className='w-[100px] h-[75px] object-cover mr-4'/>
            <div style={{ flexGrow: 1 }}>
              <Typography sx={{maxWidth: "300px"}}>
                Sistema Integral de Equipos y Movimientos
              </Typography>
            </div>
            {user && (
              <div className='flex items-center'>
                <Typography component="span" mx={1}>
                  Bienvenido {user.nombre}
                </Typography>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuClick}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={menuOpen}
                  onClose={handleMenuClick}
                >
                  <MenuItem onClick={handleLogOut}>Cerrar Sesión</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Sidebar open={open} fn={handleSidebar} />
    </>
  );
}
