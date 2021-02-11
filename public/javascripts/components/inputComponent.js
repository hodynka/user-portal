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
