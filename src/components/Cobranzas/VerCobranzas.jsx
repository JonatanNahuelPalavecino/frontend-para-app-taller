import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../Context/Context";
import { notifyError } from "../Notificacion/Notificacion";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Paper, TextField, Pagination, Typography, Divider, Container, Skeleton } from '@mui/material';
import Tabla from "../Tabla/Tabla";
import dayjs from "dayjs";

const VerCobranzas = () => {
    
    const {page} = useParams()
    const [currentPage, setCurrentPage] = useState(parseInt(page) || 1);
    const url = import.meta.env.VITE_SERVER;
    const {setLoading, user, verifyToken} = useContext(Context)
    const [cobranzas, setCobranzas] = useState([])
    const [totalPages, setTotalPages] = useState(1);
    const [filtrado, setFiltrado] = useState({
        serial_number: "",
        base_operativa: ""
    });
    const navigate = useNavigate()

    useEffect(() => {
        document.title = `Ver Cobranzas - Página ${currentPage} - App G.O.R`;

        const userIsLogin = async () => {
            
            if (user) {
                const result = await verifyToken();
                !result && navigate("/");
            } 
        }

        userIsLogin()
        
    }, [user, verifyToken, navigate, currentPage]);

    const handleVerCobranzas = async (filters = {}, page = 1) => {
        setLoading(true)

        try {
            const response = await fetch(`${url}/buscar-cobranzas/${page}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ filters: filters })
            })

            const cob = await response.json()

            console.log(cob)
            setCobranzas(cob.results)
            setTotalPages(Math.ceil(cob.total / 50)); // Divide el total por 50 para obtener el número de páginas

        } catch (error) {
            console.log(error)
            notifyError("Hubo un error al hacer la consulta.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        handleVerCobranzas(filtrado, currentPage)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage])

    const borrarFiltros = () => {
        setFiltrado({
            serial_number: "",
            base_operativa: ""
        })
    }

    const handleInputChange = (name, event) => {
        setFiltrado((prevFiltrado) => ({
            ...prevFiltrado,
            [name]: event.target.value
        }));
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        navigate(`/ver-cobranzas/${value}`);  // Navegar a la nueva página
        window.scrollTo(0, 0);
    };

    const headers = ["Fecha de Deteccion", "N° de Serie", "Fecha de Arribo", "Base Operativa"];
    
    const rows = cobranzas.map((cob) => [
        dayjs(cob.fecha_deteccion).format('DD-MM-YYYY'),
        cob.serial_number,
        cob.fecha_arribo ? dayjs(cob.fecha_arribo).format('DD-MM-YYYY') : '-',
        cob.base_operativa ? cob.base_operativa : "-"
      ]);

    return (

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
                Ver Cobranzas
            </Typography>
            <Divider/>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

                <Paper sx={{display: "flex", padding: "1rem 0"}}>
                    <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "center", width: "100%"}}>

                        <TextField
                            id="serial_number"
                            label="Serial Number"
                            name="serial_number"
                            value={filtrado.serial_number}
                            onChange={(event) => handleInputChange("serial_number", event)}
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

                    </Box>

                    <Box sx={{display: "flex", flexDirection: "column", flexWrap: "wrap", justifyContent: "center"}}>

                        <Button
                            variant='contained'
                            onClick={() => handleVerCobranzas(filtrado, currentPage)}
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
                    cobranzas.length > 0
                    ?
                    ( 
                        <Tabla headers={headers} rows={rows} actions={[]}/>
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
        </Box>
    )
}

export default VerCobranzas
