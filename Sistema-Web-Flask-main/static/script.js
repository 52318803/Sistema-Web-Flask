// Produtos disponíveis
const products = [
    { id: 1, name: 'Baunilha', price: 100.00, discountPrice: 90.00, image: '/static/Bacio-di-Latte.webp' },
    { id: 2, name: 'Chocolate', price: 150.00, discountPrice: 100.00, image: '/static/Cioccolato-Belga.webp' },
    { id: 3, name: 'Doce de Leite', price: 200.00, discountPrice: 150.00, image: '/static/Doce-de-Leite.webp' },
    { id: 4, name: 'Morango', price: 100.00, discountPrice: 90.00, image: '/static/Fragola.webp' },
    { id: 5, name: 'Pistache', price: 150.00, discountPrice: 100.00, image: '/static/Mousse-di-Pistacchio.webp'},

];

const sabores = [
    { id: 1, name: 'Baunilha', price: 100.00, image: '/static/Bacio-di-Latte.webp' },
    { id: 2, name: 'Chocolate', price: 150.00, image: '/static/Cioccolato-Belga.webp' },
    { id: 3, name: 'Doce de Leite', price: 200.00, image: '/static/Doce-de-Leite.webp' },
    { id: 4, name: 'Morango', price: 100.00, image: '/static/Fragola.webp' },
    { id: 5, name: 'Pistache', price: 150.00, image: '/static/Mousse-di-Pistacchio.webp'},
    { id: 6, name: 'Creme de Avelã', price: 200.00, image: '/static/creme-de-avela.webp' },
    { id: 7, name: 'Morango', price: 100.00, image: '/static/Fragola.webp' },
    { id: 8, name: 'Coco', price: 150.00, image: '/static/Cocco.webp' },
    { id: 9, name: 'Manga', price: 200.00, image: '/static/Dolce-Mango.webp' },
]

// Variável para armazenar itens do carrinho
let cart = [];

// Função para renderizar produtos na página
function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">R$ ${product.price.toFixed(2)}</p>
            <button class="button" onclick="addToCart(${product.id})">Adicionar</button>
        `;
        
        productList.appendChild(productCard);
    });

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <p>${item.name} - R$ ${item.discountPrice.toFixed(2)}</p>
            <button onclick="removeFromCart(${index})">Remover</button>
        `;
        cartItems.appendChild(cartItem);
    });
}

function addToCart(saborId) {
    const sabor = sabores.find(s => s.id === saborId);
    if (sabor) {
        cart.push(sabor);
        renderCart();
    }
}

// // Função para adicionar item ao carrinho
// function addToCart(productId) {
//     const product = products.find(p => p.id === productId);
//     cart.push(product);
//     renderCart();  
// }


// Função para adicionar item ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    // Verifica se o item já está no carrinho
    if (cartItem) {
        cartItem.quantity += 1; // Incrementa a quantidade
    } else {
        // Adiciona o item ao carrinho com quantidade inicial 1
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
}

function renderSabores() {
    const saboresList = document.getElementById('product-list');
    saboresList.innerHTML = '';
    
    sabores.forEach(sabor => {
        const saborCard = document.createElement('div');
        saborCard.classList.add('product-card');
        
        saborCard.innerHTML = `
            <img src="${sabor.image}" alt="${sabor.name}">
            <h3>${sabor.name}</h3>
            <p class="price">R$ ${sabor.price.toFixed(2)}</p>
            <button class="button" onclick="addToCart(${sabor.id})">Adicionar</button>
        `;
        
        saboresList.appendChild(saborCard);
    });
}

// Função para adicionar sabor ao carrinho
function addToCart(saborId) {
    const sabor = sabores.find(s => s.id === saborId);
    if (sabor) {
        cart.push(sabor);
        renderCart();
    }
}


// Função para remover item do carrinho
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

// Função para renderizar o carrinho
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>O carrinho está vazio.</p>';
        return;
    }

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item'); // adiciona uma classe para customização via CSS
        cartItem.innerHTML = `
            <p>${item.name} - R$ ${item.price.toFixed(2)}</p>
            <button onclick="removeFromCart(${index})">Remover</button>
        `;
        cartItems.appendChild(cartItem);
    });

    // Atualiza o total do carrinho
    updateTotal();
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    document.getElementById('total').textContent = total.toFixed(2);
}

// Função para atualizar o total do carrinho
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('total').textContent = total.toFixed(2);
}

// Função para finalizar compra
// document.getElementById('finalize-button').addEventListener('click', () => {
//     if (cart.length > 0) {
//         alert('Compra finalizada com sucesso!');
//         cart = [];
//         renderCart();
//     } else {
//         alert('Seu carrinho está vazio!');
//     }
// });

// Renderizar produtos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});

// async function finalizeOrder() {
//     if (cart.length === 0) {
//         alert('Seu carrinho está vazio!');
//         return;
//     }

