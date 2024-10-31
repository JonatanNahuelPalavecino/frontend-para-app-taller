import { Box, Button, Divider, Paper, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Tabla from "../Tabla/Tabla";
import { notifyError, notifySuccess } from "../Notificacion/Notificacion";
import { Context } from "../Context/Context";
import { useNavigate } from "react-router-dom";

const CrearCobranza = () => {
    const [cobranzas, setCobranzas] = useState([]);
    const [serial, setSerial] = useState("");
    const [fecha, setFecha] = useState(dayjs());
    const url = import.meta.env.VITE_SERVER;
    const {setLoading} = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        document.title = `Crear Cobranzas - App G.O.R`;
    }, [])

    const handleAgregarSerial = (e) => {

        const serialExist = cobranzas.some(el => el.serial_number === serial)

        if ((e.key === 'Enter' || e.type === 'click') && serial) {
            
            if (serialExist) {
                notifyError("No podes agregar dos equipos con el mismo serial number")
                setSerial("")
                return
            }

            setCobranzas((prev) => [...prev, { serial_number: serial, fecha: fecha.format("YYYY/MM/DD") }]);
            setSerial("");  // Limpiar el campo después de agregar el serial
        }
    };

    const handleSerial = (e) => {
        setSerial(e.target.value);
    };

    const handleFinalizarCarga = async () => {

        setLoading(true)
        const cobranzasProcesadas = []
        
        for (const item of cobranzas) {
            
            try {
                const response = await fetch(`${url}/cargar-cobranza`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({fecha_deteccion: item.fecha, serial_number: item.serial_number})
                })

                const data = await response.json()

                cobranzasProcesadas.push({serial_number: item.serial_number, estado: data.estado})

                
            } catch (error) {
                notifyError("Hubo un error con la carga de cobranzas")
            }
        }
        
        const equiposConError = cobranzasProcesadas .filter(item => item.estado === "error");

        if (equiposConError.length === 0) {
            notifySuccess("Equipos cargados exitosamente");
            setCobranzas([])
            navigate("/dashboard")
            setLoading(false)
        } else {
            notifyError("Hubo un error con la carga de cobranzas!")
        }
    };

    const rows = cobranzas.map((item) => [item.fecha, item.serial_number]);

    return (
        <Box
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                overflow: 'auto',
            }}
        >
            <Typography component="h1" variant="h5" sx={{ margin: "1rem", textAlign: "center" }}>
                Cargar recupero de CPU con Cobranzas
            </Typography>
            <Divider />

            <Box
                sx={{height: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}
            >

                <Paper 
                    sx={{
                        m: 2,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: "center",
                        alignItems: "center",
                        flexWrap: "wrap"
                    }}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            disabled
                            label="Fecha"
                            value={fecha}
                            onChange={(newValue) => setFecha(newValue)}
                            sx={{
                                margin: "1rem"
                            }}
                        />
                    </LocalizationProvider>

                    <TextField
                        required
                        id="num_serie"
                        label="Serial Number"
                        name="num_serie"
                        value={serial}
                        onChange={handleSerial}
                        onKeyDown={handleAgregarSerial}
                        sx={{ margin: "1rem" }}
                    />

                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        color="success"
                        onClick={handleAgregarSerial}
                        disabled={serial === ""}
                    >
                        Cargar
                    </Button>
                </Paper>

                <Typography component="h3" variant="h6" sx={{ m: 2 }}>
                    Cobranzas agregadas
                </Typography>
                
                <Box sx={{width: "80%"}}>
                    <Tabla headers={["Fecha", "Serial Number"]} rows={rows} actions={[]} />
                </Box>

                {cobranzas.length > 0 && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFinalizarCarga}
                        sx={{ display: "block", margin: "2rem auto" }}
                    >
                        Finalizar Carga
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default CrearCobranza;
