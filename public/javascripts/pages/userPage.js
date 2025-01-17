function printUsersPage() {
    let content = document.getElementById("content");

    const nameInputObj = createInputComponent('', 'Name:', [fieldValidator])
    content.appendChild(nameInputObj.component);

    const emailInputObj = createInputComponent('', 'Email:', [fieldValidator, emailFormatValidator])
    content.appendChild(emailInputObj.component);


    let divButton = document.createElement('div');
    content.appendChild(divButton);
    let btnSendData = document.createElement('button');
    btnSendData.innerText = 'Submit';
    btnSendData.className = 'button';
    divButton.appendChild(btnSendData);
    btnSendData.addEventListener('click', () => {
        const v1 = nameInputObj.validate();
        const v2 = emailInputObj.validate();
        if (v1 && v2) {
            sendDataUsers(nameInputObj.getValue(), emailInputObj.getValue());
            nameInputObj.resetValue();
            emailInputObj.resetValue();
        }
    })

    let usersList = document.createElement('div');
    usersList.id = 'usersList'
    content.appendChild(usersList);
}

function loadUsersData() {

    fetch('/users')
        .then((response) => {
            return response.json();
        })
        .then((data) => {

            let usersList = document.getElementById('usersList')
            usersList.innerHTML = null

            for (let i = 0; i < data.length; i++) {
                let userComponent = document.createElement("div");
                userComponent.innerText = data[i].name;
                usersList.appendChild(userComponent);

                let btnDelete = document.createElement("button");
                btnDelete.innerText = "Delete";
                btnDelete.className = 'button';
                userComponent.appendChild(btnDelete);
                btnDelete.addEventListener('click', () => { deleteUser(data[i].id) });

                let btnEdit = document.createElement("button");
                btnEdit.innerText = "Edit";
                btnEdit.className = 'button';
                userComponent.appendChild(btnEdit);
                btnEdit.addEventListener('click', () => { openEditModalBox(data[i].id, data[i].name, data[i].email) })
            }

        });
}

function sendDataUsers(userNameInputValue, userEmailInputValue) {

    let userData = {
        name: userNameInputValue,
        email: userEmailInputValue
    }


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
                loadUsersData()
            } else {
                console.log('error data:', resp.data)
            }
        })


}

function deleteUser(id) {
    fetch(`/users/${id}`, {
        method: 'DELETE',
    }).then(() => loadUsersData())
}


const fieldValidator = {
    errorMessage: "Field mustn't be empty",
    isValid: (value) => value != null && value !== ''
}
const emailFormatValidator = {
    errorMessage: "Invalid email format",
    isValid: (value) => /^\w*@\w*\.\w*/.test(value)
}


function openEditModalBox(id, name, email) {
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



    const nameInputObj = createInputComponent(name, 'Name:', [fieldValidator])
    modalContentNode.appendChild(nameInputObj.component);


    const emailInputObj = createInputComponent(email, 'Email:', [fieldValidator, emailFormatValidator])
    modalContentNode.appendChild(emailInputObj.component);

    let btnSubmit = document.createElement("button");
    btnSubmit.innerText = "Submit";
    btnSubmit.className = "button";
    modalContentNode.appendChild(btnSubmit);
    btnSubmit.addEventListener('click', () => {
        const v1 = nameInputObj.validate()
        const v2 = emailInputObj.validate()
        if (v1 && v2) {
            submitEditForm(nameInputObj.getValue(), emailInputObj.getValue(), id)
        }
    });

    let btnExit = document.createElement("button");
    btnExit.innerText = "Exit";
    btnExit.className = "button-exit"
    modalContentNode.appendChild(btnExit);
    btnExit.addEventListener('click', () => { document.getElementById('modalBox').remove() });

}

function submitEditForm(name, email, id) {

    let userData = {
        name: name,
        email: email,
        id: id,
    }
    fetch(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' }
    }).then(() => {
        document.getElementById('modalBox').style.display = 'none',
            document.getElementById('modalBox').remove(),
            loadUsersData()
    }
    )
}