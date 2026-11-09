let clientes = [];
let produtos = [];


async function inicializar() {
    await buscarClientes();
    await buscarProdutos();
}


async function buscarClientes() {
    try {
        const response = await fetch(`${API_URL}/clientes`);
        clientes = await response.json();
        listarClientes();
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
    }
}

async function buscarProdutos() {
    try {
        const response = await fetch(`${API_URL}/produtos`);
        produtos = await response.json();
        listarProdutos();
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
    }
}


async function salvarCliente() {
    const idInput = document.getElementById('clienteId').value;
    const nomeInput = document.getElementById('clienteNome').value;
    const emailInput = document.getElementById('clienteEmail').value;

    if (nomeInput === "" || emailInput === "") {
        alert("Por favor, preencha todos os campos do cliente!");
        return;
    }

    const dadosCliente = { nome: nomeInput, email: emailInput };

    try {
        if (idInput === "") {
            
            const response = await fetch(`${API_URL}/clientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosCliente)
            });
            if (response.ok) alert("Cliente cadastrado com sucesso!");
        } else {
            
            const response = await fetch(`${API_URL}/clientes/${idInput}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosCliente)
            });
            if (response.ok) alert("Cliente atualizado com sucesso!");
            document.getElementById('btnSalvarCliente').innerText = "Salvar Cliente";
        }

    
        document.getElementById('clienteId').value = "";
        document.getElementById('clienteNome').value = "";
        document.getElementById('clienteEmail').value = "";
        
        await buscarClientes();
    } catch (error) {
        alert("Erro ao salvar cliente.");
    }
}

async function excluirCliente(id) {
    if (!confirm("Deseja realmente excluir este cliente?")) return;

    try {
        const response = await fetch(`${API_URL}/clientes/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert("Cliente removido!");
            await buscarClientes();
        }
    } catch (error) {
        alert("Erro ao excluir cliente.");
    }
}

function prepararEditarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
        document.getElementById('clienteId').value = cliente.id;
        document.getElementById('clienteNome').value = cliente.nome;
        document.getElementById('clienteEmail').value = cliente.email;
        document.getElementById('btnSalvarCliente').innerText = "Atualizar Cliente";
    }
}


async function salvarProduto() {
    const idInput = document.getElementById('produtoId').value;
    const nomeInput = document.getElementById('produtoNome').value;
    const qtdInput = parseInt(document.getElementById('produtoQtd').value);

    if (nomeInput === "" || isNaN(qtdInput)) {
        alert("Por favor, preencha todos os campos do produto!");
        return;
    }

    const dadosProduto = { nome: nomeInput, quantidade: qtdInput };

    try {
        if (idInput === "") {
            // Novo Produto (POST)
            const response = await fetch(`${API_URL}/produtos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosProduto)
            });
            if (response.ok) alert("Equipamento cadastrado!");
        } else {
            // Atualizar Produto (PUT)
            const response = await fetch(`${API_URL}/produtos/${idInput}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosProduto)
            });
            if (response.ok) alert("Equipamento atualizado!");
            document.getElementById('btnSalvarProduto').innerText = "Salvar Produto";
        }

        document.getElementById('produtoId').value = "";
        document.getElementById('produtoNome').value = "";
        document.getElementById('produtoQtd').value = "";
        
        await buscarProdutos();
    } catch (error) {
        alert("Erro ao salvar produto.");
    }
}

async function comprarEstoque(id) {
    const qtdCompra = parseInt(prompt("Quantas unidades deseja COMPRAR (Adicionar ao estoque)?"));
    if (isNaN(qtdCompra) || qtdCompra <= 0) {
        alert("Quantidade inválida!");
        return;
    }

    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    try {
        
        const novaQuantidade = produto.quantidade + qtdCompra;
        await fetch(`${API_URL}/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: produto.nome, quantidade: novaQuantidade })
        });
        await buscarProdutos();
    } catch (error) {
        alert("Erro ao atualizar estoque.");
    }
}

async function venderEstoque(id) {
    const qtdVenda = parseInt(prompt("Quantas unidades deseja VENDER (Retirar do estoque)?"));
    if (isNaN(qtdVenda) || qtdVenda <= 0) {
        alert("Quantidade inválida!");
        return;
    }

    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    if (produto.quantidade < qtdVenda) {
        alert("Estoque insuficiente para esta venda!");
        return;
    }

    try {
        
        const novaQuantidade = produto.quantidade - qtdVenda;
        await fetch(`${API_URL}/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: produto.nome, quantidade: novaQuantidade })
        });
        alert("Venda realizada com sucesso!");
        await buscarProdutos();
    } catch (error) {
        alert("Erro ao processar venda.");
    }
}

function listarClientes() {
    const containerLista = document.getElementById('listaClientes');
    if (!containerLista) return;
    containerLista.innerHTML = "";

    if (clientes.length === 0) {
        containerLista.innerHTML = "<p>Nenhum cliente cadastrado.</p>";
        return;
    }

    clientes.forEach(c => {
        containerLista.innerHTML += `
            <div class="item-lista">
                <p><strong>Nome:</strong> ${c.nome}</p>
                <p><strong>E-mail:</strong> ${c.email}</p>
                <div class="btn-acoes">
                    <button class="btn-editar" onclick="prepararEditarCliente('${c.id}')">Editar</button>
                    <button class="btn-excluir" onclick="excluirCliente('${c.id}')">Excluir</button>
                </div>
            </div>`;
    });
}

function listarProdutos() {
    const containerLista = document.getElementById('listaProdutos');
    if (!containerLista) return;
    containerLista.innerHTML = "";

    if (produtos.length === 0) {
        containerLista.innerHTML = "<p>Nenhum equipamento em estoque.</p>";
        return;
    }

    produtos.forEach(p => {
        containerLista.innerHTML += `
            <div class="item-lista">
                <p><strong>Equipamento:</strong> ${p.nome}</p>
                <p><strong>Em Estoque:</strong> ${p.quantidade} un.</p>
                <div class="btn-acoes">
                    <button class="btn-comprar" onclick="comprarEstoque('${p.id}')">Comprar (+)</button>
                    <button class="btn-vender" onclick="venderEstoque('${p.id}')">Vender (-)</button>
                </div>
            </div>`;
    });
}
