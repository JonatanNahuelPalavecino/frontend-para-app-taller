import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
// import React from 'react'

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://portafolio-jonatan-palavecino.vercel.app/">
          Jonatan Palavecino
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}

export default function footer () {
  return (
    <div className='bg-[#1976D2]'>
      <Copyright sx={{ pt: 2.5, pb: 2.5 }} />
    </div>
  )
}
