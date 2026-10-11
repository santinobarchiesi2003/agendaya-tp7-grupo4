/**
 * Zona horaria de los tests unitarios (globalSetup de Jest).
 *
 * Los tests corren siempre como si el dispositivo estuviera en La Paz (UTC-4),
 * una hora atras de la agenda del administrador (Mendoza, UTC-3).
 *
 * Con el reloj de la maquina en la misma zona que la agenda, un calculo que usa
 * sin querer la zona horaria del dispositivo da bien y el error no se ve. Asi
 * llego INC-0452 a produccion. Fijar aca una zona distinta lo hace visible en
 * cualquier maquina y en el pipeline.
 */
module.exports = async function fijarZonaHoraria() {
  process.env.TZ = "America/La_Paz";
};
