const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');

const onlineUsers = new Map(); // userId → user info
const connectedSockets = new Map(); // socket.id → userId

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Pokédex', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ Connexion à MongoDB réussie !'))
    .catch((err) => console.error('Erreur MongoDB :', err));

const userSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    age: Number,
    email: { type: String, unique: true },
    password: String,
});

const User = mongoose.model('User', userSchema);

// ✅ Authentifie un JWT et retourne l'userId
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, 'ton_secret');
        return decoded.userId;
    } catch {
        return null;
    }
}

// 🔥 Emit à tous les clients la liste à jour
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

        const token = jwt.sign({ userId: user._id }, 'ton_secret', { expiresIn: '1h' });

        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (err) {
        res.status(400).json({ error: 'Erreur connexion', message: err.message });
    }
});

// 🌍 Récupération à la demande
app.get('/api/online-users', (req, res) => {
    const users = Array.from(onlineUsers.entries()).map(([userId, user]) => ({
        id: userId,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom
    }));
    res.json(users);
});

// ⚡ Gestion WebSocket
io.on('connection', (socket) => {
    console.log('🟢 Nouvelle connexion socket');

    socket.on('auth', async (token) => {
        const userId = verifyToken(token);
        if (!userId) {
            socket.disconnect();
            return;
        }

        // Récupère les infos utilisateur
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

            // Vérifie si d'autres sockets utilisent ce userId
            const stillConnected = [...connectedSockets.values()].includes(userId);
            if (!stillConnected) {
                onlineUsers.delete(userId);
            }

            emitOnlineUsers();
        }
        console.log('🔴 Socket déconnecté');
    });
});

// 🕐 Nettoyage auto toutes les 5 min
setInterval(() => {
    const now = Date.now();
    const TIMEOUT = 30 * 60 * 1000; // 30 min

    for (const [userId, user] of onlineUsers.entries()) {
        if (now - user.lastSeen > TIMEOUT) {
            onlineUsers.delete(userId);
        }
    }

    emitOnlineUsers();
}, 5 * 60 * 1000);

server.listen(PORT, () => {
    console.log(`🚀 Serveur backend WebSocket lancé sur http://localhost:${PORT}`);
});
