//Navegar a una pagina web y verificar el tirulo 
import { browser } from 'k6/browser';

//Definimos las opciones para el escenario
export const options = {
    scenarios: {
        ui: {
            executor: 'shared-iterations', 
            options: {
                browser: {
                    type: 'chromium', //Indicamos que usaremos el navegador Chromium
                },
            },
        },
    }, 
    threshold: {
        check: ['rate==1.0'], //Aseguramos que todas las verificaciones pasen 
    },
}; 

//Pruebas e2e
export default async function() {
    const navegador = await browser.newPage(); //Creamos una nueva pagina
    await navegador.goto('https://test-api.k6.io'); //Navegamos a la pagina 
    console.log(await navegador.title()); //Mostramos el titulo de la pagina 
    await navegador.close();//Cerramos el navegador
}