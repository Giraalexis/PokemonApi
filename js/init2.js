//Registro del service Worker

if(navigator.serviceWorker){ //si esta disponible en este navegador
    if(window.location.href.includes("localhost") || window.location.href.includes("127.0.0.1")){
        navigator.serviceWorker.register("/sw.js");
    }else
        //esta en un servidor web
        navigator.serviceWorker.register("/PokemonApi/sw.js");
}


//peticion de Pokemones
window.addEventListener('DOMContentLoaded', async()=>{
    document.querySelector(".txt-cargando").classList.remove("d-none");
    let z = -1;
    for (let i = 1; i > z; i++){
        try{
            let respuesta = await axios.get("https://pokeapi.co/api/v2/pokemon/"+i+"/"); //se trae los datos del pokemon
            window.mostrar(respuesta.data);
        }
        catch(e){
            document.querySelector(".txt-cargando").classList.add("d-none");
            break; //Si ya no encuentra mas pokemon, se termina el ciclo
        }
    };
});


//Mostrar los pokemons en DOM
window.mostrar = async(pokemon)=>{
    const molde = document.querySelector(".molde");
    const contenedor = document.querySelector(".contenedor");
    let copia = molde.cloneNode(true);

    if(!pokemon.sprites.front_default){ //Si no encuentra imagen
        copia.querySelector(".pokemon-imagen").src = "img/404.png";
    }else{
        copia.querySelector(".pokemon-imagen").src = pokemon.sprites.front_default;
    }
    copia.querySelector(".pokemon-numero").innerText = pokemon.id;
    copia.querySelector(".pokemon-nombre").innerText = pokemon.name.capitalize();
    copia.querySelector(".pokemon-tipo").innerText = pokemon.types[0].type.name.capitalize();
    copia.querySelector(".btn-pokemon-detalle").pokemonDatos = pokemon;
    copia.querySelector(".btn-pokemon-detalle").addEventListener('click',window.mostrarPokemonDatos);
    try{
        copia.querySelector(".pokemon-tipo2").innerText = pokemon.types[1].type.name.capitalize();
    }catch(e){
        copia.querySelector(".pokemon-tipo2").innerText = "";
    }
    copia.datos = pokemon; //guardar todos los datos 
    contenedor.appendChild(copia);

};



//Buscar Pokemon
const botonBuscar = document.querySelector(".btn-buscar")
botonBuscar.addEventListener('click', async ()=>{
    let txtBuscar = document.querySelector(".txt-buscar").value.toLowerCase().trim(); //Se obtiene lo que el usuario busca
    if (txtBuscar == "giratina"){ //giratina es un caso especial :c
        txtBuscar = "giratina-altered";
    }
    let elementos = document.querySelector(".contenedor"); //obtener todo el contenedor
    let pokemons = elementos.getElementsByClassName('btn-pokemon-detalle'); //se obrtiene a sus hijos
    
    let result = false;
    //console.log(pokemons);
    for (let i = 0; i < pokemons.length; i++){ //Recorremos los pokemones
        let p = pokemons[i];
        if (p.pokemonDatos.name == txtBuscar){
           datosPokemon(p.pokemonDatos);
           result = true;
           break;
        }
    }
    if (result == false){
        Swal.fire({
            title: "No se ha encontrado: '"+txtBuscar+"'"
            });
    }
});

//Mostrar Pokemon Seleccionado
window.mostrarPokemonDatos = function(){
    let pokemonDatos = this.pokemonDatos;
    window.datosPokemon(pokemonDatos);
};



//Mostrar Todos los Datos del Pokemon en un alert
window.datosPokemon = function(DatosPokemon){
    const molde = document.querySelector(".molde");
    let copia = molde.cloneNode(true); 

    if(!DatosPokemon.sprites.front_default){ //si no encuentra imagen
        copia.querySelector(".pokemon-imagen").src = "img/404.png";
    }else{
        copia.querySelector(".pokemon-imagen").src = DatosPokemon.sprites.front_default;
    }
    copia.querySelector(".pokemon-numero").innerText = DatosPokemon.id;
    copia.querySelector(".pokemon-nombre").innerText = DatosPokemon.name.capitalize();
    copia.querySelector(".pokemon-tipo").innerText = DatosPokemon.types[0].type.name.capitalize();
    try{
        copia.querySelector(".pokemon-tipo2").innerText = DatosPokemon.types[1].type.name.capitalize();
    }catch(e){
        copia.querySelector(".pokemon-tipo2").innerText = "";
    }
    
    copia.querySelector(".datos-pokemon").innerHTML +=      
    `<div class="row pl-2 border-bottom">
        <h6 class="col-6 ">Altura</h6>
        <h6 class="col ">${(DatosPokemon.height*0.1).toFixed(1)} m</h6>
    </div>
    <div class="row pl-2 border-bottom">
        <h6 class="col-6 ">Peso</h6>
        <h6 class="col ">${(DatosPokemon.weight*0.1).toFixed(1)} kg</h6>
    </div>
    <div class="row pl-2 border-bottom">
        <h6 class="col-6 ">HP</h6>
        <h6 class="col ">${DatosPokemon.stats[0].base_stat}</h6>
    </div>
    <div class="row pl-2 border-bottom">
        <h6 class="col-6 ">Ataque</h6>
        <h6 class="col ">${DatosPokemon.stats[1].base_stat}</h6>
    </div>
    <div class="row pl-2 border-bottom">
        <h6 class="col-6 ">Defensa</h6>
        <h6 class="col ">${DatosPokemon.stats[2].base_stat}</h6>
    </div>
    <div class="row pl-2 border-bottom">
        <h6 class="col-6 ">Ataque Especial</h6>
        <h6 class="col ">${DatosPokemon.stats[3].base_stat}</h6>
    </div>
    <div class="row pl-2 border-bottom">
        <h6 class="col-6 ">Defensa Especial</h6>
        <h6 class="col ">${DatosPokemon.stats[4].base_stat}</h6>
    </div>
    <div class="row pl-2 border-bottom">
        <h6 class="col-6 ">Velocidad</h6>
        <h6 class="col ">${DatosPokemon.stats[5].base_stat}</h6>
    </div>`;
    
    Swal.fire({
        title: DatosPokemon.name.capitalize(),
        html: copia.innerHTML
    });
};

//Capitalizar texto
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

