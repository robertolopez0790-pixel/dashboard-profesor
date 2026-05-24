const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ margin: 72, size: 'LETTER' });
const outputPath = path.join(__dirname, 'ejercicios calculos.pdf');
doc.pipe(fs.createWriteStream(outputPath));

// Colores — encabezados con fondo azul claro + texto azul oscuro para máximo contraste
const BLUE_DARK  = '#1e3a8a';   // texto oscuro y encabezado principal
const BLUE_BG    = '#dbeafe';   // fondo de sección (claro, contraste alto con azul oscuro)
const BLUE_LIGHT = '#eff6ff';   // fondo instrucciones
const GRAY       = '#475569';
const BLACK      = '#1e293b';
const GREEN_DARK = '#14532d';   // fórmulas: verde oscuro sobre blanco (accesible)

const W = doc.page.width - 144; // ancho útil (margen 72 a cada lado)

// ── Helpers ──────────────────────────────────────────────────────────────────
function sectionTitle(num, title) {
  doc.moveDown(1.2);
  // Fondo azul claro + borde izquierdo azul oscuro
  doc.rect(doc.page.margins.left, doc.y, W, 30).fill(BLUE_BG);
  doc.rect(doc.page.margins.left, doc.y - 30, 4, 30).fill(BLUE_DARK);
  // Texto azul oscuro sobre fondo claro → contraste alto
  doc.fillColor(BLUE_DARK).fontSize(12).font('Helvetica-Bold')
     .text(`${num}.  ${title}`, doc.page.margins.left + 14, doc.y - 24);
  doc.fillColor(BLACK).moveDown(0.9);
}

function label(text) {
  doc.fontSize(11).font('Helvetica-Bold').fillColor(BLUE_DARK).text(text);
  doc.fillColor(BLACK).font('Helvetica');
}

function body(text) {
  doc.fontSize(11).font('Helvetica').fillColor(BLACK).text(text, { lineGap: 3 });
  doc.moveDown(0.35);
}

// Fórmulas en verde oscuro con fondo tenue para resaltarlas
function formula(text) {
  const y = doc.y;
  doc.rect(doc.page.margins.left + 16, y, W - 16, 20).fill('#f0fdf4');
  doc.fillColor(GREEN_DARK).fontSize(11).font('Helvetica-Bold')
     .text(text, doc.page.margins.left + 24, y + 4, { lineGap: 2 });
  doc.fillColor(BLACK).font('Helvetica').moveDown(0.55);
}

function hint(text) {
  doc.fontSize(9.5).font('Helvetica-Oblique').fillColor(GRAY)
     .text('Pista: ' + text, { indent: 20, lineGap: 2 });
  doc.font('Helvetica').fillColor(BLACK).fontSize(11);
  doc.moveDown(0.6);
}

function spacer() { doc.moveDown(0.5); }

// ── Encabezado principal ──────────────────────────────────────────────────────
doc.rect(0, 0, doc.page.width, 88).fill(BLUE_DARK);

doc.fillColor('white').fontSize(21).font('Helvetica-Bold')
   .text('Calculo Diferencial e Integral I', 0, 18, { align: 'center' });

doc.fontSize(13).font('Helvetica')
   .text('Ejercicios: Desigualdades y dominios', { align: 'center' });

doc.fontSize(9.5).fillColor('#bfdbfe')
   .text('Ejercicios complementarios basados en Lab 1  |  ITAM 2019', { align: 'center' });

doc.fillColor(BLACK).moveDown(2.5);

// ── Instrucciones ─────────────────────────────────────────────────────────────
doc.rect(doc.page.margins.left, doc.y, W, 34).fill(BLUE_LIGHT);
doc.rect(doc.page.margins.left, doc.y - 34, 4, 34).fill('#93c5fd');
doc.fillColor(GRAY).fontSize(10).font('Helvetica-Oblique')
   .text(
     'Muestra todos los pasos. En desigualdades expresa la solucion en notacion de intervalos. ' +
     'Indica los valores excluidos del dominio cuando aplique.',
     doc.page.margins.left + 14, doc.y - 28,
     { width: W - 18 }
   );
doc.fillColor(BLACK).font('Helvetica').moveDown(1.4);

// ══════════════════════════════════════════════════════════════════════════════
// EJERCICIO 1 — Desigualdad cuadrática
// ══════════════════════════════════════════════════════════════════════════════
sectionTitle('Ejercicio 1', 'Desigualdad cuadratica');

