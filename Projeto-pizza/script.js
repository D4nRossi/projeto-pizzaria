let cart = [];
let modalQt = 1;
let modalKey = 0;

//criando arrow function para otimizar o código
const c = (el) => document.querySelector(el);//retorna o item
const cs = (el) => document.querySelectorAll(el);//retorna um array com os itens

pizzaJson.map((item, index) =>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);//clona tudo que estiver dentro do item

    //inserindo a chave especifica de cada pizza
    pizzaItem.setAttribute('data-key', index);

    //preenchendo as informações das pizzas
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;//adicionando o simbolo do real e também 2 casa decimais.
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //evento de clique na tag 'a' (bloqueio de ação para que não atualize a tela)
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();//prevenindo a ação padrão da ancora

        let key = e.target.closest('.pizza-item')/*procurando o elemento mais proximo que tenha o parametro*/.getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        //adicionando as informações na janela
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${item.price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');//adiciona só na grande
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        //fazendo a janela aparecer e colocando uma animação nela
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    c('.pizza-area').append(pizzaItem);//pega o conteudo e adiciona mais conteudos

});

//Eventos da janela
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500)
}

//da pra executar aql função no onclick, mas também tem como no JS

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});


//adicionando eventos nos botoes de adicionar e remover
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt;
    }/*else{
        if(modalQt < 1){
            closeModal();
        }
    }*/
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

//ajustando os botoes de tamanho
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected'); 
        size.classList.add('selected'); 
    });  
});

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item) => item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        //para adicionar no array
        cart.push({
                identifier,
                id:pizzaJson[modalKey].id,
                size,
                qt:modalQt
            });
    }

    
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
      c('aside').style.left = 0;  
    }
})

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
})

function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;
    
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);

            subtotal += pizzaItem.price * cart[i].qt; 

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P'
                    break;
                  
                case 1:
                    pizzaSizeName = 'M'
                    break;    
            
                case 2:
                    pizzaSizeName = 'G'
                    break;    
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }   
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });


            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)};`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)};`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)};`

    }else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}

