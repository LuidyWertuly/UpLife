const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

// Inicializa o Firebase Admin
const serviceAccount = require('./database/Uplife_DB_key.json');

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://uplife-f9bce.firebaseio.com"
});

const app = express();
app.use(cors());
app.use(express.json());

const auth = getAuth();
const db = getFirestore();

app.post('/login', async (req, res) => {
  console.log(req.body);
  const { idToken } = req.body;

  try {
    // Verifica o token de ID
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Verifica se o usuário existe no Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      throw new Error('Usuário não encontrado no banco de dados');
    }

    res.status(200).json({ message: 'Usuário autenticado com sucesso!', user_id: uid });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Falha na autenticação!', error: error.message });
  }
});

app.listen(3200, () => {
  console.log('Servidor rodando na porta 3200');
});
