import { Box, Button, Paper, TextField, Pagination, Typography, Divider, Container, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Skeleton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../Context/Context';
import { useNavigate, useParams } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { FileDownload } from '@mui/icons-material';
import { notifyError, notifySuccess } from '../Notificacion/Notificacion';
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ModalEdit from '../ModalEdit/ModalEdit';
import Tabla from '../Tabla/Tabla';
import dayjs from 'dayjs';

const VerMovimientos = () => {
    const url = import.meta.env.VITE_SERVER;
    const { user, verifyToken, setLoading } = useContext(Context);
    const [movimientos, setMovimientos] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [filtrado, setFiltrado] = useState({
        fecha_uno: null,
        fecha_dos: null,
        tipo_solicitud: "",
        serial_number: "",
        descripcion: "",
        mov_ax: "",
        base_operativa: "",
        comentarios: "",
        pedido_id: ""
    });
    const { page } = useParams();
    const [currentPage, setCurrentPage] = useState(parseInt(page) || 1);
    const [selected, setSelected] = useState({
        sel: {},
        state: false
    })
    const [eliminar, setEliminar] = useState({
        sel: {},
        state: false
    })
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `Ver Movimientos - Página ${currentPage} - App G.O.R`;

        const userIsLogin = async () => {
            
            if (user) {
                const result = await verifyToken();
                !result && navigate("/");
            } 
        }

        userIsLogin()
    }, [user, verifyToken, navigate, currentPage]);

    const fetchMov = async (filters = {}, page = 1) => {
        setLoading(true);

        const data = {
            ...filters,
            fecha_uno: filters.fecha_uno ? filters.fecha_uno.format('YYYY-MM-DD') : '',
            fecha_dos: filters.fecha_dos ? filters.fecha_dos.format('YYYY-MM-DD') : ''
        };

        try {
            const response = await fetch(`${url}/movimientos/filtrado/${page}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ filters: { ...data } })
            });

            const movs = await response.json();

            setMovimientos(movs.results);
            setTotalPages(Math.ceil(movs.total / 50)); // Divide el total por 50 para obtener el número de páginas

        } catch (error) {
            console.log(error);
            notifyError("Hubo un error al hacer la consulta.")
        } finally {
            setLoading(false);            
        }
    };

    const downloadExcel = async (filters, total) => {
        setLoading(true);
        
        const data = {
            ...filtrado,
            fecha_uno: filters.fecha_uno ? filters.fecha_uno.format('YYYY-MM-DD') : '',
            fecha_dos: filters.fecha_dos ? filters.fecha_dos.format('YYYY-MM-DD') : ''
        };

        try {
            const response = await fetch(`${url}/movimientos/descargar-excel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filters: { ...data }, total: total })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'movimientos.xlsx');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                notifySuccess("Archivo Excel generado exitosamente.")
            } else {
                notifyError("Error en Descargar el archivo Excel")
                console.log('Error al descargar el archivo Excel');
            }
        } catch (error) {
            console.log('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const borrarFiltros = () => {
        setFiltrado({
            fecha_uno: null,
            fecha_dos: null,
            tipo_solicitud: "",
            serial_number: "",
            descripcion: "",
            mov_ax: "",
            base_operativa: "",
            comentarios: "",
            pedido_id: ""
        })
    }

    useEffect(() => {
        fetchMov(filtrado, currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

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
        navigate(`/ver-movimientos/${value}`);  // Navegar a la nueva página
        window.scrollTo(0, 0);
    };

    const handleEditMov = (id_mov) => {
        
        const movSelected = movimientos.find((mov) => mov.id_mov === id_mov)
        setSelected({
            sel: movSelected,
            state: true
        });
        
    }

    const handleAdviceDeleteMov = (id_mov) => {
        const movSelected = movimientos.find((mov) => mov.id_mov === id_mov)

        setEliminar({
            sel: movSelected,
            state: true
        })
    }

    const handleDeleteMov = async (id_mov) => {

        setLoading(true)
        setEliminar({state:false, sel: {}})
        try {
            const response = await fetch(`${url}/movimientos/eliminar-movimiento/${id_mov}`, {
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
            fetchMov()

        } catch (error) {
            console.log(error);
            notifyError("Hubo un problema al conectarse con la base de datos")
        } finally {
            setLoading(false)
        }
    }

      // Definir los encabezados de la tabla
  const headers = [
    "Fecha", "Tipo de Solicitud", "N° de Serie", "Descripcion", 
    "Movimiento AX", "Base Operativa", "Comentarios", "N° Pedido", 
    "Editar", "Eliminar"
  ];

  // Crear las filas de datos
  const rows = movimientos.map((mov) => [
    dayjs(mov.fecha).format('DD-MM-YYYY'), mov.tipo_solicitud, mov.serial_number, mov.descripcion, 
    mov.mov_ax, mov.base_operativa, mov.comentarios, mov.pedido_id
  ]);

  // Definir las acciones (botones) de la tabla
  const actions = [
    (rowIndex) => (
      <Button
        variant='contained'
        startIcon={<AutorenewIcon sx={{marginLeft: "12px"}}/>}
        onClick={() => handleEditMov(movimientos[rowIndex].id_mov)}
      />
    ),
    (rowIndex) => (
      <Button
        variant='contained'
        startIcon={<DeleteIcon sx={{marginLeft: "12px"}}/>}
        sx={{ backgroundColor: '#d32f2f', "&:hover": { backgroundColor: "#bf0707" }}}
        onClick={() => handleAdviceDeleteMov(movimientos[rowIndex].id_mov)}
      />
    )
  ];
    

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
                    Ver Detalle de movimientos
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
                                id="solicitud"
                                label="Tipo de Solicitud"
                                name="solicitud"
                                value={filtrado.tipo_solicitud}
                                onChange={(event) => handleInputChange("tipo_solicitud", event)}
                                sx={{ margin: ".5rem", padding: "0" }}
                            />

                            <TextField
                                id="serial_number"
                                label="Serial Number"
                                name="serial_number"
                                value={filtrado.serial_number}
                                onChange={(event) => handleInputChange("serial_number", event)}
                                sx={{ margin: ".5rem", padding: "0" }}
                            />

                            <TextField
                                id="descripcion"
                                label="Descripcion"
                                name="descripcion"
                                value={filtrado.descripcion}
                                onChange={(event) => handleInputChange("descripcion", event)}
                                sx={{ margin: ".5rem", padding: "0" }}
                            />

                            <TextField
                                id="mov_ax"
                                label="Movimiento AX"
                                name="mov_ax"
                                value={filtrado.mov_ax}
                                onChange={(event) => handleInputChange("mov_ax", event)}
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
                                id="comentarios"
                                label="Comentarios"
                                name="comentarios"
                                value={filtrado.comentarios}
                                onChange={(event) => handleInputChange("comentarios", event)}
                                sx={{ margin: ".5rem", padding: "0" }}
                            />

                            <TextField
                                id="pedido_id"
                                label="N° de Pedido"
                                name="pedido_id"
                                value={filtrado.pedido_id}
                                onChange={(event) => handleInputChange("pedido_id", event)}
                                sx={{ margin: ".5rem", padding: "0" }}
                            />
                        </Box>

                        <Box sx={{display: "flex", flexDirection: "column", flexWrap: "wrap", justifyContent: "center"}}>

                            <Button
                                variant='contained'
                                onClick={() => fetchMov(filtrado, currentPage)}
                                sx={{ margin: "1rem"}}
                            >
                                Buscar
                            </Button>

                            <Button
                                variant='contained'
                                startIcon={<FileDownload />}
                                onClick={() => downloadExcel(filtrado, movimientos.total)}
                                sx={{ margin: "1rem", backgroundColor: '#4CAF50' , "&:hover": {backgroundColor: "#14a11a"}}}
                            >
                                Descargar Excel
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
                        movimientos.length > 0
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
                    <DialogTitle>¿Desea eliminar el Movimiento?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>ID del movimiento: {eliminar.sel?.id_mov}</DialogContentText>
                        <DialogContentText>Serial Number: {eliminar.sel?.serial_number}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={() => handleDeleteMov(eliminar.sel?.id_mov)}>Confirmar</Button>
                        <Button variant='contained' sx={{ margin: "0rem", backgroundColor: '#d32f2f', "&:hover": {backgroundColor: "#bf0707"}}} onClick={() => setEliminar({sel: {}, state: false})}>Cancelar</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {
                selected.state && <ModalEdit selected={selected} setSelected={setSelected} fn={fetchMov} see={"movimiento"}/>
            }
        </>
    );
}

export default VerMovimientos;
