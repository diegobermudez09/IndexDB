(function(){

    let DB; 

    document.addEventListener('DOMContentLoaded', () =>{
        crearDB();
    });

    // Crea la base de datos
    function crearDB(){
        const crearDB = window.indexedDB.open('crm', 1); // crear el INDEXDB

        // si sucede algun error
        crearDB.onerror = function(){
            console.log('Hubo un error');
        }
        // si se creo correctamente
        crearDB.onsuccess = function(){
            DB = crearDB.result; // si la base de datos se crea correctamente se asigna a esa variable
        }

        // funcion que corre solo una vez:onupgradeneeded
        crearDB.onupgradeneeded = function(e){
            const db = e.target.result; //el resultado de lo que se ejecuta de la funcion (la bd)

            const objectStore = db.createObjectStore('crm', {keyPath: 'id', autoIncrement:true}) // se crea la tabla
            objectStore.createIndex('nombre', ' ', {unique: false}); // se crea la columna de la tabla
            objectStore.createIndex('email', 'email', {unique: true}); // se crea la columna de la tabla
            objectStore.createIndex('telefono', 'telefono', {unique: false}); // se crea la columna de la tabla
            objectStore.createIndex('empresa', 'empresa', {unique: false}); // se crea la columna de la tabla
            objectStore.createIndex('id', 'id', {unique: true}); // se crea la columna de la tabla

            console.log('DB Lista y Creada'); // si se ejecuta esta linea todo lo demas esta creado
        }


    }

})();