const express = require('express');
const cors = require('cors');
const exercicios = require('./JSON/atividades.json'); // Importe o arquivo JSON

const app = express();

// Use o middleware CORS
app.use(cors());

app.get('/:atividade', (req, res) => {
    const atividade = req.params.atividade;
    const exerciciosEncontrado = exercicios.filter(item => item.bodypart === atividade);
  
    if (exerciciosEncontrado) {
      res.json(exerciciosEncontrado);
    } else {
      res.status(404).send('Atividade nÃ£o encontrada');
    }
});
  
app.listen(3100, () => console.log('Servidor rodando na porta 3100'));