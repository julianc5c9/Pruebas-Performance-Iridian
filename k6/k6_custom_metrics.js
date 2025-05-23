import http from 'k6/http';
import { check, sleep } from 'k6'; 
import { Trend } from 'k6/metrics'; //libreria para customizar metricas 


export const options = {
    stages: [
        {duration: '10s', target: 10},
        {duration: '5s', target: 5},
    ]
};

//Definimos variables para las metricas 
const time_es = new Trend('Tiempo_espera');
const bloked = new Trend('Bloqueados');
const send = new Trend('Enviados');
const conect = new Trend('Conectados');
const recibido = new Trend('Recibidos'); 

export default function() {
    const respuesta = http.get('http://test.k6.io');
    console.log(`El tamaño de la pagina es: ${respuesta.body.length} bytes`);
    check(respuesta, {'La pagina cargo correctamente: status 200': (r) => r.status == 200}),
    time_es.add(respuesta.timings.waiting)
    bloked.add(respuesta.timings.blocked)
    send.add(respuesta.timings.sending)
    conect.add(respuesta.timings.connecting)
    recibido.add(respuesta.timings.receiving)
    //console.log(time_es)
    sleep(1)
};
