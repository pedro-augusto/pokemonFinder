    cardArea = document.querySelector('#cardsArea');    
    const form = document.querySelector('form');

    console.log(form);
    let url = `https://pokeapi.co/api/v2/pokemon/`;

    
    async function app(){    

        try {
            const pokemonsData= await getPokemonsData(); // getting a list with containing the name and url for specific info for each pokemon

            for (const pokemon of pokemonsData) { // for each pokemon of the list 
                const specificPokemonData = await getSpecificPokemonData(pokemon.url); // fetching data from the specific pokemon (accessing specific info through the previous array of objects);
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

        } catch (error) {
            console.log(error);
        }
    }

    async function getPokemonsData(){
        const answer = await fetch(url);
        const pokemonsData = await answer.json();
        return pokemonsData.results;
    }

    async function getSpecificPokemonData(url){
        const answer = await fetch(url);
        const jsonPokemon = await answer.json();
        return jsonPokemon;
    }

    app();