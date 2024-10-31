import { notifyError, notifyInfo, notifySuccess } from "../Notificacion/Notificacion";
import { getUltimoNumPedido } from "./getPedidos";

const url = import.meta.env.VITE_SERVER;


export const handlePrepararPedido = async (pedido, setLoading, itemList, setOpenDialog, setCobranzaMessage, setPedido, setItemList, navigate) => {

    if (pedido.mov_ax === "") {
        notifyError("Falta completar el N° de Pedido de AX")
        return
    }
    
    setLoading(true);
    try {
        const response = await fetch(`${url}/pedidos/finalizar-pedido`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: pedido.num_pedido,
                movimiento: {
                    ...pedido,
                    items: [...itemList]
                }
            })
        });

        const data = await response.json();

        if (data.estado === "error") {
            notifyError(data.mensaje);
            return;
        }

        if (pedido.tipo_solicitud === "Ingreso") {

            const message = data.mov.cobranzas.filter(cobranza => cobranza.find === true)
            
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
}

const handleCargarItems = async (items, notificacion, setLoading, setPedido, setItemList, navigate) => {

    setLoading(true)

    try {
        const num_pedido = await getUltimoNumPedido()
        
        const response = await fetch(`${url}/pedidos/agregar-items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pedido_id: num_pedido,
                articulos: items
            })
        })

        const data = await response.json()

        if (data.estado === "error") {
            notifyError(data.mensaje)
            return
        }

        notifySuccess(`N° ${num_pedido} - ${notificacion}`);
        setPedido(false);
        setItemList([]);
        navigate("/dashboard")

    } catch (error) {
        notifyError("Hubo un problema al cargar los items al pedido")
        console.log(error);
    } finally {
        setLoading(false)
    }
}

// Mostrar la lista de items seleccionados
export const handleCrearPedido = async (setLoading, user, pedido, itemList, setPedido, setItemList, navigate) => {

    setLoading(true)

    try {
        const response = await fetch(`${url}/pedidos/crear-pedido`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                solicitanteId: user.id,
                fecha: pedido.fecha,
                base_operativa: pedido.base_operativa,
                comentario: pedido.comentario,
                tipo_solicitud: pedido.tipo_solicitud
            })
        })

        const data = await response.json()

        if (data.estado === "error") {
            notifyError(data.mensaje)
            return
        }

        await handleCargarItems(itemList, data.mensaje, setLoading, setPedido, setItemList, navigate)

    } catch (error) {
        notifyError("Hubo un problema en cargar el pedido.")
        console.log(error);
    } finally {
        setLoading(false)
    }
}

const handleEditarItemsPedido = async (items, num_pedido, notificacion, setLoading, setPedido, setItemList, navigate) => {

    setLoading(true)

    try {
        const response = await fetch(`${url}/pedidos/modificar-items`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                items: items,
                num_pedido: num_pedido
            })
        })

        const data = await response.json()

        if (data.estado === "error") {
            notifyError(data.mensaje)
            return
        }

        notifySuccess(`N° ${num_pedido} - ${notificacion}`);
        setPedido(false);
        setItemList([]);
        navigate("/dashboard")

    } catch (error) {
        console.log(error)
    }
}

export const handleModificarPedido = async (setLoading, pedido, itemList, setPedido, setItemList, navigate) => {

    setLoading(true)

    try {
        const response = await fetch(`${url}/pedidos/modificar-pedido`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fecha: pedido.fecha,
                base_operativa: pedido.base_operativa,
                comentario: pedido.comentario,
                tipo_solicitud: pedido.tipo_solicitud,
                num_pedido: pedido.num_pedido
            })
        })

        const data = await response.json()

        if (data.estado === "error") {
            notifyError(data.mensaje)
            return
        }

        await handleEditarItemsPedido(itemList, pedido.num_pedido, data.mensaje, setLoading, setPedido, setItemList, navigate)

    } catch (error) {
        console.log(error);
    }
}