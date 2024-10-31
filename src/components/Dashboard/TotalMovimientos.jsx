// import React from 'react'
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

const TotalMovimientos = ({chartData}) => {

    const theme = useTheme();

    return (
        <>
            <Typography component="h3" variant="h6">
                Total de movimientos por Mes
            </Typography>
            <Box
                sx={{
                width: '100%',
                height: 400,
                // flexGrow: 1,
                // overflow: 'hidden',
                // padding: "0 1rem",
                // borderRadius: "25px",
                // boxShadow: "-1px 1px 5px black",
                // margin: "1rem"
                }}
            >
                <LineChart
                dataset={chartData}
                margin={{
                    top: 16,
                    right: 20,
                    left: 70,
                    bottom: 30,
                }}
                xAxis={[
                    {
                    scaleType: 'point',
                    dataKey: 'time',
                    tickNumber: 6,
                    tickLabelStyle: theme.typography.body2,
                    },
                ]}
                yAxis={[
                    {
                    label: 'Cant. de equipos ingresados / enviados',
                    labelStyle: {
                        ...theme.typography.body1,
                        fill: theme.palette.text.primary,
                    },
                    tickLabelStyle: theme.typography.body2,
                    max: 2500,
                    tickNumber: 5,
                    },
                ]}
                series={[
                    {
                    dataKey: 'amount',
                    showMark: false,
                    color: theme.palette.primary.light,
                    },
                ]}
                sx={{
                    [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
                    [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
                    [`& .${axisClasses.left} .${axisClasses.label}`]: {
                    transform: 'translateX(-25px)',
                    },
                }}
                />
            </Box>
        </>
    )
}

export default TotalMovimientos

TotalMovimientos.propTypes = {
    chartData: PropTypes.array.isRequired
  }