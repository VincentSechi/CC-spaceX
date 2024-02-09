const select = document.querySelector(".filter-planet");
const home = document.querySelector("#home");
const planets = document.querySelector("#planets");
const tableList = document.querySelector("tbody");

function onInit(){
    getSlugs();
    setInterval(function(){starBg()}, 20 )
}
onInit()


//récupère et affiche le nb de véhicule, planetes, peoples...
async function getSlugs(){
    const slug = document.querySelectorAll(".infos")
    slug.forEach(async (data) => {
        let slug = (data.attributes[1].value);
        await fetch(`https://swapi.dev/api/${slug}`).then(response => response.json()).then(response => {
            if(data.getAttribute("data-info") === data.attributes[1].value){
                data.querySelector(".number").textContent = response.count
            }
        })
    })
}
// nb de pages
async function getPlanetCount(){
    const response = await fetch("https://swapi.dev/api/planets");
    const planets = await response.json();
    return (planets.count / 10);
}
//récupère les planetes de la pagge

async function getPlanetInfo(page){
    const response = await fetch(`https://swapi.dev/api/planets/${page}`);
    const data = await response.json();
    return data.results;
}


//ajouter un enfant à un parent
function addElem(tag, text, className, row){
    const elem = document.createElement(tag);
    elem.textContent = text;
    elem.classList.add(className);
    row.appendChild(elem);
}
//ajouter une td
function addRow(data, name, terrain){
    const row = document.createElement("tr");
    row.classList.add("table-row");

    const page = document.createAttribute("data-page");
    const index = document.createAttribute("data-index");
    index.value = data;
    page.value = `?page=${i}`;
    row.setAttributeNode(page);
    row.setAttributeNode(index);

    tableList.appendChild(row);

    addElem("td", name, "td1-value", row)
    addElem("td", terrain, "td2-value", row)
}

//récupère une liste de planetes suivant un filtre ou non
async function getPlanets(){
    const span = document.querySelector(".result")
    const count = await getPlanetCount();
    let countPlanet = 0;
    for(i = 1; i <= count; i++){
        await fetch(`https://swapi.dev/api/planets/?page=${i}`).then(response => response.json()).then(response => {
            for(const data in response.results){
                const res = response.results[data];
                const population = res.population
                const filter = select.value;
                if(filter == 0){
                    if(population < 100000){
                        addRow(data, res.name,res.terrain);
                        countPlanet ++;
                    }
                }else if(filter == 1){
                    if(population >= 100000 && population < 100000000){
                        addRow(data, res.name,res.terrain);
                        countPlanet ++;
                    }
                }else if(filter == 2){
                    if(population >= 100000000){
                        addRow(data, res.name,res.terrain);
                        countPlanet ++;
                    }
                }else{
                    addRow(data, res.name,res.terrain);
                    countPlanet ++;
                }
            }
        })
    }
    span.textContent = (countPlanet + " résultat(s)");
}

select.addEventListener("change", () => {
    const planets = document.querySelectorAll(".table-row")
    planets.forEach((planet) => {
        planet.remove();
    })
    getPlanets();
})

home.addEventListener('click', function(){
    document.querySelector(".planet").classList.add("hidden")
    document.querySelector(".about").classList.remove("hidden")
    document.querySelector(".data-summary").classList.remove("hidden")
})
planets.addEventListener('click', function(){
    document.querySelector(".planet").classList.remove("hidden")
    document.querySelector(".about").classList.add("hidden")
    document.querySelector(".data-summary").classList.add("hidden")
})

class Planet{
    constructor(name, population, diameter, climate, gravity, terrain){
        this.name = name;
        this.population = population;
        this.diameter = diameter;
        this.climate = climate;
        this.gravity = gravity;
        this.terrain = terrain;
    }
}

function addPlanetInfo(element, result, tag){
    const elementName = document.querySelector(element)
    elementName.querySelector(tag).textContent = result
}

tableList.addEventListener('click', (e) => {
    document.querySelector(".planet-card-container").classList.remove("hidden")
    document.querySelector(".placeholder").classList.add("hidden")
    document.querySelector(".planet-card-container").style.visibility = "visible"
    document.querySelector(".button-container").style.visibility = "visible"

    let elem = e.target.closest(".table-row")
    const page = elem.attributes[1].value
    const index = elem.attributes[2].value

    getPlanetInfo(page).then(planets => {
        const res = planets[index];
        
        const planet = new Planet(
            res.name,
            res.population,
            res.diameter,
            res.climate,
            res.gravity,
            res.terrain
        )
        addPlanetInfo(".planet-card", planet.name, ".title")
        addPlanetInfo(".planet-card", planet.population, ".value")
        addPlanetInfo(".diametre", planet.diameter, ".value")
        addPlanetInfo(".climat", planet.climate, ".value")
        addPlanetInfo(".gravity", planet.gravity, ".value")
        addPlanetInfo(".terrain", planet.terrain, ".value")
    });
})

function starBg(){
    const imgContainer = document.querySelector(".content-home");
    let e = document.createElement("div");
    let maxX =  imgContainer.clientWidth;
    let maxY =  imgContainer.clientHeight;

    let randomX = Math.floor(Math.random() * maxX);
    let randomY = Math.floor(Math.random() * maxY);

    e.classList.add("little-star");
    e.style.left = randomX + 'px';
    e.style.top = randomY + 'px';
    imgContainer.append(e);

    setTimeout(function(){
        imgContainer.removeChild(e)
    }, 5000)
}
