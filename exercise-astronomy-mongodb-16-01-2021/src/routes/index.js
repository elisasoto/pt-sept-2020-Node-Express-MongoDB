const route = require('express').Router()

// Middleware para el enrutado de Landings
route.use('/landings', require('./landings'))


// Middleware para el enrutado de los NEAs
route.use('/neas', require('./neas'))

// Middleware para el enrutado de Users
route.use('/guild', require('./users'))

module.exports = route