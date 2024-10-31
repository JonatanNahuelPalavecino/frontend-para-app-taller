// import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Context } from '../Context/Context';
import { LinearProgress } from '@mui/material';

const Loading = ({ loading }) => {
  
  const {progreso} = useContext(Context)
  
  if (!loading) return null;

  return (
    <Box 
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2, 
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography component="h1" variant="h4" color="white" mb={3}>
          Cargando
        </Typography>
        <CircularProgress color="inherit" sx={{ width: '100px', height: '100px', color: "white"}} />
        {
          progreso
          &&
          (
            <Box sx={{ width: '200px', height: "5px", mt: 2, zIndex: 999, color: "white" }}>
                <LinearProgress variant="determinate" value={progreso} />
                <Typography variant="body2">Progreso: {progreso}%</Typography>
            </Box>
          )
        }
      </Box>
    </Box>
  );
};

Loading.propTypes = {
    loading: PropTypes.bool.isRequired
}

export default Loading;
