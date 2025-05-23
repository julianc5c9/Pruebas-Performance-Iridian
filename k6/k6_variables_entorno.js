import http from 'k6/http';
import { sleep } from 'k6';

const hostname = `http://${__ENV.DOMAIN}`;

export const options = {
    stages: [
        {duration: '10s', target: 10},
        {duration: '5s', target: 5},
    ]
};

export default function(){
    const respuesta = http.post(hostname, "hola mundo"); 
    console.log(`El tamaño de la pagina es: ${respuesta.body.length} bytes`);
    sleep(1);
}

