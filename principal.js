window.onload = function() {
    const myModal = document.getElementById('myModal')
    const myInput = document.getElementById('myInput')

    myModal.showModal();

    myModal.addEventListener('shown.bs.modal', () => {
        myInput.focus()
    })
}