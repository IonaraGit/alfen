function expirar (req, res, next) {
  if (!req.session.colaborador) {
    // A sessão expirou, redireciona o usuário para outra página
    return res.redirect('/acesso ');
  }
  next();
};

module.exports = expirar