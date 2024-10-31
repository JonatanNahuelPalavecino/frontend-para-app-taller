export const getItems = async () => {
    const url = import.meta.env.VITE_SERVER

    try {
        const response = await fetch(`${url}/pedidos/ver-items`)

        const data = await response.json()

        return data
        
    } catch (error) {
        console.log(error);
        
    }
}