import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../dao/models/user.model';

// Controlador para manejar el inicio de sesión y la generación de tokens
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const payload = {
      sub: user._id
    };
    const token = jwt.sign(payload, 'jwt_secretkey', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};
