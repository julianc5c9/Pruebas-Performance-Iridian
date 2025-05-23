import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        {duration: '8s', target: 20},
        {duration: '3s', target: 2},
    ]
};

export default function() {
    const respuesta= http.get('https://test.k6.io/');
    check(respuesta, {'La pagina carga correctamente: status 200': (r) => r.status == 200}),
    console.log("Tipos de Respuesta")
    //console.log("Informacion del Body "+ String(respuesta.body))
    console.log("Response Url " + String(respuesta.request.url))
    console.log("Response Metodo " + String(respuesta.request.method))
    console.log("Response Status " + String(respuesta.status))
    console.log("Response Status_text " + String(respuesta.status_text))
    console.log("Response Http Blocked " + String(respuesta.timings.blocked))
    console.log("Response Http Conectividad " + String(respuesta.timings.connecting))
    console.log("Response Http Sending " + String(respuesta.timings.sending))
    console.log("Response Http Waiting " + String(respuesta.timings.waiting))
    console.log("Response Http Receiving " + String(respuesta.timings.receiving))
    console.log("Response Cookies " + String(respuesta.cookies))
    console.log("Response Error " + String(respuesta.error))
    console.log("Response Codigo Error " + String(respuesta.error_code))
    console.log("Response Ip Remote " + String(respuesta.remote_ip))
    console.log("Response Puerto remoto " + String(respuesta.remote_port))
    sleep(1);
}