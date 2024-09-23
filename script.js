// Cifrar
document.getElementById('cesarFormCifrar').addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar recargar la página

    const text = document.getElementById('textCifrar').value;
    const shift = parseInt(document.getElementById('shiftCifrar').value);
    const resultText = cesarCipher(text, shift);

    document.getElementById('resultTextCifrar').innerText = resultText;
});
document.getElementById('copyCifradoBtn').addEventListener('click', function() {
    // Obtiene el texto del párrafo
    var textoCifrado = document.getElementById('resultTextCifrar').innerText;

    // Crea un elemento de área de texto temporal para copiar el contenido
    var tempTextArea = document.createElement("textarea");
    tempTextArea.value = textoCifrado;
    document.body.appendChild(tempTextArea);

    // Selecciona y copia el texto
    tempTextArea.select();
    document.execCommand("copy");

    // Elimina el área de texto temporal
    document.body.removeChild(tempTextArea);

    // Opción: mostrar un mensaje de confirmación
    //alert("Texto copiado al portapapeles");
});
// Descifrar
document.getElementById('cesarFormDescifrar').addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar recargar la página

    const text = document.getElementById('textDescifrar').value;
    const shift = parseInt(document.getElementById('shiftDescifrar').value);
    const resultText = cesarCipher(text, -shift); // Usar el desplazamiento negativo para descifrar

    document.getElementById('resultTextDescifrar').innerText = resultText;
});
document.getElementById('copyDescifradoBtn').addEventListener('click', function() {
    // Obtiene el texto del párrafo
    var textoDescifrado = document.getElementById('resultTextDescifrar').innerText;

    // Crea un elemento de área de texto temporal para copiar el contenido
    var tempTextArea = document.createElement("textarea");
    tempTextArea.value = textoDescifrado;
    document.body.appendChild(tempTextArea);

    // Selecciona y copia el texto
    tempTextArea.select();
    document.execCommand("copy");

    // Elimina el área de texto temporal
    document.body.removeChild(tempTextArea);

    // Opción: mostrar un mensaje de confirmación
    //alert("Texto descifrado copiado al portapapeles");
});

// Función para el cifrado César
function cesarCipher(text, shift) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    for (let i = 0; i < text.length; i++) {
        let char = text[i].toUpperCase();
        if (alphabet.includes(char)) {
            let newIndex = (alphabet.indexOf(char) + shift) % 26;
            if (newIndex < 0) newIndex += 26; // Ajuste para desplazamientos negativos
            result += alphabet[newIndex];
        } else {
            result += char; // Dejar otros caracteres sin cambios (espacios, puntuación)
        }
    }
    return result;
    
}
