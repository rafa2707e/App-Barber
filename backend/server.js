const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB (usando MongoDB Atlas ou local)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barbearia', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Modelo de Agendamento
const appointmentSchema = new mongoose.Schema({
  barber: String,
  date: String,
  time: String,
  user: String,
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Rotas
app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/appointments', async (req, res) => {
  try {
    const { barber, date, time, user } = req.body;
    const newAppointment = new Appointment({ barber, date, time, user });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Horários disponíveis (simulação)
app.get('/available-times', (req, res) => {
  const times = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];
  res.json(times);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
