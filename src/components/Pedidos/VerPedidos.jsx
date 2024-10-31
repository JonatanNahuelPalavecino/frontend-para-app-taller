import { Box, Button, Paper, TextField, Pagination, Typography, Divider, Container, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Skeleton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../Context/Context';
import { useNavigate, useParams } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { notifyError, notifySuccess } from '../Notificacion/Notificacion';
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Visibility } from '@mui/icons-material';
import ModalEdit from '../ModalEdit/ModalEdit';
import Tabla from '../Tabla/Tabla';
import dayjs from 'dayjs';

const VerPedidos = () => {

    const url = import.meta.env.VITE_SERVER;
    const { user, verifyToken, setLoading, setPedido } = useContext(Context);
    const [pedidos, setPedidos] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [filtrado, setFiltrado] = useState({
        fecha_uno: null,
        fecha_dos: null,
        nombre: "",
        num_pedido: "",
        estado: "",
        base_operativa: "",
        comentario: "",
        tipo_solicitud: ""
    });
    const { page } = useParams();
    const [currentPage, setCurrentPage] = useState(parseInt(page) || 1);
    const navigate = useNavigate();
    const [selected, setSelected] = useState({
        sel: {},    
        state: false
    })
    const [eliminar, setEliminar] = useState({
        sel: {},    
        state: false
    })

    useEffect(() => {
        document.title = `Ver Pedidos - Página ${currentPage} - App G.O.R`;
    
        const userIsLogin = async () => {
            
            if (user) {
                const result = await verifyToken();
                !result && navigate("/");
            } 
        }
    
        userIsLogin()
    }, [user, verifyToken, navigate, currentPage]);
    
    const fetchPedidos = async (filters = {}, page = 1) => {
        setLoading(true);

        const data = {
            ...filters,
            fecha_uno: filters.fecha_uno ? filters.fecha_uno.format('YYYY-MM-DD') : '',
            fecha_dos: filters.fecha_dos ? filters.fecha_dos.format('YYYY-MM-DD') : ''
        };

        try {
            const response = await fetch(`${url}/pedidos/ver-pedidos/${page}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ filters: { ...data } })
            });

            const pedidos = await response.json();

            setPedidos(pedidos.results);
            setTotalPages(Math.ceil(pedidos.total / 50)); // Divide el total por 50 para obtener el número de páginas

        } catch (error) {
            console.log(error);
            notifyError("Hubo un error al hacer la consulta.")
        } finally {
            setLoading(false);            
        }
    };
    
    useEffect(() => {
        fetchPedidos(filtrado, currentPage);
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);
    
    const borrarFiltros = () => {
        setFiltrado({
            fecha_uno: null,
            fecha_dos: null,
            nombre: "",
            num_pedido: "",
            estado: "",
            base_operativa: "",
            comentario: "",
            tipo_solicitud: ""
        })
    }
    
    
    const handleDateChange = (name, newValue) => {
        setFiltrado((prevFiltrado) => ({
            ...prevFiltrado,
            [name]: newValue
        }));
    };
    
    const handleInputChange = (name, event) => {
        setFiltrado((prevFiltrado) => ({
            ...prevFiltrado,
            [name]: event.target.value
        }));
    };
    
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        navigate(`/ver-pedidos/${value}`);  // Navegar a la nueva página
        window.scrollTo(0, 0);
    };

    
    
    const handleVerPedido = (num_pedido, option) => {
        const pedidoSelected = pedidos.find((pedido) => pedido.num_pedido === num_pedido)    
        setSelected({
            sel: pedidoSelected,    
            state: true,
            option: option
        });
        
    }
    
    const handleAdviceDeletePedido = (num_pedido) => {
        const pedidoSelected = pedidos.find((pedido) => pedido.num_pedido === num_pedido)    
        setEliminar({
            sel: pedidoSelected,    
            state: true
        })
    }
    
    const handleDeletePedido = async (num_pedido) => {
    
        setLoading(true)    
        setEliminar({state: false, sel: {}})
        try {
            const response = await fetch(`${url}/pedidos/eliminar-pedido/${num_pedido}`, {
                method: "DELETE",    
                headers: {
                    "Content-Type": "application/json"     
                }
            })
    
            const data = await response.json()
    
            if (data.estado === "error") {
                notifyError(data.mensaje)    
                return
            }
    
            notifySuccess(data.mensaje)
            fetchPedidos()
    
        } catch (error) {
            console.log(error);    
            notifyError("Hubo un problema al conectarse con la base de datos")
        } finally {
            setLoading(false)    
        }
    }

    // Definir los encabezados de la tabla
    const headers = [
        "Fecha", "N° de Pedido", "Tipo de Solicitud", "Usuario", 
        "Base Operativa", "Comentarios", "Estado", 
        "Ver Pedido", "Preparar Pedido", "Editar", "Borrar"
    ];

    // Crear las filas de datos
    const rows = pedidos.map((pedido) => [
        dayjs(pedido.fecha).format('DD-MM-YYYY'), pedido.num_pedido, pedido.tipo_solicitud, pedido.nombre, pedido.base_operativa, pedido.comentario, pedido.estado
    ]);

    // Definir las acciones (botones) de la tabla
    const actions = [
        (rowIndex) => (
            <Button
                variant='contained'
                startIcon={<Visibility sx={{marginLeft: "12px"}}/>}
                onClick={() => handleVerPedido(pedidos[rowIndex].num_pedido, "ver-pedido")}
                sx={{ margin: "0rem"}}
            />
        ),
        (rowIndex) => (
            <Button
                disabled={pedidos[rowIndex].estado === "Finalizado"}
                variant='contained'
                startIcon={<LocalShippingIcon sx={{marginLeft: "12px"}}/>}
                onClick={() => handlePrepararPedido(pedidos[rowIndex])}
                sx={{ margin: "0rem"}}
            />
        ),
        (rowIndex) => (
            <Button
                disabled={pedidos[rowIndex].estado === "Finalizado"}
                variant='contained'
                startIcon={<AutorenewIcon sx={{marginLeft: "12px"}}/>}
                onClick={() => handleEditarPedido(pedidos[rowIndex])}
                sx={{ margin: "0rem"}}
            />
        ),
        (rowIndex) => (
            <Button
                disabled={pedidos[rowIndex].estado === "Finalizado"}
                variant='contained'
                sx={{ margin: "0rem", backgroundColor: '#d32f2f', "&:hover": {backgroundColor: "#bf0707"}}}
                startIcon={<DeleteIcon sx={{marginLeft: "12px"}}/>}
                onClick={() => handleAdviceDeletePedido(pedidos[rowIndex].num_pedido)}
            />
        )
    ];

    const handlePrepararPedido = (pedido) => {
        setPedido((prev) => ({
            ...prev,
            state: true,
            ...pedido
        }))        
        navigate("/movimiento/preparar-pedido")
    }

    const handleEditarPedido = (pedido) => {
        setPedido((prev) => ({
            ...prev,
            state: true,
            ...pedido
        }))        
        navigate("/pedido/editar-pedido")
    }

    return (
        <>
            <Box
                sx={{
                    backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                    flexGrow: 1,
                    // height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Typography component="h1" variant="h5" sx={{ margin: "1rem", textAlign: "center" }}>
                    Ver Detalle de Pedidos
                </Typography>
                <Divider/>
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    
                    <Paper sx={{display: "flex", padding: "1rem 0"}}>
                        <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "center", width: "100%"}}>
    
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Desde Fecha"
                                    value={filtrado.fecha_uno}
                                    onChange={(newValue) => handleDateChange("fecha_uno", newValue)}
                                    sx={{ margin: ".5rem", padding: "0" }}
                                />
                            </LocalizationProvider>
    
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Hasta Fecha"
                                    value={filtrado.fecha_dos}
                                    onChange={(newValue) => handleDateChange("fecha_dos", newValue)}
                                    sx={{ margin: ".5rem", padding: "0" }}
                                />
                            </LocalizationProvider>
    
                            <TextField
                                id="num_pedido"
                                label="N° de Pedido"
                                name="num_pedido"
                                value={filtrado.num_pedido}
                                onChange={(event) => handleInputChange("num_pedido", event)}
                                sx={{ margin: ".5rem", padding: "0" }}
                            />
    
                            <TextField
                                id="tipo_solicitud"
                                label="Tipo de Solicitud"
                                name="tipo_solicitud"
                                value={filtrado.tipo_solicitud}
                                onChange={(event) => handleInputChange("tipo_solicitud", event)}
                                sx={{ margin: ".5rem", padding: "0" }}
                            />
    
                            <TextField
                                id="nombre"
                                label="Nombre"
                                name="nombre"
                                value={filtrado.nombre}
                                onChange={(event) => handleInputChange("nombre", event)}
                                sx={{ margin: ".5rem", padding: "0" }}
                            />

                            <TextField  
                                id="bo"
                                label="Base Operativa"
                                name="bo"
                                value={filtrado.base_operativa}
                                onChange={(event) => handleInputChange("base_operativa", event)}
                                sx={{ margin: ".5rem", padding: "0" }}
                            />
    
                            <TextField
                                id="estado"
                                label="Estado"
                                name="estado"
                                value={filtrado.estado}
                                onChange={(event) => handleInputChange("estado", event)}
                                sx={{ margin: ".5rem", padding: "0" }}
                            />
    
                            <TextField
                                id="comentarios"
                                label="Comentarios"
                                name="comentarios"
                                value={filtrado.comentarios}
                                onChange={(event) => handleInputChange("comentario", event)}
                                sx={{ margin: ".5rem", padding: "0" }}
                            />
                        </Box>
    
                        <Box sx={{display: "flex", flexDirection: "column", flexWrap: "wrap", justifyContent: "center"}}>
    
                            <Button
                                variant='contained'
                                onClick={() => fetchPedidos(filtrado, currentPage)}
                                sx={{ margin: "1rem"}}
                            >
                                Buscar
                            </Button>
    
                            <Button
                                variant='contained' startIcon={<DeleteIcon/>}
                                onClick={() => borrarFiltros()}
                                sx={{ margin: "1rem", backgroundColor: '#d32f2f', "&:hover": {backgroundColor: "#bf0707"}}}
                            >
                                Borrar Filtros
                            </Button>
                        </Box>
                    </Paper>
    
                    {
                        pedidos.length > 0
                        ?
                        (
                            <Tabla headers={headers} rows={rows} actions={actions}/>
                        )
                        :
                        (
                            <Box sx={{ width: "100%" }}>
                                <Skeleton height={50} />
                                <Skeleton height={50} />
                                <Skeleton height={50} />
                                <Skeleton height={50} />
                                <Skeleton height={50} />
                            </Box>
                        )
                    }

                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        sx={{ margin: "1rem", display: 'flex', justifyContent: 'center' }}
                    />
                </Container>
                <Dialog
                    open={eliminar.state}
                    onClose={() => setEliminar({sel: {}, state: false})}
                >
                    <DialogTitle>¿Desea eliminar el Pedido?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>N° de Pedido: {eliminar.sel?.num_pedido}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={() => handleDeletePedido(eliminar.sel?.num_pedido)}>Confirmar</Button>
                        <Button variant='contained' sx={{ margin: "0rem", backgroundColor: '#d32f2f', "&:hover": {backgroundColor: "#bf0707"}}} onClick={() => setEliminar({sel: {}, state: false})}>Cancelar</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {
                selected.state && <ModalEdit selected={selected} setSelected={setSelected} fn={fetchPedidos} see={"pedido"}/>
            }
        </>
    );

}    

export default VerPedidos



    

