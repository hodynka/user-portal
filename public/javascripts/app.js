const userPort = document.getElementById('userPort');
userPort.addEventListener('click', function () {
    document.getElementById("content").innerHTML = '';
    printUsersPage()
    loadUsersData()
})

const productsList = document.getElementById('products');
productsList.addEventListener('click', function () {
    document.getElementById("content").innerHTML = '';
    printProductPage()
    loadProductsData()

})

