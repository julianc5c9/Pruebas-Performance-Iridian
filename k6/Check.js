import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        {duration: '8s', target: 20},
        {duration: '3s', target: 2},
    ]
};

export default function(){
    const respuesta = http.get('https://test.k6.io/');
    check(respuesta, {'La pagina carga correctamente: status 200': (r) => r.status == 200}),
    check(respuesta, {'Validando texto pagina: Ok': (r) => r.body.includes('Collection of simple web-pages suitable for load testing.')}),
    check(respuesta, {'Subtitulo: Ok': (r) => r.body.includes('Public pages')}),
    check(respuesta, {'Tamaño de la pagina es menor a 11600': (r) => r.body.length < 11600}),
    sleep(1);
}