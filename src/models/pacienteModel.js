const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  cedula: Number,
  fechaNacimiento: Date,
  grupoSanguineo: String,
  genero: String,
  correo: String,
  celular: Number,
  historialClinico: String,
  contraseña: String
});

pacienteSchema.statics.buscarPorCedulaOCorreo = async function(cedula, correo) {
  return await this.findOne({ $or: [{ cedula }, { correo }] });
};
pacienteSchema.statics.buscarPorCedula = async function (cedula) {
  return this.findOne({ cedula });
};
pacienteSchema.statics.buscarPorCorreo = async function (correo) {
  return this.findOne({ correo });
};

const Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;
