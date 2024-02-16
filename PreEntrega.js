//CONSTANTES 1

const eventos = document.getElementById('eventos');
const templateCard = document.getElementById('template-evento-card').content;
const templateCarrito = document.getElementById('template-carrito-card').content;
const carritoBody = document.getElementById('carritoBody');
const carritoFooter = document.getElementById('carritoFooter');
const fragment = document.createDocumentFragment();
let carrito = {};

//DOM 1 

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        renderizarCarrito()
    }
})

eventos.addEventListener('click', (e) => {
    agregarAlCarrito(e)
})

carritoBody.addEventListener('click', e => {
    btnAmtUpDown(e)
})

// FETCH Y API ESTATICA 1

const fetchData = async () => {
    try {
        const respuesta = await fetch('api.json')
        const data = await respuesta.json()
        renderizarCards(data)
    } catch (error) {
        console.log(error)
    }
}

// Renderizar todos los eventos de la api en la pantalla

const renderizarCards = data => {
    data.forEach(evento => {
        templateCard.querySelector('img').setAttribute("src", evento.flyer)
        templateCard.querySelector('h6').textContent = evento.OFERTA
        templateCard.querySelector('h4').textContent = evento.title
        templateCard.querySelector('p').textContent = evento.spec
        templateCard.querySelector('h5').textContent = evento.price
        templateCard.querySelector('.card-btn').dataset.id = evento.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    eventos.appendChild(fragment)
}

const agregarAlCarrito = (e) => {
    if(e.target.classList.contains('card-btn')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const entrada = {
        id: objeto.querySelector('.card-btn').dataset.id,
        title: objeto.querySelector('h4').textContent,
        OFERTA: objeto.querySelector('h6').textContent,
        spec: objeto.querySelector('p').textContent,
        price: objeto.querySelector('h5').textContent,
        amount: 1
    }

    if (carrito.hasOwnProperty(entrada.id)) {
        Toastify({
            text: "Ya agreaste este evento al carrito",
            duration: 2000,
            style: {
                fontFamily:'Montserrat',
                background: '#e80729',
                borderRadius: '10px'
            }

            }).showToast();
    }
    else {
        carrito[entrada.id] = {...entrada}
        Toastify({
            text: "Evento agregado al carrito",
            duration: 2000,
            style: {
                fontFamily:'Montserrat',
                background: '#009929',
                borderRadius: '10px'
            }
            }).showToast();
    }
    renderizarCarrito()
}

const renderizarCarrito = () => {
    carritoBody.innerHTML = ''
    Object.values(carrito).forEach(item => {
        templateCarrito.querySelector('h5').textContent = item.title
        templateCarrito.querySelector('.carrito-OFERTA').textContent = item.OFERTA
        templateCarrito.querySelector('.carrito-cantidad').textContent = item.amount
        templateCarrito.querySelector('.carrito-btn-amt-up').dataset.id = item.id
        templateCarrito.querySelector('.carrito-btn-amt-down').dataset.id = item.id
        templateCarrito.querySelector('.carrito-card-subtotal').textContent = item.amount * item.price

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    carritoBody.appendChild(fragment)

    renderizarCarritoFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const renderizarCarritoFooter = () => {
    if (Object.keys(carrito).length ===0) {
        carritoFooter.innerHTML = ''
        carritoBody.innerHTML = `<p class="carrito-empty-message">Aún no agregaste eventos al carrito</p>`  
    }
    else {
        const total = Object.values(carrito).reduce((acu, {amount, price}) => acu + amount * price ,0)
    carritoFooter.innerHTML = `<article class="carrito-end">
                                    <div class="carrito-footer-top">
                                        <p>TOTAL A PAGAR</p>
                                        <h6 class="total">$ ${total}</span>
                                    </div>
                                    <div class="carrito-footer-bottom">
                                        <button id="btn-clear-carrito">BORRAR</button>
                                        <button id="btn-buy-carrito">COMPRAR</button>
                                    </div>
                                </article>`

    const btnClearCarrito = document.getElementById('btn-clear-carrito')
    btnClearCarrito.addEventListener('click', () => {
        carrito = {}
        renderizarCarrito()
    })
    const btnBuyCarrito = document.getElementById('btn-buy-carrito')
    btnBuyCarrito.addEventListener('click', () => {
        Swal.fire({
            title: "Gracias por tu compra",
            background: "#212529",
            color: "white",
            fontFamily: "Montserrat', sans-serif"
        })
        carrito = {}
        renderizarCarrito()
    })
    } 
}

// carrito 1

const btnAmtUpDown = e => {
    console.log(e.target)
    if(e.target.classList.contains('carrito-btn-amt-up')) {
        const entrada = carrito[e.target.dataset.id]
        entrada.amount = carrito[e.target.dataset.id].amount + 1
        carrito[e.target.dataset.id] = {...entrada}
        renderizarCarrito()
    }
    
    if (e.target.classList.contains('carrito-btn-amt-down')) {
        const entrada = carrito[e.target.dataset.id]
        entrada.amount = carrito[e.target.dataset.id].amount - 1
        if (entrada.amount === 0) {
            delete carrito[e.target.dataset.id]
        }
        renderizarCarrito()
    }

    e.stopPropagation()
}