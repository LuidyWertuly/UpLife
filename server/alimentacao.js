// Importe o Express e o CORS
const express = require('express');
const cors = require('cors');
const composicao = require('./JSON/TACO.json'); // Importe o arquivo JSON

const app = express();

// Use o middleware CORS
app.use(cors());

app.get('/:alimento', (req, res) => {
  const alimento = req.params.alimento;
  const alimentoEncontrado = composicao.find(item => item.description === alimento);

  if (alimentoEncontrado) {
    res.json(alimentoEncontrado);
  } else {
    res.status(404).send('Alimento não encontrado');
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));