import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        {duration: '8s', target: 20},
        {duration: '3s', target: 2},
    ],
    thresholds:{
        http_req_duration: ['p(95) < 750', 'min < 100', 'med <230', 'max < 1110'],
    },
};

export default function(){
    const respuesta = http.get('https://test.k6.io/');
    check(respuesta, {'La pagina carga correctamente: status 200': (r) => r.status == 200}),
    sleep(1);
}