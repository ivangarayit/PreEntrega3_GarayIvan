// VARIABLES

let eventoAComprar = "";
let comprarParking = "";
let cupon = "";
let cantidadParking = "";
let confirmarCompra = "";
let cantidadEntradas = "";
let nombreUsuario = "";
let lista_entradas = [];
let lista_eventos = [];
let carrito = [];
let carrito_JSON = "";
let recuperarCarrito = "";


class Evento {
    constructor (id, id_carrito, flyer, nombre, fecha, horario, djs, precio_entrada, stock_entrada, parking, precio_parking, stock_parking, direccion) {
        this.id = id, 
        this.id_carrito = id_carrito,
        this.flyer = flyer,
        this.nombre = nombre;
        this.fecha = fecha;
        this.horario = horario;
        this.djs = djs;
        this.precio_entrada = parseInt(precio_entrada);
        this.stock_entrada = parseInt(stock_entrada);
        this.parking = parking;
        this.precio_parking = parseInt(precio_parking);
        this.stock_parking = parseInt(stock_parking);
        this.direccion = direccion;
    }


    get_stock_entradas() {
        if(this.stock_entrada <= 0) {
            return false
        }
        else {
            return true
        }
    }

    get_stock_parking() {
        if(this.stock_parking <= 0) {
            return false
        }
        else {
            return true
        }
    }

}

class Entradas {
    constructor (usuario, evento, entradasCompradas, parkingComprados, totalPagado) {
        this.usuario = usuario;
        this.evento = evento;
        this.entradasCompradas = entradasCompradas;
        this.parkingComprados = parkingComprados;
        this.totalPagado = totalPagado;
    }
}

const evento1 = new Evento ("1", "C1", "img/evento-01-flyer.png","COCOON", "29/04/2023", "23:00 a 08:00", ["Enrico Sangiuiliano", "Sven Väth", "Phoro"], 1800, 4000, true, 250, 300, "Av.Wilson Ferreira Aldunate 7201, Ciudad de la Costa, Canelones");
const evento2 = new Evento ("2", "C2", "img/evento-02-flyer.png","MUSIC CONTENT E01", "18/03/23", "23:00 a 07.00", ["Jay Lumen", "Brian Gross", "SPECTRUM DJs"], 1200, 1500, false, 0, 0, "Río Branco 1627, Centro, Montevideo");
const evento3 = new Evento ("3", "C3", "img/evento-03-flyer.png","MOTION", "01/04/2023", "23:00 a 08:00", ["Jorge Savoretti", "Alex Font", "Indra"], 1800, 2500, true, 300, 100, "Ex Tequila, Ruta 10, La Barra, Maldonado"); 
const evento4 = new Evento ("4", "C4", "img/evento-04-flyer.png","Phonotheque", "12/02/2022", "22:00 a 06:00", ["Manuel Jelen", "Emilio B2B Kino", "Christian"], 1000, 500, false, 0, 0, "Rambla Pte. Wilson 2133, Parque Rodó, Montevideo"); 


lista_eventos.push(evento1, evento2, evento3, evento4);

const eventosContenedor = document.getElementById('eventos');


function renderizarEventos(evento) {
    const article = document.createElement('article');
    article.className = 'eventoCard';
    article.dataset.evento = evento.id;

    const flyer = document.createElement('img');
    const fechaEvento = document.createElement('h5');
    const nombreEvento = document.createElement('h3');
    const direccionEvento = document.createElement('p');
    const precioEvento = document.createElement('h5');
    const comprar = document.createElement('button');

    flyer.src = evento.flyer;
    flyer.alt = evento.nombre;
    fechaEvento.textContent = evento.fecha;
    nombreEvento.textContent = evento.nombre;
    direccionEvento.textContent = evento.direccion;
    precioEvento.textContent = evento.precio_entrada;
    comprar.textContent = 'COMPRAR';
    comprar.className = 'btnComprar';
    comprar.addEventListener("click", agregarAlCarrito);

    
    article.appendChild(flyer);
    article.appendChild(fechaEvento);
    article.appendChild(nombreEvento);
    article.appendChild(direccionEvento);
    article.appendChild(precioEvento);
    article.appendChild(comprar);

    eventosContenedor.appendChild(article);
}

