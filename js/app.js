    // selectors
    const cardArea = document.querySelector('#cardsArea');  
    const form = document.querySelector('form'); 
    const pagination = document.querySelector('#pagination');
    const forward = document.getElementById('forward');
    const goBack = document.getElementById('goBack');

    let url = `https://pokeapi.co/api/v2/pokemon/`; // when nothing is searched, this is the default end-point. It returns 20 objects from the pokemon array and metadata about the array

    async function getData(url){
        const answer = await fetch(url);
        const jsonPokemon = await answer.json();
        return jsonPokemon;
    }

    window.onload = async () => { // when page is fully loaded

        form.addEventListener('submit', search);

        try {
            let allHomeData= await getData(url); // getting all the pokemon data for the home page. Contains metadata about the pokemon array
            let nextPage = allHomeData.next;
            let previousPage = allHomeData.previous;

            pokemonsData = allHomeData.results; // this contains only the array of pokemons, no metadata

            showPokemons(pokemonsData,"home"); // sending only the array with pokemons to be shown

            forward.addEventListener('click', async ()=>{ // acting when the user clicks to go to the next page
                cleanCards();
                url = nextPage;
                allHomeData= await getData(url); // we need this to know what is the previous page
                previousPage = allHomeData.previous; // updating previous page
                nextPage= allHomeData.next; // updating next page
                showPokemons(allHomeData.results, "home");

                if(goBack.classList.contains("disabled") && allHomeData.previous!==null){ // manipulating when the button to go back is disabled
                    goBack.classList.remove("disabled");
                }

                else if(allHomeData.next==null){
                    forward.classList.add("disabled");
                }
                
            })

            goBack.addEventListener('click', async ()=>{
                cleanCards();
                url = previousPage; // updating the url to the link of the previous page
                allHomeData= await getData(url);
                nextPage = allHomeData.next;
                previousPage= allHomeData.previous;
                showPokemons(allHomeData.results, "home");

                if(forward.classList.contains("disabled") && allHomeData.next!==null){ // manipulating when the button to go forward is disabled
                    forward.classList.remove("disabled");
                }

                else if(allHomeData.previous==null){
                    goBack.classList.add("disabled");
                }
            })


            // disabling buttons when it is either the first or last page
            if(allHomeData.previous==null){
                goBack.classList.add("disabled");
            }

            if(allHomeData.next==null){
                forward.classList.add("disabled");
            }

        } catch (error) {
            console.log(error); // FIXME: what is a more appropriate way to handle error? // MESSAGE TO USER
        }
        
    }

    async function showPokemons(pokemonsData,type){ // a type is sent because the structure of the array of pokemons used in the home page is different than the one used to search ability or type
    
        let specificPokemonData;

        pokemonsData.forEach(async function (pokemon) { // iterating each pokemon sent in the array (the array only returns the name and the link to the specific end-point of that pokemon)
            
            if(type=="home"){
                specificPokemonData = await getData(pokemon.url); // fetching data from the specific pokemon (accessing specific info through the url attribute of each pokemon in the previous array of objects);
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
                    <div class="header capitalised pokemonName">${specificPokemonData.name}</div>
                    <div class="meta">Pokemon ID: ${specificPokemonData.id}</div>
                    <div class="description">
                        <div class="ui divider"></div>`; 
                    
        specificPokemonData.stats.forEach(function (stat) { // generating each progress bar
            card+=`    <div class="ui yellow progress">
                            <div class="bar" style="transition-duration: 300ms; width: ${(stat.base_stat*100)/255}%;">
                                <div class="progress">${stat.base_stat}</div>
                            </div>
                            <div class="label">${(stat.stat.name).toUpperCase()}</div>
                        </div>`;
        })        
 
        card+=`        <div class="ui divider"></div>
                        <h4 class="headerLabel">Abilities:</h4>`;

        specificPokemonData.abilities.forEach(function (ability){ // generating each ability
            card+= `    <span class="ui blue label capitalised center-aligned marginLabel">${ability.ability.name}</span>`;
        })
                    
        card +=`        <div class="ui divider"></div>
                        <h4 class="headerLabel">Type:</h4>`;

        specificPokemonData.types.forEach( function (type){
            card+= `    <span class="ui red label capitalised center-aligned marginLabel">${type.type.name}</span>`;
        });

        card+=`     </div>
                </div>
            </div>`;

            cardArea.innerHTML+= card;
    }

    function cleanCards(){
        // cleaning previous results 
        while(cardArea.firstChild){
            cardArea.removeChild(cardArea.firstChild);
        }
    }

    async function search(e) {
        pagination.remove(); // when we are consulting the API for a specific pokemon, type or ability it does not return with pagination. Therefore, we delete the pagination in case the user searches something
        e.preventDefault();

        const searchedTerm = document.querySelector('#term').value.toLowerCase();

        if(searchedTerm!=='') {
            cleanCards();

            // FIXME: what is a better way to do this instead of 3 try catch? One function for each search

            try{
                // searching by name
                url = `https://pokeapi.co/api/v2/pokemon/${searchedTerm}`;
                result = await getData(url);
                generateCard(result);
            } catch (error) {}

            try {
                // searching by ability
                url = `https://pokeapi.co/api/v2/ability/${searchedTerm}`;
                result = await getData(url); // FIXME: wouldn't it be better and faster without async and await? For instance, if instead of waiting to check if what was searched was a name I could search everything at the same time
                showPokemons(result.pokemon,"ability");
            } catch (error) {}

            try {
                // searching by type
                url = `https://pokeapi.co/api/v2/type/${searchedTerm}`;
                result = await getData(url);
                showPokemons(result.pokemon,"type");
            } catch (error) {}
        }
    }

    
