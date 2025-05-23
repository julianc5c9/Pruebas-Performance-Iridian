import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Gauge, Counter} from 'k6/metrics';

export const TrendRTT = new Trend('RTT');
export const RateContentOK = new Rate('Content_OK');
export const GaugeContentSize = new Gauge('ContentSize');
export const CounterErrors = new Counter('Errors');

export const options = {
    stages: [
        {duration: '20s', target: 20},
        {duration: '10s', target: 10},
        {duration: '5s', target: 5},
    ],
    thresholds: {
        Errors: ['count<10'],
        ContentSize: ['value<5000'],
        Content_OK: ['rate>0.95'],
        RTT: ['p(95)<250', 'p(90)<200', 'avg<150', 'med<100', 'min<50'],
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01'],
        http_req_waiting: ['avg<250'],
    },
};

export default function() {
    const respuesta = http.get('https://test-api.k6.io/public/crocodiles/1/');
    console.log(`El tamaño de la pagina es: ${respuesta.body.length}`);

    const contentOK = respuesta.json('name') === 'Bert';
    const contentOK2 = respuesta.json('sex') === 'M';
    const contentOK3 = respuesta.json('age') === '14';

    TrendRTT.add(respuesta.timings.duration);
    RateContentOK.add(contentOK);
    RateContentOK.add(contentOK2);
    RateContentOK.add(contentOK3);
    GaugeContentSize.add(respuesta.body.length);
    CounterErrors.add(!contentOK || contentOK2 || contentOK3);

    check(respuesta, {
        'La pagina cargo correctamente: Status 200': (r) => r.status == 200,
        'El tiempo de respuesta es inferior a 400ms ': (r) => r.timings.duration < 400,
        'El tiempo de espera es inferior a 100ms ': (r) => r.timings.waiting < 250,
        'El tiempo de envioo es inferiro a 50ms ': (r) => r.timings.sending < 50, 
        'El tiempo de recepcion es inferior a 100ms ': (r) => r.timings.receiving < 100,
        'Contenido contiene "Feel free to browse" ': (r) => !r.body.includes('Feel free to browse'),
    });

sleep(1);
};