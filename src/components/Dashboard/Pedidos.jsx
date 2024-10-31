import { Link, Typography } from '@mui/material';
import React from 'react'
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const Pedidos = ({data}) => {
    
    const navigate = useNavigate()

    return (
        <React.Fragment>
            <Typography component="h3" variant="h6">Pedidos Pendientes</Typography>
            <Typography component="p" variant="h4">
                {data.pendientes}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                de {data.total} pedidos.
            </Typography>
            <div>
                <Link color="primary" href="#" onClick={() => navigate("/ver-pedidos/1")}>
                Ver Pedidos
                </Link>
            </div>
        </React.Fragment>
    )
}

export default Pedidos


Pedidos.propTypes = {
    data: PropTypes.object.isRequired
}