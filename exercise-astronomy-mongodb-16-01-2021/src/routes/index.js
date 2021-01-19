const route = require('express').Router()

// Middleware para el enrutado de Landings
route.use('/landings', require('./landings'))


// Middleware para el enrutado de los NEAs

// Middleware para el enrutado de Users

module.exports = route