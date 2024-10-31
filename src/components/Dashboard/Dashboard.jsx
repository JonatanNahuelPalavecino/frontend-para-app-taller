import Box from '@mui/material/Box';
import { useContext, useEffect, useState } from "react";
import { Context } from "../Context/Context";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import getLastSixMonths from '../Peticiones/LastSixMonths';
import { Container, Divider, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import TotalMovimientos from './TotalMovimientos';
import Cobranzas from "./Cobranzas";
import Pedidos from './Pedidos';
import getCobranzas from "../Peticiones/getCobranzas";
import { getPedidosPendientes, getTotalPedidos } from '../Peticiones/getPedidos';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const Dashboard = () => {
  const { user, verifyToken, setLoading, setOpenDialog, openDialog, cobranzaMessage, setCobranzaMessage} = useContext(Context);
  const navigate = useNavigate();

  const [chartData, setChartData] = useState([]);
  const [cobData, setcobData] = useState({})
  const [pedidos, setPedidos] = useState({})

  useEffect(() => {

    document.title = "Dashboard - App G.O.R";

    if (user) {
      const result = verifyToken();
      !result && navigate("/");
    } else {
      navigate("/");
    }
    
  }, [user, verifyToken, navigate])

  useEffect(() => {


    const fetchLastSixMonths = async () => {
      setLoading(true)
      try {
        const monthsData = await getLastSixMonths();
        setChartData(monthsData.map(({ month, totalMov }) => ({ time: month, amount: totalMov })));

        const cobranzas = await getCobranzas()
        setcobData(cobranzas)

        const totalPedidos = await getTotalPedidos()
        const pedidosPendientes = await getPedidosPendientes()

        setPedidos({total: totalPedidos, pendientes: pedidosPendientes})
      } catch (error) {
        console.log(error);      
      } finally {
        setLoading(false)
      }
    };
    
    fetchLastSixMonths();
    
  }, [setLoading]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCobranzaMessage([])
  };

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
          Dashboard
        </Typography>
        <Divider/>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper 
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
              >
                <TotalMovimientos chartData={chartData}/>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Cobranzas cobranzas={cobData}/>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Pedidos data={pedidos}/>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
      >
        <DialogTitle>Equipos con Cobranzas Pendientes<PriorityHighIcon sx={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /></DialogTitle>
          <DialogContent >
            {
              cobranzaMessage.map((element, value) => (
                <DialogContentText key={value}>
                    {element.equipo} - {element.message}
                </DialogContentText>
              ))
            }
          </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseDialog} variant='contained' color='success' sx={{margin: "1rem"}}>
                Aceptar
            </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dashboard;
