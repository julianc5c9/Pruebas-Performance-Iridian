import http from 'k6/http';
import { sleep } from 'k6';

export const options ={
    stages: [
        {duration: '20s', target: 20},
        {duration: '15s', target: 15},
        {duration: '10s', target: 10},
        {duration: '5s', target: 5},
    ]
};

export default function(){
    http.get('https//test.k6.io');
    sleep(2);
}