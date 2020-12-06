//Recursos necesarios para funcionar
const APP_SHELL = [
    "index.html",
    "pokedex.html",
    "css/style.css",
    "img/logo.png",
    "js/init.js",
    "js.init2.js",
    "vendor/fontawesome-free-5.15.1-web/css/all.min.css"
]

//Lo que no deberia cambiar
const APP_SHELL_INMUTABLE = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha3/dist/js/bootstrap.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
    "https://cdn.jsdelivr.net/npm/sweetalert2@10"
]

//Nombres
const CACHE_ESTATICO = "estativo-v1";
const CACHE_INMUTABLE = "inmutable-v1";

//instalacion Service Worker
self.addEventListener('install',e=>{
    //Tomar Cache Estatico
    const cacheEstatico = caches.open(CACHE_ESTATICO).then(cache=>cache.addAll(APP_SHELL));
    //Tomar Cache Inmutable
    const cacheInmutable = caches.open(CACHE_INMUTABLE).then(cache=>cache.addAll(APP_SHELL_INMUTABLE));
    //Esperar que los cache finalizen
    e.waitUntil(Promise.all([cacheEstatico, cacheInmutable]));
    //Mensjae Informando
    console.log("Service Worker Instalado");
})

//Activar Service worker
self.addEventListener('activate',e=>{
    console.log("Service Worker Activado");
})

//Definir Que hace el Service Worker
self.addEventListener('fetch',e=>{
    //Busca el Cache Existente
    const respuesta = caches.match(e.request).then(res=>{
        //Si el cache Existe (No aplica a la peticion API)...
        if (res && e.request.url.includes("/api")){
            return res;
        }
        //Si no Existe...
        else{
            //Hacer Peticion a Internet
            const petInternet = fetch(e.request).then(newRes=>{
                //Si la peticion es correcta
                if (newRes.ok || newRes.type == 'opaque'){
                    //Guardar Peticion en Cache dinamico
                    return caches.open("dinamico-vi").then(cache=>{
                        cache.put(e.request, newRes.clone());
                        return newRes.clone();
                    });
                }
                //Si la peticion a internet falla
                else{
                    //retornar error de internet
                    return newRes;
                }  

            }).catch(error=>caches.match(e.request));
            return petInternet;
        }
    });
    e.respondWith(respuesta);
});