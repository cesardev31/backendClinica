const Paciente = require("../models/pacienteModel"); 
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


const registrarPaciente = async (req, res) => {
  try {
    const datosPaciente = req.body;

    // Cifra la contraseña antes de almacenarla
    const salt = await bcrypt.genSalt(10);
    const contraseñaCifrada = await bcrypt.hash(datosPaciente.contraseña, salt);

    const pacienteExistente = await Paciente.buscarPorCedulaOCorreo(
      datosPaciente.cedula,
      datosPaciente.correo
    );

    if (pacienteExistente) {
      return res
        .status(400)
        .json({
          error:
            "Ya existe un paciente registrado con la misma cédula o correo",
        });
    }

    const nuevoPaciente = new Paciente({
      ...datosPaciente,
      contraseña: contraseñaCifrada,
    });

    await nuevoPaciente.save();
    console.log("Paciente registrado:", nuevoPaciente);

    res.json({
      mensaje: "Paciente registrado exitosamente",
      paciente: nuevoPaciente,
    });
  } catch (error) {
    console.error("Error al registrar el paciente:", error);
    res.status(500).json({ error: "Error al registrar el paciente" });
  }
};

const listarPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    res.json({ pacientes });
  } catch (error) {
    console.error("Error al listar los pacientes:", error);
    res.status(500).json({ error: "Error al listar los pacientes" });
  }
};

const eliminarPacientePorCedula = async (req, res) => {
  try {
    const cedula = req.params.cedula;

    // Buscar y eliminar el paciente por cédula
    const pacienteEliminado = await Paciente.findOneAndDelete({ cedula });

    if (!pacienteEliminado) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    res.json({
      mensaje: "Paciente eliminado exitosamente",
      paciente: pacienteEliminado,
    });
  } catch (error) {
    console.error("Error al eliminar el paciente:", error);
    res.status(500).json({ error: "Error al eliminar el paciente" });
  }
};

const buscarPacientePorCedula = async (req, res) => {
  try {
    const cedula = req.params.cedula;
    const pacienteEncontrado = await Paciente.buscarPorCedula(cedula);

    if (!pacienteEncontrado) {
      return res.status(404).json({ mensaje: "Paciente no encontrado" });
    }

    res.json({ paciente: pacienteEncontrado });
  } catch (error) {
    console.error("Error al buscar el paciente:", error);
    res.status(500).json({ error: "Error al buscar el paciente" });
  }
};

const actualizarPacientePorCedula = async (req, res) => {
  try {
    const cedula = req.params.cedula; // Obtener la cédula del parámetro en la URL
    const nuevosDatos = req.body; // Obtener los nuevos datos desde el body

    // Buscar al paciente por su cédula
    const paciente = await Paciente.buscarPorCedula(cedula);

    if (!paciente) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    // Actualizar los datos del paciente con los nuevos datos
    Object.assign(paciente, nuevosDatos);
    await paciente.save();

    res.json({ mensaje: "Datos del paciente actualizados", paciente });
  } catch (error) {
    console.error("Error al actualizar los datos del paciente:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar los datos del paciente" });
  }
};

const iniciarSesion = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const paciente = await Paciente.buscarPorCorreo(correo);

    if (!paciente) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const contraseñaCorrecta = await bcrypt.compare(contraseña, paciente.contraseña);
    if (!contraseñaCorrecta) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: paciente.id }, 'Di mi nombre123', { expiresIn: '1h' });

    res.json({ mensaje: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }

};

module.exports = {
  registrarPaciente,
  listarPacientes,
  eliminarPacientePorCedula,
  buscarPacientePorCedula,
  actualizarPacientePorCedula,
  iniciarSesion
};
