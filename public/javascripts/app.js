const userPort = document.getElementById('userPort');
userPort.addEventListener('click', function () {
    document.getElementById("content").innerHTML = '';
    printUsersPage()
    printUsersList()
})

function printUsersPage() {
    let content = document.getElementById("content");

    let divInputName = document.createElement('div');
    content.appendChild(divInputName);
    let inputName = document.createElement('input');
    inputName.id = 'inputNameValue';
    let labelNode = document.createElement('label');
    labelNode.innerText = 'Name: '
    divInputName.appendChild(labelNode);
    divInputName.appendChild(inputName);

    let divInputEmail = document.createElement('div');
    content.appendChild(divInputEmail);
    let inputEmail = document.createElement('input');
    inputEmail.id = 'inputEmailValue';
    let labelEmailNode = document.createElement('label');
    labelEmailNode.innerText = 'Email: '
    divInputEmail.appendChild(labelEmailNode);
    divInputEmail.appendChild(inputEmail)

    let divButton = document.createElement('div');
    content.appendChild(divButton);
    let btnSendData = document.createElement('button');
    btnSendData.innerText = 'Submit';
    btnSendData.className = 'button';
    divButton.appendChild(btnSendData);
    btnSendData.addEventListener('click', sendData)

    let usersList = document.createElement('div');
    usersList.id = 'usersList'
    content.appendChild(usersList);
}

function printUsersList() {

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

function sendData() {
    let userNameInput = document.getElementById("inputNameValue")
    let userEmailInput = document.getElementById("inputEmailValue")

    let userData = {
        name: userNameInput.value,
        email: userEmailInput.value,
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
                printUsersList()
            } else {
                console.log('error data:', resp.data)
            }
        })


}

function deleteUser(id) {
    fetch(`/users/${id}`, {
        method: 'DELETE',
    }).then(() => printUsersList())
}

function createInputComponent(inputValue, label, validators) {
    const componentNode = document.createElement('div')

    const popupDivNode = componentNode.appendChild(document.createElement('div'))
    const popupDivSpanNode = popupDivNode.appendChild(document.createElement('span'))
    popupDivSpanNode.innerText = ''
    popupDivSpanNode.style.display = 'none'

    const inputLabelNode = componentNode.appendChild(document.createElement('label'))
    inputLabelNode.innerText = label

    const inputlNode = componentNode.appendChild(document.createElement('input'))
    inputlNode.value = inputValue

    return {
        component: componentNode,
        getValue: () => {
            return inputlNode.value
        },
        validate: () => {
            for (let i = 0; i < validators.length; i++) {
                const validator = validators[i];
                if (!validator.isValid(inputlNode.value)) {
                    popupDivSpanNode.style.display = 'block'
                    popupDivSpanNode.style.color = 'red'
                    popupDivSpanNode.innerText = validator.errorMessage
                    return false;
                }
            }
            popupDivSpanNode.style.display = 'none'
            return true;

        },
        hideValidationError: () => {
            popupDivSpanNode.style.display = 'none'
        }
    }
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
            printUsersList()
    }
    )
}