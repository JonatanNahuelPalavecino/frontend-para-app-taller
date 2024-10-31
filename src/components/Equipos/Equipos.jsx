import { useContext, useEffect, useState } from 'react';
import { Typography, Button, Box, Divider, Paper } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { notifyError, notifyInfo, notifySuccess } from '../Notificacion/Notificacion';
import { Context } from '../Context/Context';
import { useNavigate } from 'react-router-dom';

const Equipos = () => {

    const [excelFile, setExcelFile] = useState(null);
    const [fileLoaded, setFileLoaded] = useState(false);
    const [fileName, setFileName] = useState('');
    const [totalItems, setTotalItems] = useState(0)
    const {setLoading, setProgreso} = useContext(Context)
    const navigate = useNavigate()
    const url = import.meta.env.VITE_SERVER;

    useEffect(() => {
        document.title = "Cargar Equipos - App G.O.R"

        const getTotalItems = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${url}/total-equipos`)

                const data = await response.json()

                setTotalItems(data.total)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        getTotalItems()
    }, [url, setLoading])
  
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileExtension = file.name.split('.').pop();

            if (fileExtension !== "xlsx" && fileExtension !== "xls") {
                notifyError("El formato de archivo no es válido. Solo se permiten archivos Excel.")
                return
            }

            setExcelFile(file);
            setFileName(file.name);
            setFileLoaded(true);
        }
    };
  
    const handleCargarClick = async () => {

        setLoading(true)

        const interval = setInterval( async() => {
            const progreso = await fetch(`${url}/progreso`)

            const data = await progreso.json()

            setProgreso(data.progreso)   

        }, 1000)

        const formData = new FormData()
        formData.append("file", excelFile)

        try {
            const response = await fetch(`${url}/cargar-equipos`, {
                method: "POST",
                body: formData
            })

            const data = await response.json()
        
            notifySuccess(data.mensaje)
            notifyInfo(`Equipos Cargados: ${data.equipos_cargados} - Equipos Existentes: ${data.equipos_existentes}`)
            setExcelFile(null)
            setFileLoaded(false)
            setProgreso(false)
            setFileName("")
            navigate("/dashboard")

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
            clearInterval(interval)
        }

    };

    const handleDescargarItems = async () => {

        setLoading(true)
        try {
            const response = await fetch(`${url}/descargar-equipos`)

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'equipos.xlsx');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                notifySuccess("Archivo Excel generado exitosamente.")
            } else {
                notifyError("Error en Descargar el archivo Excel")
                console.log('Error al descargar el archivo Excel');
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
  
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
          Cargar equipos
        </Typography>
        <Divider/>

        <Box
            sx={{
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            <Typography component="h5" sx={{ margin: "1rem", textAlign: "center" }}>
                {`Actualmente hay ${totalItems} equipos cargados`}
            </Typography>
            <Button
                variant="contained"
                component="label"
                startIcon={<FileDownloadIcon />}
                sx={{ margin: "0 0 3rem"}}
                onClick={handleDescargarItems}
            >
                Descargar Equipos
            </Button>

            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <Box
                    sx={{
                        background: "#ebe7e7",
                        m: 2,
                        p: 1,
                        borderRadius: "5px",
                        width: "200px",
                        textAlign: "center"
                    }}
                >
                    {
                        fileName 
                        ?
                        (
                            <Typography variant="body1" gutterBottom>
                                Archivo seleccionado: {fileName}
                            </Typography>
                        )
                        :
                        (
                            <Typography variant="body1" gutterBottom>
                                No hay archivos cargados
                            </Typography>  
                        )
                    }
                </Box>

                {/* Botón para cargar archivo */}
                <Button
                variant="contained"
                component="label"
                startIcon={<UploadFile />}
                sx={{ margin: "1rem", backgroundColor: '#4CAF50' , "&:hover": {backgroundColor: "#14a11a"}}}
                >
                    Subir Excel
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>

        
                {/* Botón que aparece solo si se ha cargado un archivo */}
                {fileLoaded && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCargarClick}
                    sx={{ margin: "1rem"}}
                >
                    Cargar
                </Button>
                )}

            </Paper>

        </Box>
      </Box>
    );
}

export default Equipos
