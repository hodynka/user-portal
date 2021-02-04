window.addEventListener('load', function () {
    printUsersList()
})

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

                let btnEdit = document.createElement("button");
                btnEdit.innerText = "Edit";
                userComponent.appendChild(btnEdit);
                btnEdit.addEventListener('click', () => { openEditPopup(data[i].id, data[i].name, data[i].email) })
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
                    userNameInput.value = '';
                    userEmailInput.value = '';
                    printUsersList()
                } else {
                    console.log('error data:', resp.data)
                }
            })

    }
}

function deleteUser(id) {
    fetch(`/users/${id}`, {
        method: 'DELETE',
    }).then(printUsersList())
}

// popup for edit section

function openEditPopup(id, name, email) {
    const generalSectionNode = document.getElementById('generalSection')

    const modalBoxNode = document.createElement('div');
    modalBoxNode.className = 'modal';
    modalBoxNode.id = 'modalBox'
    modalBoxNode.style.display = 'block';
    generalSectionNode.appendChild(modalBoxNode)

    const modalContentNode = modalBoxNode.appendChild(document.createElement('div'))
    modalContentNode.className = 'modal-content'
    modalContentNode.id = 'modalContent'

    const popupTitleNode = modalContentNode.appendChild(document.createElement('h3'))
    popupTitleNode.innerText = 'Edit section'

    const nameInput = document.createElement('input')
    nameInput.value = name;
    modalContentNode.appendChild(nameInput)

    const emailInput = document.createElement('input')
    emailInput.value = email;
    modalContentNode.appendChild(emailInput)

    let btnSubmit = document.createElement("button");
    btnSubmit.innerText = "Submit";
    modalContentNode.appendChild(btnSubmit)
    btnSubmit.addEventListener('click', () => { submitEditForm(nameInput.value,emailInput.value, id)})

    let btnExit = document.createElement("button");
    btnExit.innerText = "Exit";
    modalContentNode.appendChild(btnExit);
    btnExit.addEventListener('click', () => {document.getElementById('modalBox').remove()} )
    
}

function submitEditForm(name, email, id){

    let userData = {
        name: name,
        email: email,
        id: id,
    }

    fetch(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' }
    }).then(
        
        document.getElementById('modalBox').style.display = 'none',
        document.getElementById('modalBox').remove(),
        printUsersList())
}