body('Resuelve la siguiente desigualdad y expresa tu resultado en notacion de intervalos:');
spacer();
formula('x^2 - 2x - 15 < 0');
spacer();
label('Formula cuadratica (para encontrar raices):');
formula('x = [ -b +/- raiz(b^2 - 4ac) ] / 2a');
spacer();
hint('Factoriza el trinomio como (x - r1)(x - r2) < 0, identifica las raices y usa una tabla de signos para saber en que intervalos el producto es negativo.');

// ══════════════════════════════════════════════════════════════════════════════
// EJERCICIO 2 — Desigualdad racional
// ══════════════════════════════════════════════════════════════════════════════
sectionTitle('Ejercicio 2', 'Desigualdad racional');

body('Resuelve la siguiente desigualdad (no multipliques por el denominador directamente):');
spacer();
formula('(2x - 1) / (x + 3)  >=  1');
spacer();
label('Estrategia:');
body('Pasa todo al mismo lado:  (2x - 1)/(x + 3) - 1 >= 0');
body('Simplifica el numerador, factoriza y analiza el signo del cociente en cada intervalo.');
spacer();
hint('El denominador (x + 3) no puede ser cero. Excluye x = -3 de la solucion final.');

// ══════════════════════════════════════════════════════════════════════════════
// EJERCICIO 3 — Valor absoluto
// ══════════════════════════════════════════════════════════════════════════════
sectionTitle('Ejercicio 3', 'Desigualdad con valor absoluto');

body('Resuelve:');
spacer();
formula('|2x + 1| - |x - 3|  <=  4');
spacer();
label('Definicion de valor absoluto:');
formula('|a| = a  si a >= 0          |a| = -a  si a < 0');
spacer();
label('Propiedad clave:');
formula('|f(x)| <= k   si y solo si   -k <= f(x) <= k     (con k > 0)');
spacer();
hint('Puntos criticos: x = -1/2 y x = 3. Analiza tres casos separados: ' +
     'x < -1/2,  -1/2 <= x < 3  y  x >= 3. En cada caso elimina los valores absolutos y resuelve.');

// ══════════════════════════════════════════════════════════════════════════════
// EJERCICIO 4 — Dominio de función
// ══════════════════════════════════════════════════════════════════════════════
sectionTitle('Ejercicio 4', 'Dominio de una funcion');

body('Determina el dominio de h:');
spacer();
formula('h(x) = raiz(x^2 - 4)  +  1 / raiz(9 - x^2)');
spacer();
label('Restricciones necesarias:');
body('  *  Para raiz(f(x)) : se necesita  f(x) >= 0');
body('  *  Para 1/raiz(g(x)) : se necesita  g(x) > 0  (estricto, evita division por cero)');
spacer();
body('El dominio es la INTERSECCION de todas las condiciones.');
spacer();
hint('La primera raiz pide x^2 >= 4, es decir x <= -2 o x >= 2. ' +
     'La segunda pide x^2 < 9, es decir -3 < x < 3. Intersecta ambas condiciones.');

// ══════════════════════════════════════════════════════════════════════════════
// EJERCICIO 5 — Dominio de composición
// ══════════════════════════════════════════════════════════════════════════════
sectionTitle('Ejercicio 5', 'Dominio de funcion compuesta');

body('Supongamos que Dom(f) = [-2, 3)  y  que  g(x) = f(2x + 1) + f(4 - x).');
body('Obtén Dom(g).');
spacer();
label('Principio clave:');
body('x pertenece a Dom(g)  si y solo si AMBOS argumentos estan en Dom(f):');
spacer();
formula('Condicion 1:  -2 <= 2x + 1 < 3       (despeja x)');
formula('Condicion 2:  -2 <= 4 - x  < 3       (despeja x)');
spacer();
body('Dom(g)  =  (solucion condicion 1) interseccion (solucion condicion 2)');
spacer();
hint('Resuelve cada sistema de inecuaciones por separado y luego intersecta los intervalos. ' +
     'Pon atencion a si los extremos se incluyen o excluyen.');

// ── Pie de página ─────────────────────────────────────────────────────────────
doc.moveDown(2);
doc.rect(doc.page.margins.left, doc.y, W, 1).fill(BLUE_DARK);
doc.moveDown(0.5);
doc.fontSize(9).fillColor(GRAY).font('Helvetica-Oblique')
   .text('Calculo Diferencial e Integral I  |  Ejercicios complementarios  |  Basado en Lab 1 ITAM 2019',
         { align: 'center' });

doc.end();
console.log('PDF generado:', outputPath);
