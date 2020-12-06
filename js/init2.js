
//peticion de Pokemones

window.addEventListener('DOMContentLoaded', async()=>{
    //retorna una promesa
    let respuesta = await axios.get("https://pokeapi.co/api/v2/pokedex/1/")
    const pokemones = respuesta.data.pokemon_entries;
    window.mostrar(pokemones);
})

//Mostrar los datos
window.mostrar = async(pokemones)=>{
    const molde = document.querySelector(".molde");
    const contenedor = document.querySelector(".contenedor");
    for(let i=0; i< pokemones.length; i++){
        let p = pokemones[i];
        let copia = molde.cloneNode(true);
        copia.querySelector(".pokemon-numero").innerText = p.entry_number;
        copia.querySelector(".pokemon-nombre").innerText = p.pokemon_species.name.capitalize();
        let datos = await window.datosPokemon(p.entry_number); //buscar datos del pokemon(imagen,tipo)
        copia.querySelector(".pokemon-imagen").src = datos[0]; //la imagen
        copia.querySelector(".pokemon-tipo").innerText = datos[1]; //el tipo 1
        copia.querySelector(".pokemon-tipo2").innerText = datos[2]; //el tipo 2
        copia.nombre = p.pokemon_species.name.capitalize(); //añadir atributo para buscar x nombre
        //console.log(copia.nombre);
        contenedor.appendChild(copia);
    }
}

//Pedir imagen y tipo de pokemon
window.datosPokemon = async (id)=>{
    let respuesta = await axios.get("https://pokeapi.co/api/v2/pokemon/"+id+"/"); //se trae los datos del pokemon
    let imagen = respuesta.data.sprites.front_default; //se trae la imagen por defecto
    let tipo = respuesta.data.types[0].type.name.capitalize(); //se trae el primer tipo 
    try{
        let tipo2 = respuesta.data.types[1].type.name.capitalize(); //se trae el segundo tipo
        let datos = [imagen,tipo,tipo2];
        return datos;
    }catch(e){
        let tipo2 = "";
        let datos = [imagen,tipo,tipo2];
        return datos;
    }
    
}

//Buscar Pokemon
const botonBuscar = document.querySelector(".btn-buscar")
botonBuscar.addEventListener('click',()=>{
    let txtBuscar = document.querySelector(".txt-buscar").value; //Se obtiene lo que elusuario busca
    let elementos = document.querySelector(".contenedor"); //obtener todo el contenedor
    let pokemons = elementos.querySelectorAll('*'); //se obrtiene a sus hijos
    let result = false;
    //console.log(pokemons);
    for (let i = 0; i < pokemons.length; i++){ //Recorremos los pokemones
        let p = pokemons[i];
        //console.log(p);
        if (p.nombre == txtBuscar){
           result=true;
           Swal.fire({
            title: p.nombre,
            html: p.innerHTML
            });
        }
    }
    if (result == false){
        Swal.fire({
            title: "No se ha encontrado: "+txtBuscar
            });
    }
})

//Capitalizar texto
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}