function agregarAlCarrito(e) {
    const eventoABuscar = e.target.parentNode.dataset.evento;
    const eventoAAgregar = lista_eventos.find(Evento => Evento.id == eventoABuscar);
    if (carrito.includes(eventoAAgregar)) {
        alert("Ya agregaste este evento al carrito");
    }
    else {
        carrito.push(eventoAAgregar);
    }
    carrito_JSON = JSON.stringify(carrito);
    localStorage.setItem("carrito", carrito_JSON);
    carritoContenedor.innerHTML = "";
    carrito.forEach(renderizarCarrito);
} 

function borrarProductoCarrito(e) {
    const buscarItemCarritoEliminar = e.target.parentNode.parentNode.parentNode.parentNode.dataset.itemCarrito;
    const itemCarritoEliminar = carrito.findIndex(carrito => carrito.id_carrito == buscarItemCarritoEliminar);
    carrito.splice(itemCarritoEliminar, 1);
    let carrito_JSON = JSON.stringify(carrito);
    localStorage.setItem("carrito", carrito_JSON);
    carritoContenedor.innerHTML = "";
    carrito.forEach(renderizarCarrito);
} 

const carritoContenedor = document.getElementById('carritoBody');


function renderizarCarrito(itemCarrito) {
    const articleCarrito = document.createElement('article');
    articleCarrito.className = 'itemCarritoContainer';
    articleCarrito.dataset.itemCarrito = itemCarrito.id_carrito;

    const carritoItemTop = document.createElement('div');
    const carritoItemCHO = document.createElement('div');
    const carritoItemCHOEntradas = document.createElement('div');
    const carritoItemCHOParking = document.createElement('div');
    const carritoItemCHOErase = document.createElement('div');
    const carritoItemCHOBottom = document.createElement('div');

    carritoItemTop.className = 'carritoItemTop';
    carritoItemCHO.className = 'carritoItemCHO';
    carritoItemCHOEntradas.className = 'carritoItemCHOEntradas';
    carritoItemCHOParking.className = 'carritoItemCHOParking';
    carritoItemCHOErase.className = 'carritoItemCHOErase';
    carritoItemCHOBottom.className = 'carritoItemCHOBottom';


    articleCarrito.append(carritoItemTop);
    articleCarrito.append(carritoItemCHO);
    carritoItemCHO.append(carritoItemCHOEntradas);
    carritoItemCHO.append(carritoItemCHOParking);
    carritoItemCHO.append(carritoItemCHOErase);
    articleCarrito.append(carritoItemCHOBottom);

    carritoItemTop.innerHTML = `<img src=${itemCarrito.flyer}></img>
                                <div><h4>${itemCarrito.nombre}</h4>
                                <h6>${itemCarrito.fecha}</h6></div>`
    carritoItemCHOEntradas.innerHTML = `<label for="qEntradas">Cantidad<br>entradas</label>
                                        <input type="number" id="qEntradas" class="qEntradas" name="qEntradas" min="1" placeholder="1">`;
    if (itemCarrito.parking) {
        carritoItemCHOParking.innerHTML = `<label for="qParking">Cantidad<br>parking</label>
                                            <input type="number" id="qParking" class="qParking" name="qParking" min="0" placeholder="0">`;
    }
    else {
        carritoItemCHOParking.innerHTML = `<p>Este evento<br>no cuenta<br>con parking</p>`;
    }
    carritoItemCHOErase.innerHTML = `<p>BORRAR</p>
                                    <button class="btnBorrar"><img src="./img/borrar.png"></button>`
    carritoItemCHOBottom.innerHTML = `<p>subtotal</p>
                                    <h6>$${itemCarrito.precio_entrada}</h6>`;

    const borrar = articleCarrito.querySelector(".btnBorrar");
    borrar.addEventListener("click", borrarProductoCarrito);

    carritoContenedor.append(articleCarrito);
    
}

lista_eventos.forEach(renderizarEventos);


