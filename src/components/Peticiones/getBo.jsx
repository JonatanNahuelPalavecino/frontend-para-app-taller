const getBo = async () => {
    const url = import.meta.env.VITE_SERVER

    try {
        const response = await fetch(`${url}/buscar-bases-operativas/1`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({filters: {}})
        })

        const data = await response.json()

        return data.results
        

    } catch (error) {
        console.log(error);
        
    }
}

export default getBo
