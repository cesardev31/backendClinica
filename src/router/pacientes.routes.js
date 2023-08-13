const {Router} = require('express');
const router = Router();

const pacienteController = require('../controller/pacienteController');

router.post('/registrarPaciente',pacienteController.registrarPaciente);
router.get('/listarPacientes',pacienteController.listarPacientes);
router.delete('/eliminarPacientePorCedula/:cedula',pacienteController.eliminarPacientePorCedula);
router.get('/buscarPorCedula/:cedula', pacienteController.buscarPacientePorCedula);
router.put('/actualizarpaciente/:cedula', pacienteController.actualizarPacientePorCedula);
router.post('/iniciarsesion', pacienteController.iniciarSesion);




module.exports = router