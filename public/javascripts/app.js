const userPort = document.getElementById('userPort');
userPort.addEventListener('click', function () {
    document.getElementById("content").innerHTML = '';
    printUsersPage()
    loadUsersData()
})

