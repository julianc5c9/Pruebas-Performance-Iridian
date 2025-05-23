import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
    stages: [
        {duration: '20s', target: 20},
        {duration: '10s', target: 10},
        {duration: '5s', target: 5},
    ],
      thresholds: {
        http_req_duration: ['p(95)<500'], // 95% de las solicitudes deben ser menores a 500ms
        http_req_failed: ['rate<0.01'], // Menos del 1% de solicitudes deben fallar
        http_req_waiting: ['avg<200'], // El tiempo de espera promedio debe ser menor a 200ms
        http_req_sending: ['p(90)<50'], // El 90% de las solicitudes deben ser enviadas en menos de 50ms
        http_req_receiving: ['p(90)<100'], // El 90% de las respuestas deben ser recibidas en menos de 100ms
        http_reqs: ['count>100'], // Debe haber más de 100 solicitudes totales
    },
};

export default function() {
    //Realizar solicitud HTTP
    const respuesta = http.get('https://quickpizza.grafana.com/');
    //console.log(`El tamaño de la pagina es: ${respuesta.body.length}`);

    //Agrupar validaciones 
    group('Validaciones de estado y contenido', () => {
        check(respuesta, {
            'La pagina cargo correctamente: Status 200': (r) => r.status === 200,
        });
        
        if(respuesta.status === 200) {
            check(respuesta, {
                'Validando texto en la pagina: OK': (r) => r.body.includes('Collection simple web'),
                'Subtitulos OK ': (r) => r.body.includes('QuickPizza'),
                'Texto Julian QA: Falso ': (r) => !r.body.includes('Julian'),
            });
        }
    });

    group('Validaciones de tamaño', () => {
        if(respuesta.body.length > 11000) {
            check(respuesta, {
                'El tamaño de la pagina es mayor que 11000': (r) => r.body.length > 11000, 
            });
        }

        if(respuesta.body.length === 2356) {
            check(respuesta, {
                'El tamaño de la pagina es igual a 2356': (r) => r.body.length === 2356,
            });
        }
    });

    group('Validaciones adicionales', () => {
        if(respuesta.body.includes('<title>QuickPizza</title>')) {
            check(respuesta, {
                'El titulo de la pagina es correcto': (r) => r.body.includes('<title>QuickPizza</title>'),
            })
        }

        if (!respuesta.body.includes('Footer text')) {
            check(respuesta, {
                'Validando texto en el footer': (r) => !r.body.includes('Footer text'),
            });
        }

        if (!respuesta.body.includes('<form id="contact-form">')) {
            check(respuesta, {
                'La página contiene un formulario de contacto': (r) => !r.body.includes('<form id="contact-form">'),
            });
        }

        if (respuesta.body.includes('<a href="/contacts.php">/contacts.php</a>')) {
            check(respuesta, {
                'El enlace a "Contactos.php"': (r) => r.body.includes('<a href="/contacts.php">/contacts.php</a>'),
            });
        }

        if (respuesta.body.includes('<a href="/news.php">/news.php</a>')) {
            check(respuesta, {
                'El enlace a "Noticias.php"': (r) => r.body.includes('<a href="/news.php">/news.php</a>'),
            });
        }

        if (!respuesta.body.includes('<nav>')) {
            check(respuesta, {
                'La página tiene un elemento de navegación': (r) => !r.body.includes('<nav>'),
            });
        }
    });

    sleep(1);
};