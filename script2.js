document.getElementById('cipherForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar recargar la página

    const message = document.getElementById('message').value.replace(/\s+/g, ''); // Eliminar espacios
    const key = parseInt(document.getElementById('key').value);
    const { resultText, matrixDisplay } = columnarCipher(message, key);

    document.getElementById('resultText').innerText = resultText;
    document.getElementById('matrixDisplay').innerHTML = matrixDisplay; // Usar innerHTML para mostrar la tabla
});

// Función para el cifrado por columnas
function columnarCipher(message, key) {
    const numRows = Math.ceil(message.length / key);
    const grid = Array.from({ length: numRows }, (_, i) => 
        message.slice(i * key, i * key + key).split('')
    );

    // Crear la representación de la matriz como tabla
    let matrixDisplay = '<table>';
    for (let row of grid) {
        matrixDisplay += '<tr>' + row.map(cell => `<td>${cell || ''}</td>`).join('') + '</tr>';
    }
    matrixDisplay += '</table>';

    // Cifrado
    let result = '';
    for (let col = 0; col < key; col++) {
        for (let row = 0; row < numRows; row++) {
            if (grid[row][col]) {
                result += grid[row][col];
            }
        }
    }

    return { resultText: result, matrixDisplay }; // Devolver la matriz como HTML
}
document.getElementById('copyMessageBtn').addEventListener('click', function() {
    var mensajeCifrado = document.getElementById('resultText').innerText;
    var tempTextArea = document.createElement("textarea");
    tempTextArea.value = mensajeCifrado;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
    //alert("Mensaje cifrado copiado al portapapeles");
});

// Funcionalidad de descifrado
document.getElementById('decipherForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar recargar la página

    const decipherMessage = document.getElementById('decipherMessage').value.replace(/\s+/g, ''); // Eliminar espacios
    const decipherKey = parseInt(document.getElementById('decipherKey').value);
    const { resultText, matrixDisplay } = columnarDecipher(decipherMessage, decipherKey);

    document.getElementById('decipherResultText').innerText = resultText;
    document.getElementById('decipherMatrixDisplay').innerHTML = matrixDisplay; // Usar innerHTML para mostrar la tabla
});
document.getElementById('copyDecipherMessageBtn').addEventListener('click', function() {
    var mensajeDescifrado = document.getElementById('decipherResultText').innerText;
    var tempTextArea = document.createElement("textarea");
    tempTextArea.value = mensajeDescifrado;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
    //alert("Mensaje descifrado copiado al portapapeles");
});
// Función para el descifrado por columnas
function columnarDecipher(message, key) {
    const numRows = Math.ceil(message.length / key);
    const grid = Array.from({ length: numRows }, () => Array(key).fill(''));

    let result = '';
    let index = 0;

    // Llenar la matriz por columnas
    for (let col = 0; col < key; col++) {
        for (let row = 0; row < numRows; row++) {
            if (index < message.length) {
                grid[row][col] = message[index++];
            }
        }
    }

    // Crear la representación de la matriz como tabla
    let matrixDisplay = '<table>';
    for (let row of grid) {
        matrixDisplay += '<tr>' + row.map(cell => `<td>${cell || ''}</td>`).join('') + '</tr>';
    }
    matrixDisplay += '</table>';

    // Leer la matriz fila por fila
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < key; col++) {
            if (grid[row][col]) {
                result += grid[row][col];
            }
        }
    }

    return { resultText: result, matrixDisplay }; // Devolver la matriz como HTML
}
