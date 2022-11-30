const express = require('express')
const { Router } = express

const ContenedorArchivo = require('./contenedores/ContenedorArchivo.js')


// se crea instancia de servidor y de persistencias con archivos

const app = express()

const productosApi = new ContenedorArchivo('Productos.json')
const carritosApi = new ContenedorArchivo('Carritos.json')


// se crea variale booleana de permisos de administrador

const admin = true

function crearErrorNoEsAdmin(ruta, metodo) {
    const error = {
        error: -1,
    }
    if (ruta && metodo) {
        error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`
    } else {
        error.descripcion = 'no autorizado'
    }
    return error
}

function soloAdmins(req, res, next) {
    if (!admin) {
        res.json(crearErrorNoEsAdmin())
    } else {
        next()
    }
}

// configurar router productos

const productosRouter = new Router()

productosRouter.get('/', async (req, res) => {
    const productos = await productosApi.getAll()
    res.json(productos)
})

productosRouter.get('/:id', async (req, res) => {
    res.json(await productosApi.getById(req.params.id))
})

productosRouter.post('/', soloAdmins, async (req, res) => {
    res.json({ id: await productosApi.save(req.body) })
})

productosRouter.put('/:id', soloAdmins, async (req, res) => {
    res.json(await productosApi.update(req.body, req.params.id))
})

productosRouter.delete('/:id', soloAdmins, async (req, res) => {
    res.json(await productosApi.deleteById(req.params.id))
})


// configurar router carritos

const carritosRouter = new Router()

carritosRouter.get('/', async (req, res) => {
    res.json((await carritosApi.getAll()).map(c => c.id))
})

carritosRouter.post('/', async (req, res) => {
    res.json({ id: await carritosApi.save({ productos: [] }) })
})

carritosRouter.delete('/:id', async (req, res) => {
    res.json(await carritosApi.deleteById(req.params.id))
})

carritosRouter.get('/:id/productos', async (req, res) => {
    const carrito = await carritosApi.getById(req.params.id)
    res.json(carrito.productos)
})

carritosRouter.post('/:id/productos', async (req, res) => {
    const carrito = await carritosApi.getById(req.params.id)
    const producto = await productosApi.getById(req.body.id)
    carrito.productos.push(producto)
    await carritosApi.update(carrito, req.params.id)
    res.end()
})

carritosRouter.delete('/:id/productos/:idProd', async (req, res) => {
    const carrito = await carritosApi.getById(req.params.id)
    const index = carrito.productos.findIndex(p => p.id == req.params.idProd)
    if (index != -1) {
        carrito.productos.splice(index, 1)
        await carritosApi.update(carrito, req.params.id)
    }
    res.end()
})


// configurar el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

module.exports = app