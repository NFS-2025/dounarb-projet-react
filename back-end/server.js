require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');

const onlineUsers = new Map();
const connectedSockets = new Map();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ Connecté à MongoDB Atlas'))
    .catch((err) => console.error('❌ Erreur MongoDB :', err));

const userSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    age: Number,
    email: { type: String, unique: true },
    password: String,
});

const User = mongoose.model('User', userSchema);

// ✅ Vérifie le JWT
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } catch {
        return null;
    }
}

// 🔁 Envoie la liste des utilisateurs connectés
function emitOnlineUsers() {
    const users = Array.from(onlineUsers.entries()).map(([userId, user]) => ({
        id: userId,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom
    }));
    io.emit('online-users', users);
}

// 🔐 Connexion
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Champs requis.' });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Utilisateur non trouvé.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Mot de passe incorrect.' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (err) {
        res.status(400).json({ error: 'Erreur connexion', message: err.message });
    }
});

// ✅ Inscription
app.post('/api/register', async (req, res) => {
    const { nom, prenom, age, email, password } = req.body;
    if (!nom || !prenom || !age || !email || !password)
        return res.status(400).json({ error: 'Tous les champs sont requis.' });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email déjà utilisé.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ nom, prenom, age, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Inscription réussie' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', message: err.message });
    }
});


// 🔍 Liste à la demande
app.get('/api/online-users', (req, res) => {
    const users = Array.from(onlineUsers.entries()).map(([userId, user]) => ({
        id: userId,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom
    }));
    res.json(users);
});

// ⚡ WebSockets
io.on('connection', (socket) => {
    console.log('🟢 Nouvelle connexion socket');

    socket.on('auth', async (token) => {
        const userId = verifyToken(token);
        if (!userId) {
            socket.disconnect();
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            socket.disconnect();
            return;
        }

        onlineUsers.set(userId, {
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            lastSeen: Date.now()
        });

        connectedSockets.set(socket.id, userId);
        emitOnlineUsers();
    });

    socket.on('disconnect', () => {
        const userId = connectedSockets.get(socket.id);
        if (userId) {
            connectedSockets.delete(socket.id);

            const stillConnected = [...connectedSockets.values()].includes(userId);
            if (!stillConnected) {
                onlineUsers.delete(userId);
            }

            emitOnlineUsers();
        }
        console.log('🔴 Socket déconnecté');
    });
});

// 🧹 Auto-clean
setInterval(() => {
    const now = Date.now();
    const TIMEOUT = 30 * 60 * 1000;

    for (const [userId, user] of onlineUsers.entries()) {
        if (now - user.lastSeen > TIMEOUT) {
            onlineUsers.delete(userId);
        }
    }

    emitOnlineUsers();
}, 5 * 60 * 1000);

server.listen(PORT, () => {
    console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
});
