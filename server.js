const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const MATERIAS  = ['Algebra', 'Calculo', 'Geometria', 'Trigonometria', 'Estadistica'];
const ESCUELAS  = ['Secundaria Benito Juarez', 'Preparatoria Lazaro Cardenas', 'Universidad Autonoma'];

app.get('/api/alumnos', async (req, res) => {
  const { data, error } = await supabase.from('alumnos').select('*').order('nombre');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/alumnos', async (req, res) => {
  const { nombre, escuela, materia, cobro } = req.body;
  const { data, error } = await supabase.from('alumnos').insert([{ nombre, escuela, materia, cobro }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/alumnos/:id', async (req, res) => {
  const { nombre, escuela, materia, cobro } = req.body;
  const { data, error } = await supabase.from('alumnos').update({ nombre, escuela, materia, cobro }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/alumnos/:id', async (req, res) => {
  const { error } = await supabase.from('alumnos').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.get('/api/catalogo', (req, res) => {
  res.json({ materias: MATERIAS, escuelas: ESCUELAS });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
