import http from 'k6/http';
import {check, sleep } from 'k6';

export const options = {
    stages: [
        {duration: '10s', target: 10},
    ]
}; 

export default function(){
    const respuesta = http.get('http://test.k6.io');
    check(respuesta, {'La pagina responde correctamente: Status 200': (r) => (r).status == 200 }),
    //Tipos de Respuestas 
    //console.log('Informacion del body:'+ String(respuesta.body))
    console.log('Respuesta URL: '+ String(respuesta.request.url))
    console.log('Metodo de respuesta: '+ String(respuesta.request.method))
    console.log('Codigo de respuesta: '+ String(respuesta.status))
    console.log('Status_text: '+ String(respuesta.status_text))
    //Respuestas Http
    console.log('Metodo de respuets HTTP bloqueados: '+ String(respuesta.timings.blocked))
    console.log('Metodo de respuesta HTTP conectados '+ String(respuesta.timings.connecting))
    console.log('Metodo de respuesta HTTP enviados '+ String(respuesta.timings.sending))
    console.log('Metodo de respuesta HTTP en espera '+ String(respuesta.timings.waiting))
    console.log('Metodos de respuesta HTTP recibidos '+ String(respuesta.timings.receiving))
    //Otros tipos de respuestas 
    console.log('Respuesta cookies: '+ String(respuesta.cookies))
    console.log('Respuesta de error: '+ String(respuesta.error))
    console.log('Respuesta codigo error: '+ String(respuesta.error_code))
    console.log('Respuesta IP remota: '+ String(respuesta.remote_ip))
    console.log('Respuesta puerto remoto '+ String(respuesta.remote_port))
    sleep(1);
}; 