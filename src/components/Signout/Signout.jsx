// import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifyError, notifySuccess } from '../Notificacion/Notificacion';
import { Context } from '../Context/Context';

export default function SignUp() {

  const [seePass, setSeePass] = useState(false)
  const {user, setUser, setLoading, verifyToken} = useContext(Context)
  const url = import.meta.env.VITE_SERVER
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Registrate - App G.O.R"

    const userIsLogin = async () => {
            
      if (user) {
          const result = await verifyToken();
          result && navigate("/dashboard");
      } 
  }

  userIsLogin()
  }, [user, verifyToken, navigate])

  const handlePass = (e) => {
    setSeePass(e.target.checked)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formValue = new FormData(event.currentTarget);

    setLoading(true)

    try {
      const response = await fetch(`${url}/auth/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: formValue.get("firstName"),
            email: formValue.get('email'),
            password: formValue.get('password')
        })
      })

      const data = await response.json()      

      if (data.estado === "error") {
        notifyError(data.mensaje)
      } else {
        notifySuccess(data.mensaje)        
        
        setUser({
            id: data.userId,
            nombre: data.userName,
            token: data.token,
            auth: data.auth
        })

        localStorage.setItem("user", JSON.stringify(user))

        navigate("/dashboard")
      }

    } catch (error) {
      notifyError("Hubo un error en el sistema.")
      console.log(error);
      
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs" sx={{height: "80vh"}}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Crea tu usuario
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Nombre"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Apellido"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type={seePass ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox color="primary" onClick={handlePass}/>}
                  label="ver contraseña"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrate
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link onClick={() => navigate("/")} variant="body2" className='cursor-pointer'>
                  ¿Tenes cuenta? Inicia Sesión
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}