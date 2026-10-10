/**
 * M04 - Booking publico | Test de regresion de INC-0452
 * Reproduce el incidente como lo reporto Soporte: un invitado reserva desde el
 * telefono y su dispositivo esta en otra zona horaria que la agenda del
 * administrador (Mendoza, UTC-3).
 * Responsable: Navarro Matias
 * Trazabilidad: INC-0452 / AYA-M04-RF-03
 */
import { proximoDiaHabil } from "../support/fechas";

/**
 * Cambia la zona horaria del navegador con el protocolo de depuracion de
 * Chrome (sirve en Electron, Chrome y Edge). Con "" vuelve a la del sistema.
 */
function usarZonaHoraria(zona) {
  return cy.wrap(
    Cypress.automation("remote:debugger:protocol", {
      command: "Emulation.setTimezoneOverride",
      params: { timezoneId: zona },
    }),
    { log: false }
  );
}

describe("AgendaYA - M04 Booking: confirmacion y zona horaria del dispositivo (INC-0452)", () => {
  // Se calcula antes de cambiar la zona del navegador, con el mismo reloj que usa el servidor
  const dia = proximoDiaHabil();
  const confirmacionEsperada = "Juan Perez, te esperamos el " + dia + " de 10:00 a 11:00 h.";

  afterEach(() => {
    usarZonaHoraria("");
  });

  function reservarLasDiezDesdeUnTelefonoEn(zona) {
    // Arrange: telefono con esa zona horaria, turno de las 10:00 y datos del invitado
    usarZonaHoraria(zona);
    cy.viewport("iphone-x");
    cy.visit("/reservar.html");
    cy.get('[data-cy="fecha-input"]').type(dia);
    cy.get('[data-cy="slot-1000"]').should("be.enabled").click();
    cy.get('[data-cy="nombre-input"]').type("Juan Perez");
    cy.get('[data-cy="email-input"]').type("juan.perez@ejemplo.com");

    // Act: confirmar la reserva
    cy.get('[data-cy="submit-booking"]').click();
    cy.get('[data-cy="booking-confirmation"]').should("be.visible");
  }

  it("con el telefono en la zona horaria de la agenda confirma el horario elegido", () => {
    reservarLasDiezDesdeUnTelefonoEn("America/Argentina/Mendoza");

    // Assert: caso de control, es el que veiamos nosotros al probar
    cy.get('[data-cy="booking-detalle"]').should("have.text", confirmacionEsperada);
  });

  it("con el telefono en otra zona horaria confirma el mismo horario que eligio el invitado", () => {
    reservarLasDiezDesdeUnTelefonoEn("America/La_Paz");

    // Assert: la reserva guardada y el correo tienen el horario de la agenda...
    cy.request("/api/reservas").its("body").its(0).its("hora").should("eq", "10:00");
    cy.task("leerCorreos").should("contain", "Turno:   " + dia + " 10:00 h");
    // ...y la confirmacion en pantalla tambien. Aca estaba el defecto: decia "de 09:00 a 10:00 h."
    cy.get('[data-cy="booking-detalle"]').should("have.text", confirmacionEsperada);
  });
});
