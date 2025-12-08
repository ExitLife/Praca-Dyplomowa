const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // 1. Pobierz nagłówek z tokenem (wygląda tak: "Bearer eyJhbGci...")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bierzemy tylko drugą część po spacji

  // 2. Jeśli nie ma tokena -> Błąd 401 (Unauthorized)
  if (!token) return res.status(401).json({ error: 'Brak dostępu' });

  // 3. Sprawdź czy token jest ważny
  jwt.verify(token, process.env.JWT_SECRET || 'sekret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token nieprawidłowy' });
    
    // 4. Jeśli OK, zapisz dane użytkownika w obiekcie żądania (req.user)
    req.user = user;
    next(); // Przejdź dalej do właściwej funkcji
  });
}

module.exports = authenticateToken;