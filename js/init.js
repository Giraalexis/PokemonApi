//Registro del service Worker
if(navigator.serviceWorker){ //si esta disponible en este navegador
    if(window.location.href.includes("localhost") || window.location.href.includes("127.0.0.1")){
        navigator.serviceWorker.register("/sw.js");
    }else
        //esta en un servidor web
        navigator.serviceWorker.register("/PokemonApi/sw.js");
}