import { useContext, useEffect, useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { Context } from '../Context/Context';
import { useNavigate, useParams } from 'react-router-dom';
import getBo from '../Peticiones/getBo';
import Items from '../Items/Items';
import Filtros from '../Filtros/Filtros';
import { getItemsDelPedido } from '../Peticiones/getPedidos';
import Tabla from '../Tabla/Tabla';

const CrearMovimiento = () => {

    const { user, verifyToken, setLoading, setPedido, pedido } = useContext(Context);
    const [bo, setBo] = useState([]);
    const navigate = useNavigate();
    const {type} = useParams()
    
    useEffect(() => {

        document.title = type === "crear-movimiento" ? "Crear Movimiento - App G.O.R": "Preparar Pedido - App G.O.R";        

        const userIsLogin = async () => {
            
            if (user) {
                const result = await verifyToken();
                !result && navigate("/");
            }
        }

        userIsLogin()

    }, [user, verifyToken, navigate, type]);

    useEffect(() => {
        const fetchEquiposPreparados = async (num_pedido) => {
            try {
                const equiposDelPedido = await getItemsDelPedido(num_pedido)
                
                setPedido((prev) => ({
                    ...prev,
                    equipos: equiposDelPedido
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

        if (type !== "crear-movimiento") {
            fetchEquiposPreparados(pedido.num_pedido)            
        }
        

    }, [setLoading, type, setPedido, pedido.num_pedido]);

    const rows = pedido.equipos?.length > 0 
    ? pedido.equipos.map((item) => [item.descripcion, item.cantidad])
    : [];

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
                {type === "crear-movimiento" ? "Crear Movimiento" : "Preparar Pedido"}
            </Typography>
            <Divider />
            <Filtros bo={bo} type={type}/>
            {
                type === "preparar-pedido"
                &&
                <>
                    <Typography component="h3" variant="h6" sx={{m: 2}}>
                        Equipos Pedidos
                    </Typography>
                    <Tabla headers={["Descripcion", "Cantidad"]} rows={rows} actions={[]}/>
                </>
            }
            {
                pedido.state
                &&
                <Items type={type}/>
            } 
        </Box>
    );
};

export default CrearMovimiento;
