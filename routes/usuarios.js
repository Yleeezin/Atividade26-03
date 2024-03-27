const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Usuario = require('../models/users');
const { cpf } = require('cpf-cnpj-validator');

router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const novoUsuario = req.body;
    if (!cpf.isValid(novoUsuario.cpf)) {
      return res.status(400).json({ message: 'CPF inválido' });
    }
    const usuario = await Usuario.create(novoUsuario);
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Filtro CPF
router.get('/filtro/:cpf', async (req, res) => {
  const { cpf } = req.params;
  try {
    const usuario = await Usuario.findOne({ where: { cpf } });
    if (!usuario) {
      return res.status(404).json({ message: 'Pessoa não encontrada' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const novosDados = req.body;

  try {
   
    if (novosDados.cpf && !cpf.isValid(novosDados.cpf)) {
      return res.status(400).json({ message: 'CPF inválido' });
    }

    
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Pessoa não encontrada' });
    }
    await usuario.update(novosDados);

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Pessoa não encontrada' });
    }

    
    await usuario.destroy();

    res.json({ message: 'Pessoa excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
