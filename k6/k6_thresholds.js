import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        {duration: '20s', target: 20},
        {duration: '10s', target: 10},
        {duration: '5s', target: 5},
    ],
    thresholds:{
        http_req_duration: ['p(95) < 500'],
        http_req_failed: ['rate < 0.01'], //El porcentaje de fallos debe ser menor al 1% 
        http_req_waiting: ['avg < 200'], //El tiempo de espera promedio debe ser menor a 200ms
        http_req_sending: ['p(95) < 50'],//El 95% de los tiempos de envio debe ser menor a 50ms
        http_req_receiving: ['p(95) < 100'],
        iterations: ['count > 100']
    },
};

export default function(){
    const respuesta = http.get('https://test-api.k6.io');
    console.log(`El tamaño del cuerpo de la pagina es: ${respuesta.body.length} bytes`);
    check(respuesta, {
        'La pagina carga correctamente: status 200': (r) => r.status == 200,
        'El tiempo de respuesta inferior a 500ms': (r) => r.timings.duration < 500,
        'El tiempo de espera inferior a 200ms': (r) => r.timings.waiting < 200,
        'El tiempo de envio inferior a 50ms': (r) => r.timings.sending < 50,
        'El tiempo de recebsion inferior a 100ms': (r) => r.timings.receiving < 100,
        'Contenido contiene "Feel free to browse"': (r) => !r.body.includes('Feel free to browse'),
    });
    sleep(1);
}