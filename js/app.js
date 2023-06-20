    const cardArea = document.querySelector('#cardsArea');    
    const form = document.querySelector('form');
    const pagination = document.querySelector('#pagination');
    let url = `https://pokeapi.co/api/v2/pokemon/`;

    const forward = document.getElementById('forward');
    const goBack = document.getElementById('goBack');

    window.onload = async () => {
        form.addEventListener('submit', search);
        try {

            let allHomeData= await getData(url);
            let previousPage;

            pokemonsData = allHomeData.results;
            showPokemons(pokemonsData,"home");

            forward.addEventListener('click', async ()=>{
                cleanCards();
                url = allHomeData.next;
                allHomeData= await getData(url);
                pokemonsData= await getData(url);
                previousPage = allHomeData.previous;
                showPokemons(pokemonsData.results, "home");

                if(goBack.classList.contains("disabled") && allHomeData.previous!=null){
                    goBack.classList.remove("disabled");
                }
            })

            goBack.addEventListener('click', async ()=>{
                url = previousPage;
                cleanCards();
                pokemonsData= await getData(url);
                showPokemons(pokemonsData.results, "home");

                if(forward.classList.contains("disabled") && allHomeData.next!=null){
                    forward.classList.remove("disabled");
                }
            })

            if(allHomeData.previous==null){
                goBack.classList.add("disabled");
            }

            if(allHomeData.next==null){
                forward.classList.add("disabled");
            }

        } catch (error) {
            console.log(error);
        }
        
    }

    async function search(e) {
        cleanCards();
        pagination.remove();

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

    function cleanCards(){
        // cleaning previous results 
        while(cardArea.firstChild){
            cardArea.removeChild(cardArea.firstChild);
        }
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

    
