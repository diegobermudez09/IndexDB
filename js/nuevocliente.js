// un IFFE crea todo de manera local, es decir que las variables no van a estar globalizadas
(function () {

    const formulario = document.querySelector('#formulario');
    
    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        let DB;

        formulario.addEventListener('submit', validarCliente);
    });



    function validarCliente(e) {
        e.preventDefault();

        // Leer todos los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // Crear un objeto con la información
        const cliente = { nombre, email, telefono, empresa, id: Date.now() };

        crearNuevoCliente(cliente);
    }


    function crearNuevoCliente(cliente){
        const transaction = DB.transaction(['crm'], 'readwrite'); // hacemos la transaccion(base de datos, permisos para agregar)
        
        const objectStore = transaction.objectStore('crm'); // objectStore el que hace las acciones

        objectStore.add(cliente);

        transaction.onerror = function(){
            imprimirAlerta('Hubo un error', 'error');

        };

        transaction.oncomplete = function(){
            imprimirAlerta('El cliente se agrego correctamente');

            setTimeout(()=>{
                window.location.href = 'index.html';
            }, 3000);
        }
    }

})();