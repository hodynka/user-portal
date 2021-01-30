

function fetchUsers() {
    console.log(123)

    fetch('/users')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            let usersList = document.getElementById('usersList');
            usersList.innerHTML = null

            for (let i =0; i<data.length; i++) {
                let userComponent = document.createElement("div");
                userComponent.innerText = data[i].name
                usersList.appendChild(userComponent)
            }

        });
}
