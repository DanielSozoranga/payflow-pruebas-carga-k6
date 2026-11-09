// PRUEBA DE ESTRES DE LA API DE PAGOS DE PAYFLOW
// Que hace: va subiendo la cantidad de usuarios poco a poco
// Para que sirve: saber cuantos usuarios aguanta la API antes de ponerse lenta

// Aqui traemos las herramientas de k6 que vamos a usar
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // ETAPAS
  // Cada etapa dura 1 minuto
  // El numero es cuantos usuarios falsos (virtuales) usan la API
  stages: [
    { duration: '1m', target: 50 },   // llegan 50 usuarios
    { duration: '1m', target: 100 },  // llegan 100 usuarios
    { duration: '1m', target: 150 },  // llegan 150 usuarios
    { duration: '1m', target: 200 },  // llegan 200 usuarios
    { duration: '1m', target: 250 },  // llegan 250 usuarios
    { duration: '1m', target: 300 },  // llegan 300 usuarios
  ],

  // REGLAS PARA APROBAR
  // Si no se cumplen la prueba sale en rojo
  thresholds: {
    http_req_duration: ['p(95)<500'], // casi todas las respuestas deben tardar menos de medio segundo
    http_req_failed: ['rate<0.01'],   // menos de 1 error por cada 100 peticiones
  },
};

// LO QUE HACE CADA USUARIO
// Se repite una y otra vez mientras dura la prueba
export default function () {
  // 1 Pide la lista de pagos a la API
  const res = http.get('https://api.payflow.test/v1/pagos');

  // 2 Revisa que la API conteste bien (codigo 200 quiere decir que todo salio bien)
  check(res, { 'status es 200': (r) => r.status === 200 });

  // 3 Espera 1 segundo antes de volver a pedir (como una persona de verdad)
  sleep(1);
}
