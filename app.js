const express = require("express");
const cors = require("cors");
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(cors());
app.use(express.json());

// Evita que un salto de línea accidental copiado desde Postman rompa la ruta
// y termine llegando como /usuario%0A.
app.use((req, res, next) => {
    req.url = req.url.replace(/(?:%0A|%0D|\r|\n)+$/i, '');
    next();
});

const usuarioRoute = require('./routes/usuarioRoute');
const authRoute = require('./routes/authRoute');
const proyectoRoute = require('./routes/proyectoRoute');

app.get('/', (req, res) => {
    res.json({ message: 'API ConstruccionBE activa' });
});
app.use('/app', express.static(path.join(__dirname, 'frontend')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/usuario', usuarioRoute);
app.use('/auth', authRoute);
app.use('/proyecto', proyectoRoute);

const PORT = Number(process.env.PORT || 3000);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
    });
}

module.exports = app;
