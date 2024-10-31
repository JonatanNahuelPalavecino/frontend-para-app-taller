import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, TextField  } from '@mui/material';

const ListItems = ({ item, descripcion, comentario, onDelete, onCommentChange }) => {

    const handleCommentChange = (e) => {
        onCommentChange(item, e.target.value);
    };

    return (
        <TableRow key={item}>
            <TableCell align='center'>{item}</TableCell>
            <TableCell align='center'>
                {descripcion}
            </TableCell>
            <TableCell align='center'>
                <TextField
                    value={comentario}
                    onChange={handleCommentChange}
                    placeholder="Agregar comentario"
                    variant="outlined"
                    size="small"
                />
            </TableCell>
            <TableCell align='center'>
                <Button variant="outlined" color="error" startIcon={<DeleteIcon/>} onClick={() => onDelete(item)}>BORRAR</Button>
            </TableCell>
        </TableRow>
    );
};

ListItems.propTypes = {
    item: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    comentario: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    onCommentChange: PropTypes.func.isRequired,
};

export default ListItems;
