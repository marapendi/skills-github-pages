document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.getElementById('formCadastro');
    const listaProdutos = document.getElementById('listaProdutos').getElementsByTagName('tbody')[0];
    const btnCancelar = document.getElementById('btnCancelar');
    const idprodInput = document.getElementById('idprod');
    const produtoInput = document.getElementById('produto');
    const unidadeInput = document.getElementById('unidade');
    const fatorMultiplicadorInput = document.getElementById('fatorMultiplicador');
    const grupoInput = document.getElementById('grupo');
    const apelidoInput = document.getElementById('apelido');

    const spreadsheetId = '1HTbzVOPQxz4gyJfJxYXFzRV3yjezIQMPcmsPph6qyQo'; // Substitua pela sua chave da planilha
    const csvUrl = `https://docs.google.com/spreadsheets/d/${1HTbzVOPQxz4gyJfJxYXFzRV3yjezIQMPcmsPph6qyQo}/gviz/tq?tqx=out:csv&tq&gid=0`; // Assumindo que os dados estão na primeira aba (gid=0)

    let produtos = [];
    let produtoEditandoId = null;

    function carregarProdutos() {
        fetch(csvUrl)
            .then(response => response.text())
            .then(csvData => {
                produtos = parseCSV(csvData);
                renderizarProdutos();
            })
            .catch(error => console.error('Erro ao carregar dados da planilha:', error));
    }

    function parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const produto = {};
            for (let j = 0; j < headers.length; j++) {
                produto[headers[j].trim()] = values[j] ? values[j].trim() : '';
            }
            data.push(produto);
        }
        return data;
    }

    function renderizarProdutos() {
        listaProdutos.innerHTML = '';
        produtos.forEach(produto => {
            const row = listaProdutos.insertRow();
            row.insertCell().textContent = produto.IDPROD;
            row.insertCell().textContent = produto.PRODUTO;
            row.insertCell().textContent = produto.UNIDADE;
            row.insertCell().textContent = produto['FATOR MULTIPLICADOR'];
            row.insertCell().textContent = produto.GRUPO;
            row.insertCell().textContent = produto.APELIDO;

            const actionsCell = row.insertCell();
            const editarButton = document.createElement('button');
            editarButton.textContent = 'Editar';
            editarButton.classList.add('editar');
            editarButton.addEventListener('click', () => editarProduto(produto.IDPROD, produto)); // A edição com Google Sheets é mais complexa sem um backend

            const excluirButton = document.createElement('button');
            excluirButton.textContent = 'Excluir';
            excluirButton.classList.add('excluir');
            excluirButton.addEventListener('click', () => excluirProduto(produto.IDPROD)); // A exclusão com Google Sheets é mais complexa sem um backend

            actionsCell.appendChild(editarButton);
            actionsCell.appendChild(excluirButton);
        });
    }

    function adicionarProduto(event) {
        event.preventDefault();
        const novoProduto = {
            IDPROD: produtoEditandoId || gerarIdUnico(),
            PRODUTO: produtoInput.value,
            UNIDADE: unidadeInput.value,
            'FATOR MULTIPLICADOR': parseInt(fatorMultiplicadorInput.value),
            GRUPO: grupoInput.value,
            APELIDO: apelidoInput.value
        };

        // *** ATENÇÃO: A escrita direta na Planilha Google a partir do navegador é complexa e geralmente requer APIs de backend. ***
        // *** Este código apenas simula a adição/edição localmente na variável 'produtos'. ***
        if (produtoEditandoId) {
            const index = produtos.findIndex(p => p.IDPROD === produtoEditandoId);
            if (index !== -1) {
                produtos[index] = novoProduto;
            }
        } else {
            produtos.push(novoProduto);
        }
        renderizarProdutos();
        formCadastro.reset();
        idprodInput.value = '';
        produtoEditandoId = null;
        btnCancelar.style.display = 'none';

        alert("A gravação na Planilha Google requer uma implementação mais complexa com APIs de backend.");
    }

    function editarProduto(id, produto) {
        produtoEditandoId = id;
        idprodInput.value = produto.IDPROD;
        produtoInput.value = produto.PRODUTO;
        unidadeInput.value = produto.UNIDADE;
        fatorMultiplicadorInput.value = produto['FATOR MULTIPLICADOR'];
        grupoInput.value = produto.GRUPO;
        apelidoInput.value = produto.APELIDO;
        btnCancelar.style.display = 'inline-block';
    }

    function excluirProduto(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            produtos = produtos.filter(produto => produto.IDPROD !== id);
            renderizarProdutos();
            alert("A exclusão na Planilha Google requer uma implementação mais complexa com APIs de backend.");
        }
    }

    function cancelarEdicao() {
        formCadastro.reset();
        idprodInput.value = '';
        produtoEditandoId = null;
        btnCancelar.style.display = 'none';
    }

    function gerarIdUnico() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    formCadastro.addEventListener('submit', adicionarProduto);
    btnCancelar.addEventListener('click', cancelarEdicao);

    carregarProdutos();
});