const express = require('express');
const sequelize = require('./db');
const pessoasRouter = require('./routes/usuarios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/pessoas', pessoasRouter);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
