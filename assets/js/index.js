console.log('hellow i am running');


function shoesdata() {
    let shoesContainer = document.getElementById('productcontainer');
    let onsalebanner = document.getElementById('onsalebanner');
    let shoes = new XMLHttpRequest();

    shoes.open("GET", "DBproduct.json", true);

    shoes.onload = function () {
        let shoesDB = JSON.parse(this.responseText);
        let shoesobj = shoesDB.shoes;
        let shoesobjonsale = shoesDB.onsale;
        let html;
        // let htmlsalebanner;
        shoesobj.forEach((element, index) => {
            html = `
            <div class="productcard">
    <img src="${element.productImage}" id="productimg">
    <div class="productcarddis">
        <p class="disscribe">${element.name}</p>
        <p class="price">$ ${element.price}</p>
        <button id="${index}" class="addtocartdisplay" onclick="addtocart(this.id)"><i class="fa fa-shopping-bag"></i>Shop Now</button>
  </div>
  </div>
      
                `
            shoesContainer.innerHTML += html;
        });
        shoesobjonsale.forEach((element, index) => {
            onsalebanner.innerHTML += `
            <div class="saleproduct1">
            <div class="imgcontainer">
            <img src="${element.productImage}">
            </div>
            <div class="saleproductdis1">
                <h2>${element.name}</h2>
                <p> $ ${element.price}</p>
                <button id="productbtn" class="addtocartdisplay"><i
                        class="fa fa-shopping-basket"></i>Basket</button>
            </div>
            </div>`;
        });
    }
    shoes.send();
}
shoesdata();

// -----------------addtocart----------------

function addtocart(index) {

    let shoes = new XMLHttpRequest();

    shoes.open("GET", "DBproduct.json", true);

    shoes.onload = function () {
        let shoesDB = JSON.parse(this.responseText);
        let subtotalitem = localStorage.getItem('subtotal');
        let Totalitem = localStorage.getItem('Totalitem');
        let totalincart = localStorage.getItem('totalincart');
        let content = localStorage.getItem('productshoes');
        content = JSON.parse(content);
        let shoesobj = shoesDB.shoes[index];
        if (content != null) {
            if (content[shoesobj.tag] == undefined) {
                content = {
                    ...content,
                    [shoesobj.tag]: shoesobj
                }
            }
            content[shoesobj.tag].inCart += 1;

        } else {
            shoesobj.inCart = 1;
            content = {
                [shoesobj.tag]: shoesobj
            }
            
        }
        localStorage.setItem('productshoes', JSON.stringify(content));
        createproductincart();


        //---------------------------for total cost-------------------------------------


        if (subtotalitem != null) {
            subtotalitem = parseInt(shoesobj.price)  + parseInt(subtotalitem);
        }else{
            subtotalitem = shoesobj.price;
        }
        localStorage.setItem('subtotal', subtotalitem);
        
        //---------------------------for total item-------------------------------------

        if (Totalitem != null) {
            Totalitem = parseInt(shoesobj.inCart)  + parseInt(Totalitem);
        }else{
            Totalitem = shoesobj.inCart;
        }
        localStorage.setItem('Totalitem', Totalitem);
        
        //---------------------------for total incart-------------------------------------

        if (totalincart != null) {

            totalincart = parseInt(totalincart) + 1;
        }else{
            totalincart = shoesobj.inCart;
        }
        localStorage.setItem('totalincart', totalincart);
        productdetailincart();


    }
    
    shoes.send();
}

function createproductincart() {
    let html;
    let displaycart = document.querySelector('.displayProducts');
    let content = localStorage.getItem('productshoes');
    let cartproduct = JSON.parse(content);
    if (cartproduct && displaycart) {
        displaycart.innerHTML = '';
        Object.values(cartproduct).map(item  => {
            html = `
            <div class="fullcart">
            <div class ='aboutproduct'>
                <div class="imgpro">
                <img src="${item.productImage}">
                </div>
                <div class="prddetail">
                    <h2>${item.name}</h2>
                    <h4>Size: ${item.size}</h4>
                    <h4>Price: ${item.price * item.inCart}</h4>
                </div>
            </div>
            <div class="quentity">
                <i class="fa fa-minus iconhover" id="${item.index}" onclick="minusproduct(this.id)"></i>
                   <h4 id="quentityofproduct" >${item.inCart}</h4>
                <i class="fa fa-plus iconhover" id="${item.index}" onclick="addtocart(this.id)"></i>
            </div>
            <div class="clearproduct" >
                <button class= 'removeoneproduct' id="${item.tag}"  onclick="deleteproductincart(this.id)"> Remove</button>
                <button class= 'buyoneproduct'> Buy now </button>
            </div>
            </div>`
            displaycart.innerHTML += html;
        });
    }

}
createproductincart();

