(function () {

    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');


    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        if (window.indexedDB.open('crm', 1)) {
            obtenerClientes();
        }
        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    function eliminarRegistro(e) {
        if (e.target.classList.contains('eliminar')) {
            const idEliminar = Number(e.target.dataset.cliente);

        const confirmar = confirm('¿Deseas eliminar este cliente?');


            if (confirmar) {
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idEliminar);

                transaction.oncomplete = function () {

                    e.target.parentElement.parentElement.remove();
                }
                transaction.onerror = function () {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo un error",
                    });
                }
            }

        }
    }


    // Crea la base de datos
    function crearDB() {
        const crearDB = window.indexedDB.open('crm', 1); // crear el INDEXDB

        // si sucede algun error
        crearDB.onerror = function () {
            console.log('Hubo un error');
        }
        // si se creo correctamente
        crearDB.onsuccess = function () {
            DB = crearDB.result; // si la base de datos se crea correctamente se asigna a esa variable
        }

        // funcion que corre solo una vez:onupgradeneeded
        crearDB.onupgradeneeded = function (e) {
            const db = e.target.result; //el resultado de lo que se ejecuta de la funcion (la bd)

            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true }) // se crea la tabla
            objectStore.createIndex('nombre', ' ', { unique: false }); // se crea la columna de la tabla
            objectStore.createIndex('email', 'email', { unique: true }); // se crea la columna de la tabla
            objectStore.createIndex('telefono', 'telefono', { unique: false }); // se crea la columna de la tabla
            objectStore.createIndex('empresa', 'empresa', { unique: false }); // se crea la columna de la tabla
            objectStore.createIndex('id', 'id', { unique: true }); // se crea la columna de la tabla

            console.log('DB Lista y Creada'); // si se ejecuta esta linea todo lo demas esta creado
        }


    }

    function obtenerClientes() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function () {
            console.log('Hubo un error');
        };

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function (e) { // abrimos un cursos para iterar(el cursor itera por si mismo)
                const cursor = e.target.result; // el resultado ejecutado por el evento

                if (cursor) { // se posiciona en la posicion 0 hasta el final
                    const { nombre, empresa, email, telefono, id } = cursor.value;


                    listadoClientes.innerHTML += `
                     <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                    <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                    <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                    <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                    <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                    <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                    <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>
                        `;

                    cursor.continue(); //para ir a la siguiente posicion y asi sucesivamente... 

                } else {
                    console.log('No hay más registros...');
                }
            }
        }
    }


})();