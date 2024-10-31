
export const getEquipo = async (item) => {

    const url = import.meta.env.VITE_SERVER
    
    try {

        const response = await fetch(`${url}/buscar-equipo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({serial_number: item})
        });
        const data = await response.json();
        return data
        
    } catch (error) {
        console.error("Error fetching item name:", error);
    } 
};