function productdetailincart(){
    let subtotal = localStorage.getItem('subtotal');
    let Totalitem = localStorage.getItem('Totalitem');
    let totalincart = localStorage.getItem('totalincart');
    let detail = document.querySelector('#cartdetail');

    detail.innerHTML = `
                        <h2>Total item: ${Totalitem}</h2>
                        <h2>Total Rs: ${subtotal}</h2> 
                        <button class= 'removeall' onclick="clearallproduct()"> Remove All</button>
                        <button class= 'buyall'>Proceed to buy </button>

                        `
}
productdetailincart();


function minusproduct(index){
    let shoes = new XMLHttpRequest();

    shoes.open("GET", "DBproduct.json", true);

    shoes.onload = function () {
        let shoesDB = JSON.parse(this.responseText);
        let content = localStorage.getItem('productshoes');
        content = JSON.parse(content);
        let shoesobj = shoesDB.shoes[index];
        if (content != null) {
            if (content[shoesobj.tag] == undefined) {
                content = {
                    ...content,
                    [shoesobj.tag]: shoesobj
                }
            }
            content[shoesobj.tag].inCart -= 1;
            if(content[shoesobj.tag].inCart < 1){
                alert('product delete');
            }
        } else {
            shoesobj.inCart = 1;
            content = {
                [shoesobj.tag]: shoesobj
            }
        }
        localStorage.setItem('productshoes', JSON.stringify(content));
        productdetailincart();

        createproductincart();
    }

    shoes.send();

}

// ----------------for deleting product-------------------

function deleteproductincart(index) {
    let content = localStorage.getItem('productshoes');
    content = JSON.parse(content);
    console.log(content[index]);

    if (content == null) {
        content = [];
    } else {
        content = JSON.parse(content);
    } 
    content.splice(index, content[content.tag]);
    localStorage.setItem('productshoes', JSON.stringify(content));
}

// ----------------for removing all product which stored in add to cart-------------------

function clearallproduct(){
    localStorage.clear();
    location.reload();
}


function showandhidecart() {
    const cartbtnshow = document.getElementById('basket');


    cartbtnshow.addEventListener('click', () => {
        let cartarea = document.getElementById('displayCart');
        if (cartarea.style.display == 'block') {
            cartarea.style.display = 'none';
        } else {
            cartarea.style.display = 'block';

        }
    })
}

showandhidecart();

// -----------------for responsive menuslider----------------


let menubtn = document.getElementById('res');
let menu0 = document.getElementById('menu0');
menubtn.addEventListener('click', function kgf() {
    if (menu0.style.display == 'block') {
        menu0.style.display = 'none';
    }
    else {
        menu0.style.display = 'block';
    }
})

// ---------------------for search baar-------------------------
let searchbtn = document.getElementById('search');
let searchinput0 = document.getElementById('searchinput');
searchbtn.addEventListener('click', function searchbaar() {
    if (searchinput0.style.display == 'inline') {
        searchinput0.style.display = 'none';
    }
    else {
        searchinput0.style.display = 'inline';
    }
})

// ------------------------for register------------------------
let rergisterbtn = document.getElementById('register');
let userpage = document.getElementById('userid');
rergisterbtn.addEventListener('click', function rer() {
    console.log('im running')
    if (userpage.style.display == 'block') {
        userpage.style.display = 'none';
    } else {
        userpage.style.display = 'block';
    }
})

let loginbtn = document.getElementById('forlogin');
let signupbtn = document.getElementById('forsignup');
let useridheight = document.getElementById('userid');
let loginpage = document.getElementById('login');
let signuppage = document.getElementById('signup');

signupbtn.addEventListener('click', function log0() {
    if (loginpage.style.display == 'block') {
        loginpage.style.display = 'none';
        signuppage.style.display = 'block';

    } else {
        loginpage.style.display = 'none';
        signuppage.style.display = 'block';
        useridheight.style.height = '480px';
    }
})
loginbtn.addEventListener('click', function log1() {
    if (signuppage.style.display == 'block') {
        signuppage.style.display = 'none';
        loginpage.style.display = 'block';
    } else {
        signuppage.style.display = 'none';
        loginpage.style.display = 'block';
        useridheight.style.height = '400px';
    }
})