//     const response = await fetch('/api/finalizar_pedido', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ cart })
//     });

//     if (response.ok) {
//         alert('Compra finalizada com sucesso!');
//         cart = [];
//         renderCart();
//     } else {
//         const error = await response.json();
//         alert(`Erro: ${error.message}`);
//     }
// }

// Evento de clique para finalizar a compra
// document.getElementById('finalize-button').addEventListener('click', finalizeOrder);

const scrollTopBtn = document.getElementById("scrollTopBtn");

// Quando o usuário rolar para baixo 20px a partir do topo da página, exibe o botão
window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollTopBtn.style.display = "block";  // Exibe o botão
    } else {
        scrollTopBtn.style.display = "none";   // Oculta o botão
    }
};

// Quando o usuário clicar no botão, rola para o topo da página
scrollTopBtn.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"  // Rolagem suave
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

// Evento de clique para finalizar a compra
// document.getElementById('checkout').addEventListener('click', checkout);

//////////////////////////////////////////////////////////

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    console.log("Username:", username); // Verifique o valor do username
    console.log("Password:", password); // Verifique o valor da senha
    
    // Verifique se os campos estão preenchidos
    if (!username || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Cria um objeto FormData, que vai enviar os dados no formato de formulário
    var formData = new FormData();
    formData.append("email", username);
    formData.append("password", password);

    // Enviar os dados para o backend via POST
    fetch('/login', {
        method: 'POST',
        body: formData // Envia os dados como form-data (não JSON)
    })
    .then(response => response.text()) // Resposta em texto simples
    .then(data => {
        console.log("Resposta do servidor:", data); // Verifique a resposta
        if (data === "success") {
            // Se o login for bem-sucedido, redireciona para a página de dashboard
            window.location.href = "/dashboard";
        } else {
            // Caso contrário, exibe a mensagem de erro retornada do Flask
            alert(data); 
        }
    })
    .catch(error => {
        console.error('Erro no login:', error);
        alert('Erro ao tentar realizar login. Tente novamente mais tarde.');
    });
});

