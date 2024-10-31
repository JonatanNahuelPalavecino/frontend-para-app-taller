const getLastSixMonths = async () => {
    const months = [];
    const url = import.meta.env.VITE_SERVER
  
    // Obtener la fecha actual
    const today = new Date();
  
    for (let i = 5; i >= 0; i--) {
      // Copiar la fecha actual
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
  
      // Primer día del mes
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  
      // Último día del mes
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const response = await fetch(`${url}/movimientos/filtrado/1`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            filters: {
              fecha_uno: firstDay,
              fecha_dos: lastDay
            }
        })
      })

      const data = await response.json()
  
      // Guardar las fechas en el array
      months.push({
        month: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
        firstDay: firstDay.toISOString().split('T')[0], // Formato YYYY-MM-DD
        lastDay: lastDay.toISOString().split('T')[0],
        totalMov: data.total
      });
    }
  
    return months;
}

  export default getLastSixMonths