import { useContext, useEffect, useRef, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { Button, Paper, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import { Context } from '../Context/Context';
import ListItems from '../ListItems/ListItems';
import { notifyError } from '../Notificacion/Notificacion';
import { getEquipo } from '../Peticiones/getEquipo';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { handleFinalizarMovimiento } from '../Peticiones/postMovimientos';
import { handlePrepararPedido } from '../Peticiones/postPedidos';

const Items = ({type}) => {
    const { pedido, setPedido, setLoading, setOpenDialog, setCobranzaMessage } = useContext(Context);
    const [itemList, setItemList] = useState([]);
    const [load, setLoad] = useState(false);
    const [currentItem, setCurrentItem] = useState("");
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleKeyDown = async (e) => {
        try {            
            setLoad(true);
            const itemExist = itemList.some(item => item.serial_number === currentItem);
            
            if ((e.key === 'Enter' || e.type === 'click') && currentItem) {
                
                if (itemExist) {
                    notifyError("No podes agregar dos items iguales");
                    setCurrentItem("");
                    return;
                }
    
                const descripcion = await getEquipo(currentItem);
    
                setItemList([...itemList, { serial_number: currentItem, descripcion: descripcion, comentario: "" }]);
    
                setCurrentItem(""); // Clear the input field
                inputRef.current.focus();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoad(false);
        }
    };

    const handleChange = (e) => {
        setCurrentItem(e.target.value);
    };

    const handleCommentChange = (serialNumber, comentario) => {
        setItemList(prevList =>
            prevList.map(item =>
                item.serial_number === serialNumber ? { ...item, comentario } : item
            )
        );
    };

    const handleDeleteItem = (itemToDelete) => {
        const updatedItems = itemList.filter(item => item.serial_number !== itemToDelete);
        setItemList(updatedItems);
    };

    return (
        <>
            <Typography component="h3" variant="h6" sx={{m: 2}}>
                Items
            </Typography>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}
            >
                <Typography component="h5" variant="h6" sx={{ margin: '1rem' }}>
                    Ingresa el N° de serie
                </Typography>
                <TextField
                    required
                    inputRef={inputRef}
                    id="serial_number"
                    label="Serial Number"
                    name="serial_number"
                    value={currentItem}
                    disabled={!pedido.state}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    sx={{ margin: '1rem' }}
                />
                <LoadingButton
                    onClick={handleKeyDown}
                    endIcon={<SendIcon />}
                    loading={load}
                    loadingPosition="end"
                    variant="contained"
                >
                    Agregar
                </LoadingButton>

                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>Numero de Serie</TableCell>
                                <TableCell align='center'>Descripción</TableCell>
                                <TableCell align='center'>Comentarios</TableCell>
                                <TableCell align='center'>Eliminar Item</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                itemList.map((item, index) => (
                                    <ListItems 
                                        key={index} 
                                        item={item.serial_number} 
                                        descripcion={item.descripcion} 
                                        comentario={item.comentario}
                                        onDelete={handleDeleteItem} 
                                        onCommentChange={handleCommentChange}
                                    />
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                {
                    itemList.length !== 0
                    &&
                    (
                        type === "crear-movimiento"
                        ?
                        <Button variant='contained' color='success' sx={{margin: "1rem"}} onClick={() => handleFinalizarMovimiento(pedido, setLoading, itemList, setOpenDialog, setCobranzaMessage, setPedido, setItemList, navigate)}>Finalizar</Button>
                        :
                        <Button variant='contained' color='success' sx={{margin: "1rem"}} onClick={() => handlePrepararPedido(pedido, setLoading, itemList, setOpenDialog, setCobranzaMessage, setPedido, setItemList, navigate)}>Preparar Pedido</Button>
                    )
                }
            </Paper>
        </>
    );
};

export default Items;

Items.propTypes = {
    type: PropTypes.string.isRequired
}