import SendIcon from '@mui/icons-material/Send';
import { Button, Container, Grid, Paper, TextField, Autocomplete } from '@mui/material';
import { useContext, useEffect } from 'react'
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Context } from '../Context/Context';
import PropTypes from 'prop-types';

const Filtros = ({bo, type}) => {

    const { user, setPedido, pedido } = useContext(Context);
    const movimiento = ["Ingreso", "Egreso"];

    useEffect(() => {

        return () => {
            setPedido({
                state: false,
                fecha: "", 
                tipo_solicitud: null,
                user: user?.nombre,
                base_operativa: null, 
                mov_ax: "",
                comentario: ""
            })
            
        }

        
    }, [setPedido, user.nombre])

    const handleInputChange = (name, value) => {
        setPedido({
            ...pedido,
            [name]: value,
        });
    };

    const handleDateChange = (name, newValue) => {
        setPedido((prevFiltrado) => ({
            ...prevFiltrado,
            [name]: newValue
        }));
    };

    const handleSubmit = () => {
        setPedido((prev) => ({
            ...prev,
            state: true
        }));
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
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
                        {
                            (type === "preparar-pedido" || type === "editar-pedido")
                            &&
                            <TextField
                                required
                                id="num_pedido"
                                label="N° de Pedido"
                                name="num_pedido"
                                value={pedido?.num_pedido}
                                disabled
                                sx={{
                                    margin: "1rem"
                                }}
                            />
                        }
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                required
                                label="Fecha"
                                value={pedido.state ? dayjs(pedido?.fecha) : null}
                                onChange={(newValue) => handleDateChange("fecha", newValue)}
                                sx={{
                                    margin: "1rem"
                                }}
                            />
                        </LocalizationProvider>

                        <TextField
                            required
                            id="user"
                            label="Usuario"
                            name="user"
                            value={user?.nombre}
                            disabled
                            sx={{
                                margin: "1rem"
                            }}
                        />

                        <Autocomplete
                            id="tipo_solicitud"
                            options={movimiento}
                            value={pedido?.tipo_solicitud}
                            onChange={(event, newValue) => handleInputChange('tipo_solicitud', newValue)}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    label="Seleccionar un tipo de Movimiento" 
                                    variant="outlined" 
                                />
                            )}
                            filterSelectedOptions
                            isOptionEqualToValue={(option, value) => option === value}
                            noOptionsText="No hay opciones"
                            sx={{
                                width: "100%",
                                margin: "1rem"
                            }}
                        />

                        {
                            (type === "crear-movimiento" || type === "preparar-pedido")
                            &&
                            <TextField
                                required
                                id="mov_ax"
                                label="Movimiento AX"
                                name="mov_ax"
                                value={pedido?.mov_ax}
                                onChange={(event) => handleInputChange("mov_ax", event.target.value)}
                                sx={{
                                    width: "100%",
                                    margin: "1rem"
                                }}
                            />
                        }

                        <Autocomplete
                            options={bo.map(option => `${option.proveedor} - ${option.base}`)}
                            value={pedido?.base_operativa || null}
                            onChange={(event, newValue) => handleInputChange('base_operativa', newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Seleccionar una Base Operativa" fullWidth sx={{ my: 2 }} />
                            )}
                            noOptionsText="No hay opciones"
                            sx={{
                                width: "100%",
                                margin: "1rem"
                            }}
                        />

                        {
                            (type === "crear-pedido" || type === "editar-pedido")
                            &&
                            <TextField
                                id="observaciones"
                                label="Observaciones"
                                name="observaciones"
                                value={pedido?.comentario}
                                onChange={(event) => handleInputChange("comentario", event.target.value)}
                                multiline
                                rows={4}
                                sx={{
                                    width: "100%",
                                    margin: "1rem"
                                }}
                            />
                        }
                        
                        {
                            !pedido.state
                            &&
                            <Button
                                variant="contained"
                                endIcon={<SendIcon />}
                                color="success"
                                onClick={handleSubmit}
                                disabled={!pedido?.base_operativa || !pedido?.tipo_solicitud}
                            >
                                {type === "crear-movimiento" ? "Crear Movimiento" : "Crear Pedido"}
                            </Button>
                        }

                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Filtros

Filtros.propTypes = {
    bo: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired
}