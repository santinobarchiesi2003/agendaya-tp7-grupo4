/**
 * Reglas de ESLint (buenas practicas de JavaScript) para todo el repositorio.
 *
 * El proyecto mezcla varios entornos, y cada uno tiene sus variables globales:
 *   - server/, tests/ y archivos de configuracion: Node con CommonJS
 *   - src/logica/: modulos que cargan igual en Node y en el navegador
 *   - frontend/: scripts de navegador, tambien los que estan dentro del HTML
 *   - cypress/: tests E2E (modulos ES con las globales de Cypress y Mocha)
 */
const js = require("@eslint/js");
const globals = require("globals");
const html = require("eslint-plugin-html");

/** Lo que cada pantalla recibe de los <script> anteriores (comun.js y src/logica). */
const globalesDePantalla = {
  AgendaValidaciones: "readonly",
  AgendaReservas: "readonly",
  mostrarError: "readonly",
  mostrarExito: "readonly",
  ocultarAvisos: "readonly",
  marcarError: "readonly",
  limpiarErrores: "readonly",
  pedir: "readonly",
  guardarSesion: "readonly",
  leerSesion: "readonly",
  cerrarSesion: "readonly",
};

module.exports = [
  {
    ignores: [
      "node_modules/",
      "coverage/",
      "dist/",
      "data/",
      "docs/",
      "cypress/screenshots/",
      "cypress/videos/",
    ],
  },

  js.configs.recommended,

  {
    rules: {
      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "error",
      curly: ["error", "multi-line"],
    },
  },

  {
    files: ["server/**/*.js", "scripts/**/*.js", "*.config.js"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },

  {
    files: ["src/logica/**/*.js"],
    languageOptions: { sourceType: "commonjs", globals: { ...globals.node, self: "readonly" } },
  },

  {
    files: ["tests/**/*.js"],
    languageOptions: { sourceType: "commonjs", globals: { ...globals.node, ...globals.jest } },
  },

  {
    files: ["cypress/**/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.mocha,
        cy: "readonly",
        Cypress: "readonly",
        expect: "readonly",
      },
    },
  },

  {
    // Sus funciones no se usan en el archivo: las llaman las pantallas
    files: ["frontend/**/*.js"],
    languageOptions: { sourceType: "script", globals: globals.browser },
    rules: { "no-unused-vars": ["error", { vars: "local" }] },
  },

  {
    files: ["frontend/**/*.html"],
    plugins: { html },
    languageOptions: { sourceType: "script", globals: { ...globals.browser, ...globalesDePantalla } },
  },
];
