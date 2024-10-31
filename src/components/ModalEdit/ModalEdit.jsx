import { useState, useContext, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Autocomplete, Skeleton } from '@mui/material';
import { Context } from '../Context/Context';
import PropTypes from 'prop-types';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { notifySuccess, notifyError } from '../Notificacion/Notificacion';
import dayjs from 'dayjs';
import getBo from '../Peticiones/getBo';
import { getEquiposPreparados, getItemsDelPedido } from '../Peticiones/getPedidos';
import Tabla from '../Tabla/Tabla';

const ModalEdit = ({ selected, setSelected, fn, see}) => {

    const url = import.meta.env.VITE_SERVER;
    const { sel } = selected;
    const { setLoading } = useContext(Context);
    const [bo, setBo] = useState([]);
    const movimiento = ["Ingreso", "Egreso"];
    const [editedSelected, setEditedSelected] = useState({ ...sel });

    useEffect(() => {
        const fetchItemsPedidos = async (num_pedido) => {
            try {
                const itemsDelPedido = await getItemsDelPedido(num_pedido);
                setEditedSelected((prev) => ({
                    ...prev,
                    items: itemsDelPedido,
                }));
            } catch (error) {
                console.log(error);
            }
        };

        //ANALIZAR ESTA FN
        const fetchEquiposPreparados = async (num_pedido) => {
            try {
                const equiposDelPedido = await getEquiposPreparados(num_pedido)
                
                setEditedSelected((prev) => ({
                    ...prev,
                    equipos: equiposDelPedido
                }))
            } catch (error) {
                console.log(error);
                
            }
        }
    
        const fetchData = async () => {
            try {
                const basesOperativas = await getBo();
                setBo(basesOperativas);
                fetchItemsPedidos(editedSelected.num_pedido)
                fetchEquiposPreparados(editedSelected.num_pedido)
            } catch (error) {
                console.log(error);
            }
        };
        
        fetchData();
    
    }, [editedSelected.num_pedido, see, selected.estado]);

    const handleInputChange = (name, value) => {
        setEditedSelected({
            ...editedSelected,
            [name]: value,
        });
    };

    const handleDateChange = (name, newValue) => {
        setEditedSelected((prevFiltrado) => ({
            ...prevFiltrado,
            [name]: newValue
        }));
    };

    const handleSaveChanges = async () => {

        setSelected((prev) => ({...prev, state: false}))
        
        setLoading(true)
        
        delete editedSelected.equipos
        delete editedSelected.items
        
        try {
            const response = await fetch(`${url}/movimientos/modificar-movimiento/${editedSelected.id_mov}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editedSelected)
            })

            const data = await response.json()

            if (data.estado === "error") {
                notifyError(data.mensaje)
                return
            }

            notifySuccess(data.mensaje)
            fn()
            
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    const rowsItemsPedidos = editedSelected.items?.length > 0 
        ? editedSelected.items.map((item) => [item.descripcion, item.cantidad])
        : [];

    const rowsIEquiposPedidos = editedSelected.equipos?.length > 0 
        ? editedSelected.equipos.map((item) => [item.serial_number, item.descripcion])
        : [];

    return (
        <Modal
            open={selected.state}
            onClose={() => setSelected({ sel: {}, state: false })}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                minWidth: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                maxHeight: '90vh', // Limita el alto máximo a 90% del viewport
                overflowY: 'auto', // Habilita el scroll vertical si el contenido es extenso
                overflowX: 'hidden', // Evita el scroll horizontal innecesario
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {see === "movimiento" ? "Editar Movimiento" : "Ver Pedido"}
                </Typography>

                <Box
                    sx={{
                        width: 600,
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center"
                    }}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            readOnly={see === "pedido"}
                            label="Fecha"
                            value={dayjs(editedSelected.fecha)}
                            onChange={(newValue) => handleDateChange("fecha", newValue)}
                            sx={{ margin: ".5rem", padding: "0", justifyContent: "center" }}
                        />
                    </LocalizationProvider>

                    <Autocomplete                            
                        readOnly={see === "pedido"}
                        options={movimiento}
                        value={editedSelected.tipo_solicitud || null}
                        onChange={(event, newValue) => handleInputChange('tipo_solicitud', newValue)}
                        renderInput={(params) => (
                            <TextField {...params} label="Tipo de Solicitud" fullWidth sx={{ my: 2 }} />
                        )}
                        sx={{width: "50%"}}
                    />
                    {
                        see === "pedido"
                        &&
                        <>
                            <TextField
                                disabled
                                label="N° de Pedido"
                                value={editedSelected.num_pedido}
                                onChange={(event) => handleInputChange('num_pedido', event.target.value)}
                                sx={{ m: 2 }}
                            />

                            <TextField
                                disabled
                                label="Estado"
                                value={editedSelected.estado}
                                onChange={(event) => handleInputChange('estado', event.target.value)}
                                sx={{ m: 2 }}
                            />

                            <TextField
                                disabled
                                label="Solicitante"
                                value={editedSelected.nombre}
                                onChange={(event) => handleInputChange('nombre', event.target.value)}
                                sx={{ m: 2 }}
                            />
                        </>
                    }
                    {
                        see === "movimiento"
                        &&
                        <>
                            <TextField
                                label="Serial Number"
                                value={editedSelected.serial_number}
                                onChange={(event) => handleInputChange('serial_number', event.target.value)}
                                fullWidth
                                sx={{ my: 2 }}
                            />

                            <TextField
                                label="Descripción"
                                value={editedSelected.descripcion}
                                onChange={(event) => handleInputChange('descripcion', event.target.value)}
                                fullWidth
                                sx={{ my: 2 }}
                            />

                            <TextField
                                label="Movimiento AX"
                                value={editedSelected.mov_ax}
                                onChange={(event) => handleInputChange('mov_ax', event.target.value)}
                                fullWidth
                                sx={{ my: 2 }}
                            />
                        </>
                    }

                    <Autocomplete
                        readOnly={see === "pedido"}
                        options={bo.map(option => `${option.proveedor} - ${option.base}`)}
                        value={editedSelected.base_operativa || null}
                        onChange={(event, newValue) => handleInputChange('base_operativa', newValue)}
                        renderInput={(params) => (
                            <TextField {...params} label="Base Operativa" fullWidth sx={{ my: 2 }} />
                        )}
                        sx={{width: "50%"}}
                    />

                    <TextField
                        disabled={see === "pedido"}
                        label="Comentarios"
                        value={see === "pedido" ? editedSelected.comentario : editedSelected.comentarios}
                        onChange={(event) => handleInputChange(see === "pedido" ? "comentario" : "comentarios", event.target.value)}
                        fullWidth
                        sx={{ my: 2 }}
                    />
                </Box>

                {
                    see === "pedido"
                    ?
                    (
                        rowsItemsPedidos.length > 0 ?
                        (
                            <>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Items Pedidos
                                </Typography>
                                <Tabla headers={["Descripcion", "Cantidad"]} rows={rowsItemsPedidos} actions={[]}/>
                            </>
                        )
                        :
                        (
                            <Box sx={{ width: "100%" }}>
                                <Skeleton height={50} />
                                <Skeleton height={50} />
                                <Skeleton height={50} />
                            </Box>
                        )
                    ) 
                    :
                    null

                }
                {
                    selected.sel.estado === "Finalizado"
                    &&
                    (
                        rowsIEquiposPedidos.length > 0
                        ?
                        (
                            <>
                                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mt: 2}}>
                                    Equipos Preparados
                                </Typography>
                                <Tabla headers={["Serial Number", "Descripcion"]} rows={rowsIEquiposPedidos} actions={[]}/>
                            </>
                        )
                        :
                        (
                            <Box sx={{ width: "100%" }}>
                                <Skeleton height={50} />
                                <Skeleton height={50} />
                                <Skeleton height={50} />
                            </Box>
                        )
                    )
                }

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    {
                        see === "movimiento"
                        ?
                        <>
                            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                                Guardar Cambios
                            </Button>
                            <Button 
                                variant='contained' 
                                sx={{ margin: "0rem", backgroundColor: '#d32f2f', "&:hover": {backgroundColor: "#bf0707"}}} 
                                onClick={() => setSelected({ sel: {}, state: false })}
                            >
                                Cancelar
                            </Button>
                        </>
                        :
                        <Button 
                            variant='contained' 
                            sx={{ margin: "0rem"}} 
                            onClick={() => setSelected({ sel: {}, state: false })}
                        >
                            Volver
                        </Button>
                    }
                </Box>
            </Box>
        </Modal>
    );
};

ModalEdit.propTypes = {
    selected: PropTypes.object.isRequired,
    setSelected: PropTypes.func.isRequired,
    fn: PropTypes.func.isRequired,
    see: PropTypes.string.isRequired
};

export default ModalEdit;
