function printProductPage() {
    let content = document.getElementById("content");

    let divInputImg = document.createElement('div');
    content.appendChild(divInputImg );
    let inputImg = document.createElement('input');
    inputImg.id = 'inputImgProductValue';
    let labeImglNode = document.createElement('label');
    labeImglNode.innerText = 'Image: '
    divInputImg.appendChild(labeImglNode);
    divInputImg.appendChild(inputImg);
    
    let divInputName = document.createElement('div');
    content.appendChild(divInputName);
    let inputName = document.createElement('input');
    inputName.id = 'inputNameProductValue';
    let labelNode = document.createElement('label');
    labelNode.innerText = 'Name: '
    divInputName.appendChild(labelNode);
    divInputName.appendChild(inputName);

    let divInputPrice = document.createElement('div');
    content.appendChild(divInputPrice);
    let inputPrice = document.createElement('input');
    inputPrice.id = 'inputPriceProductValue';
    let labelPriceNode = document.createElement('label');
    labelPriceNode.innerText = 'Price: '
    divInputPrice.appendChild(labelPriceNode);
    divInputPrice.appendChild(inputPrice)

    let divButton = document.createElement('div');
    content.appendChild(divButton);
    let btnSendData = document.createElement('button');
    btnSendData.innerText = 'Submit';
    btnSendData.className = 'button';
    divButton.appendChild(btnSendData);
    btnSendData.addEventListener('click', sendDataProduct)

    let productsList = document.createElement('div');
    productsList.id = 'productsList'
    content.appendChild(productsList);
}

function sendDataProduct() {
    let productNameInput = document.getElementById("inputNameProductValue");
    let productPriceInput = document.getElementById("inputPriceProductValue");
    let productImgInput = document.getElementById("inputImgProductValue");

    let productData = {
        img: productImgInput.value,
        name: productNameInput.value,
        price: productPriceInput.value,
    }


    fetch('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => {
            const isOk = resp.ok
            return resp.json().then(respData => { return { ok: isOk, data: respData } })
        })
        .then(resp => {
            if (resp.ok) {
                productImgInput.value = '';
                productNameInput.value = '';
                productPriceInput.value = '';
                loadProductsData()
            } else {
                console.log('error data:', resp.data)
            }
        })
}

function loadProductsData() {
    fetch('/products')
    .then((response) => {
        return response.json();
    })
    .then((data) => {

        let productsList = document.getElementById('productsList')
        productsList.innerHTML = null

        for (let i = 0; i < data.length; i++) {

            console.log('data: ' + JSON.stringify(data[i]))

            let productComponent = document.createElement("div");
            productComponent.className = 'productCard'
            let productImgDiv = document.createElement('div')
            productComponent.appendChild(productImgDiv);
            let productImg = document.createElement('img');
            productImg.className = 'productImg'
            productImg.src = data[i].img;
            productImgDiv.appendChild(productImg)

            let productName = document.createElement('div')
            productName.innerText = data[i].name;
            productComponent.appendChild(productName);

            let productPrice = document.createElement('div');
            productPrice.innerText = data[i].price;
            productComponent.appendChild(productPrice)
           
            productsList.appendChild(productComponent);

            let btnDelete = document.createElement("button");
            btnDelete.innerText = "Delete";
            btnDelete.className = 'button';
            productComponent.appendChild(btnDelete);
            btnDelete.addEventListener('click', () => { deleteProduct(data[i].id) });

            let btnEdit = document.createElement("button");
            btnEdit.innerText = "Edit";
            btnEdit.className = 'button';
            productComponent.appendChild(btnEdit);
            btnEdit.addEventListener('click', () => { openEditModalBoxProduct(data[i].id, data[i].name, data[i].price, data[i].img) })
        }

    });
}

function deleteProduct(id) {
    fetch(`/products/${id}`, {
        method: 'DELETE',
    }).then(() => loadProductsData())
}

const fieldValidatorProduct = {
    errorMessage: "Field mustn't be empty",
    isValid: (value) => value != null && value !== ''
}
const priceFormatValidator = {
    errorMessage: "Invalid price format",
    isValid: (value) => /^\d+\.?\d*$/.test(value)
}


function openEditModalBoxProduct(id, name, price, img) {
    const generalSectionNode = document.getElementById('generalSection')

    const modalBoxNode = document.createElement('div');
    modalBoxNode.className = 'modal';
    modalBoxNode.id = 'modalBoxProduct'
    modalBoxNode.style.display = 'block';
    generalSectionNode.appendChild(modalBoxNode)

    const modalContentNode = modalBoxNode.appendChild(document.createElement('div'))
    modalContentNode.className = 'modal-content'
    modalContentNode.id = 'modalContentProduct'

    const popupTitleNode = modalContentNode.appendChild(document.createElement('h3'))
    popupTitleNode.innerText = 'Edit section'

    const nameInputObj = createInputComponent(name, 'Name:', [fieldValidatorProduct])
    modalContentNode.appendChild(nameInputObj.component);


    const priceInputObj = createInputComponent(price, 'Price:', [fieldValidatorProduct, priceFormatValidator])
    modalContentNode.appendChild(priceInputObj.component);

    let btnSubmit = document.createElement("button");
    btnSubmit.innerText = "Submit";
    btnSubmit.className = "button";
    modalContentNode.appendChild(btnSubmit);
    btnSubmit.addEventListener('click', () => {
        const v1 = nameInputObj.validate()
        const v2 = priceInputObj.validate()
        if (v1 && v2) {
            submitEditFormProduct(img, nameInputObj.getValue(), priceInputObj.getValue(), id)
        }
    });

    let btnExit = document.createElement("button");
    btnExit.innerText = "Exit";
    btnExit.className = "button-exit"
    modalContentNode.appendChild(btnExit);
    btnExit.addEventListener('click', () => { document.getElementById('modalBoxProduct').remove() });

}

function submitEditFormProduct(img, name, price, id) {

    let productData = {
        img: img,
        name: name,
        price: price,
        id: id,
    }
    fetch(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
        headers: { 'Content-Type': 'application/json' }
    }).then(() => {
        document.getElementById('modalBoxProduct').style.display = 'none',
            document.getElementById('modalBoxProduct').remove(),
            loadProductsData()
    }
    )
}