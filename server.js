import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));

// File upload endpoint
app.post('/api/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.files.file;
  const users = file.data.toString().split('\n').map(line => line.trim()).filter(Boolean);

  // In a real application, this would connect to Active Directory
  // For demo purposes, we'll simulate some responses
  const results = users.map(user => {
    const random = Math.random();
    if (random < 0.3) {
      return `DESATIVADO: ${user} | Último Acesso: ${new Date().toISOString()}`;
    } else if (random < 0.4) {
      return `NÃO ENCONTRADO: ${user}`;
    }
    return null;
  }).filter(Boolean);

  res.json({ results });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});