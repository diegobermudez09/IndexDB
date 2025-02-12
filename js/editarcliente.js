(function () {

    let idCliente;
    
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');
    
    const formulario = document.querySelector('#formulario');
    
    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        let DB;

        // Actualiza el registro
        formulario.addEventListener('submit', actualizarCliente);

        // Verificar el ID de la URL
        const parametrosURL = new URLSearchParams(window.location.search) // permite buscar los parametros disponibles en la URL
        idCliente = parametrosURL.get('id');
        if (idCliente) {
            setTimeout(() => {
                obetenerCliente(idCliente);

            }, 100);
        }
    });

    function actualizarCliente(e) {
        e.preventDefault();

        if (nombreInput.value === '' || emailInput.value === '' || empresaInput.value === '' || telefonoInput.value === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // Actualizar cliente

        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente)
        };
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado); // chanca los antiguos valores

        transaction.oncomplete = function(){
            imprimirAlerta('Editado Correctamente');

            setTimeout(()=>{
                window.location.href = 'index.html';
            }, 3000);
        };

        transaction.onerror = function(){
            imprimirAlerta('Hubo un error', 'error');
        }


    }

    function obetenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readonly');

        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function (e) {
            const cursor = e.target.result;

            if (cursor) {

                if (cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        empresaInput.value = empresa;
        emailInput.value = email;
        telefonoInput.value = telefono;
    }


})();