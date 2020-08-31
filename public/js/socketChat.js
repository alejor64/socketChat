const socket = io()

if(!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html'
    throw new Error ('El nombre y sala son necesarios')
}

const usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', () => {
    console.log('Conectado al servidor')

    socket.emit('entrarChat', usuario, (res) => {
        // console.log('Usuario conectados', res)
        renderizarUsuarios(res)
    })
})

// Escuchar cuando se pierde conexión con el servidor
socket.on('disconnect', () => {
    console.log('Se perdió conexión con el servidor')
})

// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Admin',
    mensaje: 'Bienvenido'
}, function(resp) {
    console.log('respuesta server: ', resp)
})

// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Admin',
//     mensaje: 'Bienvenido'
// }, function(resp) {
//     console.log('respuesta server: ', resp)
// })

// Escuchar información cuando una persona se deconecta
socket.on('crearMensaje', (mensaje) => {
    renderizarMensajes(mensaje, false)
    scrollBottom()
})

// Escuchar cuando una usuario se conecta o desconecta
socket.on('listaPersonas', (personas) => {
    renderizarUsuarios(personas)
})

//Mensaje privados
socket.on('mensajePrivado', (mensaje) => {
    console.log('Msn privado', mensaje)
})