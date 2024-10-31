import { notifyError, notifyInfo, notifySuccess } from "../Notificacion/Notificacion";

export const handleFinalizarMovimiento = async (pedido, setLoading, itemList, setOpenDialog, setCobranzaMessage, setPedido, setItemList, navigate) => {

    if (pedido.mov_ax === "") {
        notifyError("Falta completar el N° de Pedido de AX")
        return
    }
    
    const url = import.meta.env.VITE_SERVER;
    setLoading(true);
    try {
        const response = await fetch(`${url}/movimientos/crear-movimiento`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fecha: pedido.fecha,
                tipo_solicitud: pedido.tipo_solicitud,
                items: itemList,
                mov_ax: pedido.mov_ax,
                base_operativa: pedido.base_operativa
            })
        });

        const data = await response.json();

        if (data.estado === "error") {
            notifyError(data.mensaje);
            return;
        }

        if (pedido.tipo_solicitud === "Ingreso") {

            const message = data.cobranzas.filter(cobranza => cobranza.find === true)
            
            if (message.length === 0) {
                notifyInfo("No hay equipos con Cobranzas Pendientes.")
            } else {
                setOpenDialog(true);
                setCobranzaMessage(message);
            }
        }
        

        notifySuccess(data.mensaje);
        setPedido(false);
        setItemList([]);
        navigate("/dashboard")

    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};