const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

var serviceAccount = require('./database/Uplife_DB_key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

const app = express();

app.use(cors());
app.use(express.json());

let tempUser = {};
let tempUserId = '';

app.post('/registro1', async (req, res) => {
  console.log(req.body);

  let autenticacao = {
    email: req.body.email,
    senha: req.body.senha
  };

  tempUser = {
    nome: req.body.nome,
    email: req.body.email,
    DTnascimento: req.body.DTnascimento,
    fotoPerfil: req.body.fotoPerfil,
  };

  try {

    // Verificar se o e-mail já está em uso no Firebase Authentication
    let verificarEmail = await admin.auth().getUserByEmail(autenticacao.email);

    res.status(400).json({ message: 'Email já está em uso!' });

  } catch (error) {

    if (error.code === 'auth/user-not-found') {
      // E-mail não encontrado, criar usuário
      try {
        const autenticacaoSave = await admin.auth().createUser({
          email: autenticacao.email,
          password: autenticacao.senha
        });

        tempUserId = autenticacaoSave.uid;

        res.status(200).json({ message: 'Dados do primeiro formulário recebidos!' });
      } catch (createError) {
        res.status(500).json({ message: 'Erro ao criar usuário!', error: createError.message });
      }
    } else {
      res.status(500).json({ message: 'Erro ao verificar e-mail!', error: error.message });
    }
  }
});


app.post('/registro2', async (req, res) => {
  console.log(req.body);
  
  let user = { ...tempUser, ...req.body, user_id: tempUserId };

  let salvarDados = db.collection('users').doc(tempUserId).set(user);
  
  salvarDados.then(() => {

    console.log('Dados gravados com sucesso!');
    res.status(200).json({ message: 'Dados do segundo formulário recebidos!' });

  }).catch((error) => {

    console.error('Erro ao gravar dados:', error);
    res.status(500).json({ message: 'Erro ao gravar dados!' });

  });

});

app.listen(3300, () => console.log('Servidor rodando na porta 3300'));
