// script.js

function populateProvidersSelect(fornecedores) {
    const select = document.getElementById('provider');

    fornecedores.forEach(fornecedor => {
        const option = document.createElement('option');
        option.value = fornecedor.id;
        option.textContent = fornecedor.nome;
        select.appendChild(option);
    });
}

window.onload = function() {
    fetch('/fornecedores')
        .then(response => response.json())
        .then(data => {
            populateProvidersSelect(data);
        })
        .catch(error => console.error('Erro ao carregar fornecedores:', error));
};
