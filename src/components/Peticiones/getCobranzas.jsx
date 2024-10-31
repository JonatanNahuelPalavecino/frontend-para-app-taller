const getCobranzas = async () => {
    const url = import.meta.env.VITE_SERVER

    try {
        const response = await fetch(`${url}/buscar-cobranzas/1`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filters: {}
            })
        })

        const data = await response.json()

        const total = data.results
        
        const pendiente_arribo = total.filter(cobranza => cobranza.fecha_arribo === null && cobranza.base_operativa === null)

        return {total: total.length, pendiente_arribo: pendiente_arribo.length, equipos: total}

    } catch (error) {
        console.log(error);
        
    }
}

export default getCobranzas