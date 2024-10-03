document.getElementById('decryptForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenir el envío por defecto

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log('Datos enviados:', data); // Verificar que los datos son correctos

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
            alert(`Error: ${errorData.mensaje}`);
            return;
        }

        const result = await response.json();
        console.log('Respuesta del servidor:', result);

        // Manejar la respuesta, por ejemplo, mostrar los datos descifrados
        const responseList = document.getElementById('expressResponse1');
        responseList.innerHTML = ''; // Limpiar respuestas previas

        result.datos.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.campo}: ${item.valor}`;
            responseList.appendChild(li);
        });

    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Ocurrió un error al enviar el formulario.');
    }
});
