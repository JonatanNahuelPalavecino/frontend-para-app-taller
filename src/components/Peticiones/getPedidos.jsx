const url = import.meta.env.VITE_SERVER


export const getTotalPedidos = async () => {

    try {
        const response = await fetch(`${url}/pedidos/ver-total-pedidos`)

        const total = await response.json()

        return total

    } catch (error) {
        console.log(error);
    }
}

export const getPedidosPendientes = async () => {

    try {
        const response = await fetch(`${url}/pedidos/ver-pedidos/1`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filters: {
                    estado: "Solicitado"
                }
            })
        })

        const total = await response.json()

        return total.total

    } catch (error) {
        console.log(error);
    }
}

export const getUltimoNumPedido = async () => {

    try {
        const response = await fetch(`${url}/pedidos/ultimo-num-pedido`)

        const total = await response.json()

        return total

    } catch (error) {
        console.log(error);
        
    }
}

export const getItemsDelPedido = async (num_pedido) => {
    
    try {
        const response = await fetch(`${url}/pedidos/ver-items-pedido/${num_pedido}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await response.json()

        return data

    } catch (error) {
        console.log(error);
        
    }
}

export const getEquiposPreparados = async (num_pedido) => {

    try {
        const response = await fetch (`${url}/movimientos/filtrado/1`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({filters: {pedido_id: num_pedido}})
        })

        const data = await response.json()

        return data.results

    } catch (error) {
        console.log(error);
        
    }
}

// export default {
//     getTotalPedidos, 
//     getPedidosPendientes
// }