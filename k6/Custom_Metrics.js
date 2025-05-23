import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

export const options = {
    cloud: {
        projectID: 3759086,
        // Test runs with the same name groups test runs together
        name: 'Kokoriko'
      },

    stages: [
        {duration: '4s', target: 10},
        {duration: '2s', target: 2},
        {duration: '1s', target: 2},
    ]
};

const te = new Trend('Tiempo_espera');
const bloked = new Trend('Bloqueados');
const Conect = new Trend('Conectados');
const Send = new Trend('Enviados');
const Received = new Trend('Recibidos');

export default function() {
    const respuesta= http.get('https://test.k6.io/');
    check(respuesta, {'La pagina carga correctamente: status 200': (r) => r.status == 200}),
    te.add(respuesta.timings.waiting)
    bloked.add(respuesta.timings.blocked)
    Conect.add(respuesta.timings.connecting)
    Send.add(respuesta.timings.sending)
    Received.add(respuesta.timings.receiving)
    sleep(1);
}