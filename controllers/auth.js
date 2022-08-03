const { response } = require("express");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, name, password } = req.body;
  console.log(email, name, password);
  try {
    //verificar email
    console.log(Usuario);
    const usuario = await Usuario.findOne({ email: email });
    console.log(usuario);

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "el usuario ya existe con ese email",
      });
    }
    //Crear usuario con el modelo
    const dbUser = new Usuario(req.body);

    //hashear la contraseña
    const salt = bcrypt.genSaltSync(10);
    dbUser.password = bcrypt.hashSync(password, salt);

    //crear usuario de DB
    await dbUser.save();

    //Generar el JWT
    const token = await generarJWT(dbUser.id, name);

    //Generar respuesta exitosa
    return res.status(200).json({
      ok: true,
      uid: dbUser.id,
      name,
      token,
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const dbUser = await Usuario.findOne({ email });
    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        msg: "El correo no existe",
      });
    }
    //confirmar si el password hace matcher
    const validarPassword = bcrypt.compareSync(password, dbUser.password);
    if (!validarPassword) {
      ok: false;
      console.log("El password no es valido");
    }

    //generar jwt
    const token = await generarJWT(dbUser.id, dbUser.name);

    return res.json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Pongase en contacto con el administrador",
    });
  }
};

const revalidarToken = async (req, res) => {
  const { uid, name } = req;

  try {
    const token = await generarJWT(uid, name);

    return res.json({
      ok: true,
      uid,
      name,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Pongase en contacto con el administrador",
    });
  }
};

module.exports = {
  crearUsuario,
  login,
  revalidarToken,
};
