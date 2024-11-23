// import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import bg from "../../../public/images/mmmotif.svg"
import { useNavigate } from 'react-router-dom';
import { Context } from '../Context/Context';
import { notifyError, notifySuccess } from '../Notificacion/Notificacion';



export default function Login() {

    const [seePass, setSeePass] = useState(false)
    const {setLoading, user, setUser, verifyToken} = useContext(Context)
    const url = import.meta.env.VITE_SERVER
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Inicia Sesión - App G.O.R"

        const userIsLogin = async () => {
            
            if (user) {
                const result = await verifyToken();
                result && navigate("/dashboard");
            } 
        }

        userIsLogin()
    }, [user, verifyToken, navigate])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formValue = new FormData(event.currentTarget);

        setLoading(true)        

        try {
            const response = await fetch(`${url}/auth/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formValue.get('email'),
                    password: formValue.get('password')
                })
            })

            const data = await response.json()

            if (data.estado === "error") {
                notifyError(data.mensaje)
                return
                
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
            console.log(error);
            notifyError("Hubo un problema con la conexion al servidor.")
        } finally {
            setLoading(false)
        }
    };

    const handlePass = (e) => {
        setSeePass(e.target.checked);
    }
    
    return (
        <>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage:
                        `url(${bg})`,
                        backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Inicia Sesión
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type={seePass ? "text" : "password"}
                                id="password"
                                autoComplete="current-password"
                            />
                            <FormControlLabel
                                control={<Checkbox color="primary" onChange={handlePass}/>}
                                label="Ver contraseña"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Conectar
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link onClick={() => navigate("/registrarse")} variant="body2" className='cursor-pointer'>
                                        {"¿No tenes cuenta? Registrate"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}