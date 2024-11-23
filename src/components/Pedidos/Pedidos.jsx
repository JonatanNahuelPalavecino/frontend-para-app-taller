import { useContext, useEffect, useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { Context } from '../Context/Context';
import { useNavigate, useParams } from 'react-router-dom';
import getBo from '../Peticiones/getBo';
import Filtros from '../Filtros/Filtros';
import ItemsPedidos from '../ItemsPedidos/ItemsPedidos';
import { getItemsDelPedido } from '../Peticiones/getPedidos';

const Pedidos = () => {
    const { user, verifyToken, setLoading, pedido, setPedido } = useContext(Context);
    const [bo, setBo] = useState([]);
    const {type} = useParams()
    const navigate = useNavigate();
    
    useEffect(() => {
        document.title = type === "crear-pedido" ? "Crear Pedido - App G.O.R" : "Editar Pedido - App G.O.R";        

        const userIsLogin = async () => {
            
            if (user) {
                const result = await verifyToken();
                !result && navigate("/");
            } 
        }

        userIsLogin()

    }, [user, verifyToken, navigate, type]);

    useEffect(() => {

        const obtenerItemsDelPedido = async (num_pedido) => {
            try {
                const items = await getItemsDelPedido(num_pedido)

                setPedido((prev) => ({
                    ...prev,
                    equipos: items
                }))
            } catch (error) {
                console.log(error);
                
            }
        }
        
        const fetchData = async () => {
            setLoading(true);
            try {
                const bo = await getBo();
                setBo(bo);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        if (type === "editar-pedido") {
            
            obtenerItemsDelPedido(pedido.num_pedido)
        }

    }, [setLoading, pedido.num_pedido, setPedido, type]);

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
                {type === "editar-pedido" ? "Editar Pedido" : "Crear Pedido"}
            </Typography>
            <Divider />
            
            <Filtros bo={bo} type={type}/>
            {
                pedido.state
                &&
                (
                    <>
                        <Typography component="h1" variant="h5" sx={{ margin: "1rem", textAlign: "center" }}>
                            Agregar Items
                        </Typography>
                        <Divider /> 
                        
                        {
                            type === "editar-pedido"
                            ?
                            <ItemsPedidos data={pedido?.equipos} type={type}/>
                            :
                            <ItemsPedidos data={[]} type={type}/>

                        }
                    </>
                )
                
            }    
            
        </Box>
    );
}

export default Pedidos
