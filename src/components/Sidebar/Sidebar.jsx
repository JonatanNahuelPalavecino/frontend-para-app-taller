import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import { options } from './options';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../Context/Context';
import { Button } from '@mui/material';
import logo from "../../assets/images/logo.png";
import HomeIcon from '@mui/icons-material/Home';

const Sidebar = ({ open, fn }) => {

  const navigate = useNavigate();
  const { user } = useContext(Context);

  const DrawerList = (
    <Box sx={{ width: 250, height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }} role="presentation" onClick={fn}>
      <Box>
        <img src={logo} className='w-[100px] h-[75px] object-cover m-4' alt="Logo" />
        <List>
          {user ? (
            options.map((option) => (
              <ListItem key={option.title} disablePadding>
                <ListItemButton onClick={() => navigate(option.href)}>
                  <ListItemIcon>
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText primary={option.title} />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem key="Inicio" disablePadding>
              <ListItemButton onClick={() => navigate("/")}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Inicio" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <Divider />
      </Box>
      {!user && (
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/")}
            sx={{ mt: 1, mb: 1 }}
          >
            Inicia Sesión
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/registrarse")}
            sx={{ mt: 1, mb: 1 }}
          >
            Regístrate
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer open={open} onClose={fn}>
      {DrawerList}
    </Drawer>
  );

}

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  fn: PropTypes.func.isRequired
}

export default Sidebar;
