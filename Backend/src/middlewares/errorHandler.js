const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Erros de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.message
    });
  }

  // Erros de não encontrado
  if (err.message.includes('não encontrada')) {
    return res.status(404).json({
      error: err.message
    });
  }

  // Erros do banco de dados
  if (err.code === '23505') { // Código de erro de violação de chave única
    return res.status(409).json({
      error: 'Conflito: registro já existe'
    });
  }

  // Erro genérico
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler; 