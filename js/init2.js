
//peticion de Pokemones
window.addEventListener('DOMContentLoaded', async()=>{
    //retorna una promesa
    let respuesta = await axios.get("https://pokeapi.co/api/v2/pokedex/1/")
    let pokemones = respuesta.data.pokemon_entries;
    window.mostrar(pokemones);
})

window.mostrar = async(pokemones)=>{
    const molde = document.querySelector(".molde");
    const contenedor = document.querySelector(".contenedor");
    for(let i=0; i< pokemones.length; i++){
        let p = pokemones[i];
        let copia = molde.cloneNode(true);
        copia.querySelector(".pokemon-numero").innertText = p.entry_number;
        copia.querySelector(".pokemon-nombre").innerText = p.pokemon_species.name.capitalize();
        let imagen = await window.imagenPokemon(p.entry_number);
        copia.querySelector(".pokemon-imagen").src = imagen;
        contenedor.appendChild(copia);
    }
}

window.imagenPokemon = async (id)=>{
    let respuesta = await axios.get("https://pokeapi.co/api/v2/pokemon/"+id+"/");
    let imagen = respuesta.data.sprites.front_default;
    return imagen;
}

//Capitalizar texto
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}