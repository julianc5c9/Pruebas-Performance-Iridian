import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        {duration: '20s', target: 20},
        {duration: '15s', target: 15},
        {duration: '10s', target: 10},
    ]
};

export default function(){
    const respuesta = http.get('https://quickpizza.grafana.com/');

    console.log(`El tamaño del cuerpo de la pagina es: ${respuesta.body.length} bytes`);

    check(respuesta, { 'La pagina cargo correctamente: Status 200': (r) => r.status == 200}),
    check(respuesta, { 'Validando texto pagina: Prueba Julian QA  es falso': (r) => !r.body.includes('Prueba Julian QA')}),
    check(respuesta, { 'Validando texto pagina: QuickPizza es Verdadero': (r) => r.body.includes('QuickPizza')}),
    check(respuesta, { 'El tamaño de la pagina es menor que: 11000 bytes': (s) => s.body.length < 11000}),

    //Otras Validaciones con etiquetas HTML
    check(respuesta, { 'El titulo de la pagina es: QuickPizza': (t) => (t).body.includes('<title>QuickPizza</title>')}),
    check(respuesta, { 'El tamaño real de la pagina es: 2356 bytes' : (r) => (r).body.length == 2356}),
    sleep(1);
}