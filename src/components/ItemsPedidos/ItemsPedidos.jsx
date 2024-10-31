import { Autocomplete, Button, Paper, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useContext, useEffect, useState } from "react";
import { Context } from "../Context/Context";
import { notifyError } from "../Notificacion/Notificacion";
import { getItems } from "../Peticiones/getItems";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import Tabla from "../Tabla/Tabla";
import PropTypes from 'prop-types';
import { handleCrearPedido, handleModificarPedido } from "../Peticiones/postPedidos";

const ItemsPedidos = ({data, type}) => {
    const { pedido, setPedido, setLoading, user } = useContext(Context);
    const [itemList, setItemList] = useState([]); // Lista de items seleccionados
    const [items, setItems] = useState([]); // Lista de opciones de items
    const [selectedItem, setSelectedItem] = useState(null); // Item seleccionado
    const [cantidad, setCantidad] = useState(''); // Cantidad ingresada
    const navigate = useNavigate()

    useEffect(() => {

        const obtenerItems = async () => {
            const items = await getItems();
            setItems(items);
        };
        
        obtenerItems()

        data !== undefined ? setItemList(data) : setItemList([])
        
        
    }, [data]);

    // Manejar el evento de agregar un item a la lista
    const handleKeyDown = (e) => {
        try {
            const itemExist = itemList.some(item => item.descripcion === selectedItem?.descripcion);
            
            // Verifica si se presiona Enter o se hace clic en el botón, y si hay un item seleccionado
            if ((e.key === 'Enter' || e.type === 'click') && selectedItem && cantidad) {
                
                if (itemExist) {
                    notifyError("No puedes agregar dos items iguales");
                    setSelectedItem(null);
                    setCantidad('');
                    return;
                }

                // Agregar el item y cantidad a la lista
                setItemList([...itemList, { id: selectedItem.id, descripcion: selectedItem.descripcion, cantidad }]);

                // Limpiar el campo de item y cantidad
                setSelectedItem(null);
                setCantidad('');

            }
        } catch (error) {
            console.log(error);
        }
    };

    // Manejar el cambio de item seleccionado
    const handleItemChange = (event, newValue) => {
        setSelectedItem(newValue);
    };

    // Manejar el cambio de cantidad ingresada
    const handleCantidadChange = (event) => {
        setCantidad(event.target.value);
    };

    const rows = itemList?.length > 0 
    ? itemList.map((item) => [item.descripcion, item.cantidad])
    : [];

    const handleDeleteItem = (id) => {
        const itemSelected = itemList.filter((item) => item.id !== id)
         
        setItemList(itemSelected)
    }

    const actions = [
        (rowIndex) => (
            <Button
                variant='contained'
                sx={{ margin: "0rem", backgroundColor: '#d32f2f', "&:hover": {backgroundColor: "#bf0707"}}}
                startIcon={<DeleteIcon sx={{marginLeft: "12px"}}/>}
                onClick={() => handleDeleteItem(itemList[rowIndex].id)}
            />
        )
    ];

    return (
        <>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    m: 2
                }}
            >
                <Typography component="h5" variant="h6" sx={{ margin: '1rem' }}>
                    Busca el equipo
                </Typography>
                <Autocomplete
                    id="descripcion"
                    options={items}
                    getOptionLabel={(option) => `${option.descripcion}`}
                    value={selectedItem}
                    onChange={handleItemChange}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            label="Seleccionar un Equipo" 
                            variant="outlined" 
                        />
                    )}
                    filterSelectedOptions
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    noOptionsText="No hay opciones"
                    sx={{
                        width: "250px",
                        margin: "1rem"
                    }}
                />
                <TextField
                    label="Ingrese la cantidad"
                    value={cantidad}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleCantidadChange}
                    sx={{ margin: "1rem" }}
                />
                <Button
                    onClick={handleKeyDown}
                    endIcon={<SendIcon />}
                    variant="contained"
                >
                    Agregar
                </Button>


                {
                    itemList?.length > 0
                    &&
                    <Tabla headers={["Descripcion", "Cantidad", "Borrar"]} rows={rows} actions={actions}/>
                }

                {
                    itemList?.length !== 0 
                    && 
                    (
                        type === "crear-pedido"
                        ?
                        (
                            <Button 
                                variant='contained' 
                                color='success' 
                                sx={{ margin: "1rem" }} 
                                onClick={()=> {handleCrearPedido(setLoading, user, pedido, itemList, setPedido, setItemList, navigate)}}
                            >
                                Finalizar Pedido
                            </Button>
                        )
                        :
                        (
                            <Button 
                                variant='contained' 
                                color='success' 
                                sx={{ margin: "1rem" }} 
                                onClick={() => {handleModificarPedido(setLoading, pedido, itemList, setPedido, setItemList, navigate)}}
                            >
                                Modificar
                            </Button>
                        )

                    )
                }
            </Paper>
        </>
    );
};

export default ItemsPedidos;

ItemsPedidos.propTypes = {
    data: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired
}