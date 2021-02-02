function printUsersList() {
    fetch('/users')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            let usersList = document.getElementById('usersList');
            usersList.innerHTML = null

            for (let i = 0; i < data.length; i++) {
                let userComponent = document.createElement("div");
                userComponent.innerText = data[i].name;
                usersList.appendChild(userComponent);
                
                let btnDelete = document.createElement("button");
                btnDelete.innerText = "Delete";
            
                userComponent.appendChild(btnDelete);
                
                btnDelete.addEventListener('click', () => { deleteUser(data[i].id) });  

                let bttnEdit = document.createElement("button");
                bttnEdit.innerText = "Edit";
                // btnEdit.id = data[i].id;
                userComponent.appendChild(bttnEdit);
            }

        });
}

function validateUserData(data) {
    return true;
}

function sendData() {
    let userNameInput = document.getElementById("inputNameValue")
    let userEmailInput = document.getElementById("inputEmailValue")

    let userData = {
        name: userNameInput.value,
        email: userEmailInput.value,
    }

    const validationPassed = validateUserData(userData)

    if (validationPassed) {
        fetch('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(resp => {
                const isOk = resp.ok
                return resp.json().then(respData => { return { ok: isOk, data: respData } })
            })
            .then(resp => {
                if (resp.ok) {
                    console.log(123)
                    userNameInput.value = '';
                    userEmailInput.value = '';
                    printUsersList()
                } else {
                    console.log('error data:', resp.data)
                }
            })

    }
}

function deleteUser(id){
    fetch(`/users/${id}`, {
        method: 'DELETE',
    }).then(printUsersList())
}