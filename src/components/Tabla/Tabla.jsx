import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1565c0",
    color: theme.palette.common.white,
  }
}));

const Tabla = ({ headers, rows, actions = [] }) => {  

  return (
    <TableContainer component={Paper} sx={{marginTop: "1rem"}}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <StyledTableCell key={index} align="center">{header}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} align="center" sx={{ padding: "5px" }}>{cell}</TableCell>
              ))}
              {actions.length > 0 && actions.map((action, actionIndex) => (
                <TableCell key={actionIndex} align="center" sx={{ padding: "5px" }}>
                  {action(rowIndex)}  {/* Renderiza el botón o acción personalizada */}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
    
};

export default Tabla;

Tabla.propTypes = {
    headers: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    actions: PropTypes.array.isRequired
}