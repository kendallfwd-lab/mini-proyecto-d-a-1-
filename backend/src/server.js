require('dotenv').config(); const app = require('./app'); const port = Number(process.env.PORT || 3010); app.listen(port, () => console.log(`API Business Inventory en http://localhost:${port}`));
