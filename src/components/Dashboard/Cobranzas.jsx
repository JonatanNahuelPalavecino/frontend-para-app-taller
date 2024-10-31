import { Link, Typography } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types';

const Cobranzas = ({cobranzas}) => {

    const date = new Date()
    function preventDefault(event) {
        event.preventDefault();
    }
    

    return (
        <React.Fragment>
            <Typography component="h3" variant="h6">Equipos con Cobranzas</Typography>
            <Typography component="p" variant="h4">
                {cobranzas.pendiente_arribo}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                {cobranzas.pendiente_arribo > 1 ? "equipos pendientes" : "equipo pendiente"} de arribo, al mes de {date && date.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Typography>
            <div>
                <Link color="primary" href="#" onClick={preventDefault}>
                Ver Total
                </Link>
            </div>
        </React.Fragment>
    )
}

export default Cobranzas

Cobranzas.propTypes = {
    cobranzas: PropTypes.object.isRequired
}