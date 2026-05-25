require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');
const attachmentRoutes = require('./routes/attachmentRoutes');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/tickets', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/tickets', attachmentRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Serveris veikia' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Serveris veikia: http://localhost:' + PORT);
});