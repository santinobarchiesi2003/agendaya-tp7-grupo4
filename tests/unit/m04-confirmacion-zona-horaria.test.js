/**
 * M04 - Texto de la confirmacion de la reserva
 * Responsable: Navarro Matias
 * Funcion: textoConfirmacion
 *
 * Tests de regresion de INC-0452: un invitado con el dispositivo en otra zona
 * horaria veia en la confirmacion el turno corrido una hora.
 *
 * Los tests unitarios corren con el reloj en La Paz (UTC-4), ver
 * tests/zona-horaria.js. La agenda esta en hora de Mendoza (UTC-3), asi que el
 * proceso de test hace de dispositivo del invitado en otra zona horaria.
 */
const { textoConfirmacion } = require("../../src/logica/reservas");

const reserva = { nombre: "Juan Perez", fecha: "2026-10-13", hora: "10:00" };

describe("textoConfirmacion (INC-0452)", () => {
  it("el dispositivo de prueba esta una hora atras de la agenda (precondicion del escenario)", () => {
    // Las 10:00 de Mendoza son las 13:00 UTC y las 09:00 de La Paz
    expect(new Date("2026-10-13T13:00:00.000Z").getHours()).toBe(9);
  });

  it("muestra el horario que eligio el invitado aunque su dispositivo este en otra zona horaria", () => {
    expect(textoConfirmacion(reserva, 60)).toBe("Juan Perez, te esperamos el 2026-10-13 de 10:00 a 11:00 h.");
  });

  it("calcula el fin del turno con la duracion indicada (caso borde: turno de 45 minutos)", () => {
    expect(textoConfirmacion({ ...reserva, hora: "16:15" }, 45)).toBe(
      "Juan Perez, te esperamos el 2026-10-13 de 16:15 a 17:00 h."
    );
  });

  it("si no se indica la duracion usa la de la agenda, 60 minutos", () => {
    expect(textoConfirmacion(reserva)).toBe("Juan Perez, te esperamos el 2026-10-13 de 10:00 a 11:00 h.");
  });
});