// Adiciona o evento beforeunload para realizar o logout quando a página for fechada ou alterada
window.addEventListener('beforeunload', function (event) {
    // Verifique se o usuário está saindo de uma página de pedido ou similar
    if (window.location.pathname === '/pedido') {
        fetch('/logout', {
            method: 'GET', // Ou 'POST', dependendo de como você configurou o Flask
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.text())  // Recebe a resposta como texto
        .then(data => {
            console.log("Deslogado com sucesso.");
        })
        .catch(error => {
            console.error('Erro no logout:', error);
        });
    }
});

window.addEventListener("beforeunload", function () {
    fetch('/logout', { method: 'GET' })
    .then(response => response.text())
    .then(data => {
        console.log("Logoff realizado.");
    })
    .catch(error => {
        console.error('Erro ao fazer logoff:', error);
    });
});

window.onload = function() {
    // Realiza o logout automaticamente ao carregar a página
    fetch("/logout")  // Chama a rota de logout
        .then(function(response) {
            // Após o logout, redireciona para a página inicial
            window.location.href = "/";
        })
        .catch(function(error) {
            console.error('Erro ao realizar o logout:', error);
        });
}

// Função para exibir o popup
function showPopup(message) {
    const popup = document.getElementById('success-popup');
    popup.innerHTML = message;
    popup.style.display = 'block';

    // Fechar o popup após 3 segundos e redirecionar para a página inicial
    setTimeout(function() {
        popup.style.display = 'none';
        window.location.href = "/";  // Redireciona para a página inicial
    }, 3000);
}

window.onload = function() {
    fetch("/logout")  // Chama a rota de logout
        .then(function(response) {
            // Exibe o popup de sucesso
            var successMessage = 'Você foi desconectado com sucesso!';
            var popup = document.createElement('div');
            popup.className = 'popup';
            popup.textContent = successMessage;
            document.body.appendChild(popup);

            // Redireciona para a página inicial após 3 segundos
            setTimeout(function() {
                window.location.href = "/";
            }, 3000);
        })
        .catch(function(error) {
            console.error('Erro ao realizar o logout:', error);
        });
}

window.addEventListener('beforeunload', function() {
    fetch("/logout");  // Chama a rota de logout para desautenticar o usuário
});


document.getElementById('logout-button').addEventListener('click', function() {
    fetch('/logout', {
        method: 'GET',  // Assegure-se de que o método aqui seja GET
    })
    .then(function(response) {
        if (response.ok) {
            window.location.href = '/';  // Redireciona para a página inicial após logout
        } else {
            console.error('Erro ao fazer logout');
        }
    })
    .catch(function(error) {
        console.error('Erro ao fazer logout:', error);
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const finalizeButton = document.getElementById('finalize-button');
    if (finalizeButton) {
        finalizeButton.addEventListener('click', finalizarCompra);
    } else {
        console.error('Botão de finalizar compra não encontrado!');
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const finalizeButton = document.getElementById('finalize-button');
    if (finalizeButton) {
        finalizeButton.addEventListener('click', function() {
            alert('Compra finalizada!');
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Usando delegação de eventos
    document.body.addEventListener('click', function(event) {
        // Verifica se o botão de finalizar compra foi clicado
        if (event.target && event.target.id === 'finalize-button') {
            finalizarCompra();
        }
    });
});

async function finalizarCompra() {
    if (cart.length === 0 || !validarCarrinho()) {
        alert('Carrinho vazio ou inválido!');
        return;
    }

    const formData = new FormData();
    cart.forEach((item, index) => {
        formData.append(`item_${index}`, JSON.stringify(item));
    });

    const response = await fetch('/finalizar_compra', { method: 'POST', body: formData });

    if (response.ok) {
        alert('Compra finalizada com sucesso!');
        cart = [];
        renderCart();
        window.location.href = '/';
    } else {
        alert('Erro ao finalizar a compra. Tente novamente!');
    }
}


function showPopup(message) {
    const popup = document.getElementById('success-popup');
    popup.innerHTML = message;
    popup.style.display = 'block';

    // Fechar o popup após 3 segundos e redirecionar para a página inicial
    setTimeout(function() {
        popup.style.display = 'none';
        window.location.href = "/";  // Redireciona para a página inicial
    }, 3000);
}


function validarCarrinho() {
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];

        // Verificar se a quantidade é um número positivo
        if (!item.quantidade || item.quantidade <= 0 || typeof item.quantidade !== 'number') {
            console.error(`Item ${i} inválido: quantidade inválida.`);
            return false;
        }

        // Verificar se o preço é válido
        if (!item.preco || item.preco <= 0 || typeof item.preco !== 'number') {
            console.error(`Item ${i} inválido: preço inválido.`);
            return false;
        }

        // Você pode adicionar outras validações conforme necessário (por exemplo, validar se os itens têm estoque disponível)
    }
    return true;
}

const estoque = {
    'Baunilha': 10000,
    'Chocolate': 10000,
    'Doce de Leite': 10000,
    'Morango': 10000,
    'Pistache': 10000,
    'Creme de Avelã': 10000,
    'Morango': 10000,
    'Coco': 10000,
    'Manga': 10000,
};

function validarCarrinho() {
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];

        // Verificar se a quantidade do item não ultrapassa o estoque
        if (item.quantidade > estoque[item.id]) {
            console.error(`Item ${i} inválido: quantidade maior que o estoque disponível.`);
            return false;
        }
    }
    return true;
}


function validarCarrinho() {
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];

        // Verifique se cada item tem a estrutura esperada
        if (!item.id || typeof item.id !== 'number') {
            console.error(`Item ${i} inválido: id ausente ou inválido.`);
            return false;
        }
        if (!item.name || typeof item.name !== 'string') {
            console.error(`Item ${i} inválido: nome ausente ou inválido.`);
            return false;
        }
        if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
            console.error(`Item ${i} inválido: preço ausente ou inválido.`);
            return false;
        }
        // Adicione mais verificações conforme necessário
    }
    return true;
}

document.body.addEventListener('click', function(event) {
    // Verifica se o alvo do clique é o botão de finalizar compra
    if (event.target && event.target.id === 'finalize-button') {
        finalizarCompra();  // Chama a função de finalização da compra
    }
});

// Adicionando o evento de clique ao botão de finalizar compra
document.getElementById('finalize-button').addEventListener('click', finalizarCompra);

document.addEventListener('DOMContentLoaded', function () {
    const myElement = document.getElementById('meuElemento');
    if (myElement) {
        myElement.addEventListener('click', function () {
            console.log('Elemento clicado!');
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');
    
    if (loginButton) {
        loginButton.addEventListener('click', function () {
            alert('Botão de login clicado!');
        });
    } else {
        console.error('Botão de login não encontrado!');
    }
});

const myElement = document.getElementById('meuElemento');
if (myElement) {
    myElement.addEventListener('click', function () {
        console.log('Elemento clicado!');
    });
} else {
    console.error('Elemento não encontrado');
}

document.addEventListener('DOMContentLoaded', function() {
    const finalizeButton = document.getElementById('finalize-button');
    if (finalizeButton) {
        finalizeButton.addEventListener('click', finalizarCompra);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Usar delegação de eventos se o botão for adicionado dinamicamente
    document.body.addEventListener('click', function (event) {
        if (event.target && event.target.id === 'finalize-button') {
            finalizarCompra();
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM completamente carregado!');
    const finalizeButton = document.getElementById('finalize-button');
    if (finalizeButton) {
        console.log('Botão encontrado!');
        finalizeButton.addEventListener('click', finalizarCompra);
    } else {
        console.error('Botão de finalizar compra não encontrado!');
    }
});

