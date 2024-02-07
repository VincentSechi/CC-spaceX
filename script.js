const urls = [];
const nb = [];
const numbers = document.querySelectorAll(".number")

const home = document.querySelector("#home");
const planets = document.querySelector("#planets");
const tableList = document.querySelector("tbody");

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

function onInit(){
    getSlugs();
    getPlanets();
}
onInit()

function addContent(content, items){
    items.forEach((item, index) => {
        content.reverse();
        item.textContent = content[index];
    })
} 

function getSlugs(){
    const attr = document.querySelectorAll(".infos")
    attr.forEach((data) => {
       let attr = (data.attributes[1].value);
       urls.push(`https://swapi.dev/api/${attr}`)
    })
    Promise.all(urls.map(url =>
        fetch(url)
          .then(response => response.json()).then(response => {
            nb.push(response.count)
            addContent(nb,numbers);
          })
    ))
}

function addElem(tag, text, className, row){
    const elem = document.createElement(tag);
    elem.textContent = text;
    elem.classList.add(className);
    row.appendChild(elem);

}
function getPlanetInfo(slug, result, tag){
    const slugName = document.querySelector(slug);
    slugName.querySelector(tag).textContent = result;
}
tableList.addEventListener('click', (e) => {
    let elem = e.target.closest(".table-row")
    document.querySelector(".planet-card").style.visibility = "visible"
    const page = elem.attributes[1].value;
    const index = elem.attributes[2].value

    setInterval(function(){star()}, 20 )
    fetch(`https://swapi.dev/api/planets/${page}`).then(response => response.json()).then(response => {
        for(const data in response.results){
            if(data === index){
                getPlanetInfo(".planet-card", response.results[index].name, ".title")
                getPlanetInfo(".planet-card", response.results[index].population, ".value")
                getPlanetInfo(".diametre", response.results[index].diameter, ".value")
                getPlanetInfo(".climat", response.results[index].climate, ".value")
                getPlanetInfo(".gravity", response.results[index].gravity, ".value")
                getPlanetInfo(".terrain", response.results[index].terrain, ".value")
            }
        }
    })
})

function getPlanets(){
    const table = document.querySelector("table");
    const tableBody = table.querySelector("tbody");
    const span = document.querySelector(".result")
    fetch("https://swapi.dev/api/planets").then(response => response.json()).then(response => {
        for(i = 0; i < getCountPlanet(response.count); i++){
            let numPage  = i;
            fetch(`https://swapi.dev/api/planets/?page=${i}`).then(response => response.json()).then(response => {
                for(const data in response.results){
                    const name = response.results[data].name;
                    const terrain = response.results[data].terrain;

                    let row = document.createElement("tr");
                    row.classList.add("table-row");
                    const page = document.createAttribute("data-page");
                    const index = document.createAttribute("data-index");
                    index.value = data
                    page.value = `?page=${numPage}`;
                    row.setAttributeNode(page);
                    row.setAttributeNode(index);
                    tableBody.appendChild(row);

                    addElem("td", name, "td1-value", row)
                    addElem("td", terrain, "td2-value", row)


                }
            })
        }
        span.textContent = response.count + " résultat(s)";
    })
}

function getCountPlanet(param){
    return param / 10
}



// pluie de star pour les fiches perso
function star(){
    const imgContainer = document.querySelector(".card-infos")
    let e = document.createElement("div");
    let left = Math.floor(Math.random() * 800)
    e.classList.add("star");
    imgContainer.append(e);
    e.style.left = left + 'px';

    setTimeout(function(){
        imgContainer.removeChild(e)
    }, 5000)
}
