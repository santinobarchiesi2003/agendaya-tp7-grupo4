/**
 * Build de AgendaYA: arma el paquete versionado que se despliega.
 *
 * JavaScript no se compila y el proyecto no usa un empaquetador, asi que el
 * build no transforma codigo. Lo que hace es juntar lo que corre en el servidor
 * (server/, src/ y frontend/, segun "files" de package.json) en
 * dist/<nombre>-<version>.tgz y comprobar que el paquete este completo.
 * Ese archivo es el que se instala en cada ambiente, y el de la version
 * anterior es el que se vuelve a instalar si hay que revertir.
 *
 *   npm run build
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const RAIZ = path.join(__dirname, "..");
const DESTINO = path.join(RAIZ, "dist");
const CARPETAS_DE_LA_APP = ["server", "src", "frontend"];
const NO_SE_DESPLIEGA = ["tests/", "cypress/", "docs/", "data/", "scripts/", ".github/"];

function archivosDe(carpeta) {
  return fs.readdirSync(path.join(RAIZ, carpeta), { withFileTypes: true }).flatMap((entrada) => {
    const ruta = carpeta + "/" + entrada.name;
    return entrada.isDirectory() ? archivosDe(ruta) : [ruta];
  });
}

fs.rmSync(DESTINO, { recursive: true, force: true });
fs.mkdirSync(DESTINO);

const salida = execSync("npm pack --json --pack-destination dist", { cwd: RAIZ, encoding: "utf8" });
const paquete = JSON.parse(salida)[0];
const empaquetados = paquete.files.map((archivo) => archivo.path);

const faltan = CARPETAS_DE_LA_APP.flatMap(archivosDe).filter((ruta) => !empaquetados.includes(ruta));
const sobran = empaquetados.filter((ruta) => NO_SE_DESPLIEGA.some((carpeta) => ruta.startsWith(carpeta)));

if (faltan.length || sobran.length) {
  if (faltan.length) console.error("Faltan en el paquete:\n  " + faltan.join("\n  "));
  if (sobran.length) console.error("No deberian estar en el paquete:\n  " + sobran.join("\n  "));
  console.error('\nBuild fallido: revisar "files" en package.json.');
  process.exit(1);
}

console.log("Build de " + paquete.name + " " + paquete.version);
console.log("  Paquete:  dist/" + paquete.filename);
console.log(
  "  Archivos: " + paquete.entryCount + " (" + (paquete.size / 1024).toFixed(1) + " kB comprimido)"
);
console.log("  SHA-1:    " + paquete.shasum);
