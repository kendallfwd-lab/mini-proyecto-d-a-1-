const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const usuarioRoute = require('./routes/usuarioRoute');

app.get('/', (req, res) => {
    res.json({ message: 'API ConstruccionBE activa' });
});

app.use('/usuario', usuarioRoute);

const PORT = Number(process.env.PORT || 3000);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
    });
}

module.exports = app;
