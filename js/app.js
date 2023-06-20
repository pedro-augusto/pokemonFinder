    const cardArea = document.querySelector('#cardsArea');    
    const form = document.querySelector('form');
    let url = `https://pokeapi.co/api/v2/pokemon/`;

    window.onload = async () => {
        form.addEventListener('submit', search);
        try {
            const pokemonsData= await getPokemonsData(url); // getting a list with containing the name and url for specific info for each pokemon
            showPokemons(pokemonsData,"home");
        } catch (error) {
            console.log(error);
        }
    }

    async function search(e) {
        // cleaning previous results 
        while(cardArea.firstChild){
            cardArea.removeChild(cardArea.firstChild);
        }

        e.preventDefault();
        const searchedTerm = document.querySelector('#term').value;
        if(searchedTerm!='') {
            try{ //FIXME: How to do this try catch thing in a better way? TRY CATCH
                //searching by name
                url = `https://pokeapi.co/api/v2/pokemon/${searchedTerm}`;
                result = await getData(url);
                generateCard(result);
            } catch (error) {}

            try {
                //searching by ability
                url = `https://pokeapi.co/api/v2/ability/${searchedTerm}`;
                result = await getData(url);
                showPokemons(result.pokemon,"ability");
            } catch (error) {}

            try {
                //searching by type
                url = `https://pokeapi.co/api/v2/type/${searchedTerm}`;
                result = await getData(url);
                showPokemons(result.pokemon,"type");
            } catch (error) {}
        }
    }

    async function getPokemonsData(){ //TODO: FIX THIS
        const answer = await fetch(url);
        const pokemonsData = await answer.json();
        return pokemonsData.results;
    }

    async function getData(url){
        const answer = await fetch(url);
        const jsonPokemon = await answer.json();
        return jsonPokemon;
    }

    async function showPokemons(pokemonsData,type){
        
        let specificPokemonData;

        pokemonsData.forEach(async function (pokemon) { 
            
            //FIXME: IS THERE A BETTER WAY TO DO THIS WITHOUT NEEDING AN IF STATEMENT?
            if(type=="home"){
                specificPokemonData = await getData(pokemon.url); // fetching data from the specific pokemon (accessing specific info through the previous array of objects);
            } 

            else if (type=="ability" || type=="type"){
                specificPokemonData = await getData(pokemon.pokemon.url);
            } 
    
            generateCard(specificPokemonData);

        });

    }

    function generateCard(specificPokemonData){
        let card =` 

            <div class="card">
                <div class="image">
                <img src="${specificPokemonData.sprites.front_default}">
                </div>
                <div class="content">
                <div class="header capitalised">${specificPokemonData.name}</div>
                <div class="meta">
                    <a>Pokemon ID: ${specificPokemonData.id}</a>
                </div>
                <div class="description">
                    Abilities:
                    <ul class="abilityList">`;

            for (let index = 0; index < specificPokemonData.abilities.length; index++) {
                card+= `<li class="capitalised">${specificPokemonData.abilities[index].ability.name}</li>`;
            }
                    
            card +=`</ul>
                Type: <ul>`

            for (let index = 0; index < specificPokemonData.types.length; index++) {
                card+= `<li class="capitalised">${specificPokemonData.types[index].type.name}</li>`;
            }

            card+=`</ul></div>
                </div>
            </div>`;

            cardArea.innerHTML += card;
    }

    
