 // Espera a que el DOM esté completamente cargado
 document.addEventListener('DOMContentLoaded', function() {
    // Selecciona el formulario por su ID
    const nestjsForm = document.getElementById('nestjsForm');
   
    // Añade un listener para el evento 'submit'
    nestjsForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el comportamiento por defecto del formulario

        const form = event.target;
        const formData = new FormData(form);

        // Convertir FormData a un objeto JavaScript
        const data = {};
        formData.forEach((value, key) => { 
            data[key] = value;
        });

        // Enviar la solicitud al servidor con fetch
        fetch(form.action, {
            method: form.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json(); // Devuelve la respuesta JSON si todo está bien
        })
        .then(data => {
            const responseElement = document.getElementById('nestResponse');

            // Limpiar cualquier contenido previo
            responseElement.innerHTML = '';

            // Verificar si hay un mensaje principal
            if (data.message) {
                const messageItem = document.createElement('li');
                messageItem.textContent = data.message;
                messageItem.style.fontWeight = 'bold'; // Opcional: resaltar el mensaje
                responseElement.appendChild(messageItem);
            }

            // Verificar si hay datos para mostrar
            if (data.data) {
                // Suponiendo que 'data' es un objeto que contiene claves y valores
                for (const [key, value] of Object.entries(data.data)) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${key}: ${value}`;
                    responseElement.appendChild(listItem);
                }
            } else {
                // Si no hay datos, mostrar un mensaje alternativo
                const noDataItem = document.createElement('li');
                noDataItem.textContent = 'No se recibieron datos adicionales.';
                responseElement.appendChild(noDataItem);
            }
        })
        .catch(error => {
            const responseElement = document.getElementById('nestResponse');
            responseElement.innerHTML = ''; // Limpiar cualquier contenido previo

            // Crear un elemento de lista para el mensaje de error
            const errorItem = document.createElement('li');
            errorItem.textContent = error.message || 'Ocurrió un error.';
            errorItem.style.color = 'red'; // Opcional: resaltar el error en rojo
            responseElement.appendChild(errorItem);

            console.error('Error:', error);
        });
    });
});