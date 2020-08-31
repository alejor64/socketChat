const { io } = require('../server')
const {Usuarios} = require('../classes/usuario')
const {crearMensaje} = require('../utilidades/utilidades')

const usuarios = new Usuarios()

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        // console.log(data)

        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            })
        }

        client.join(data.sala)

        usuarios.agregarPersona(client.id, data.nombre, data.sala)

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala))
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Admin', `${data.nombre} se ha conectado`))

        callback(usuarios.getPersonasPorSala(data.sala))

    })

    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje(persona.nombre, data.mensaje)
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)

        callback(mensaje)
    })

    client.on('disconnect', () => {
        let personaDesconectada = usuarios.borrarPersona(client.id)

        client.broadcast.to(personaDesconectada.sala).emit('crearMensaje', crearMensaje('Admin', `${personaDesconectada.nombre} se ha desconectado`))
        client.broadcast.to(personaDesconectada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaDesconectada.sala))

    })

    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id)

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })

});