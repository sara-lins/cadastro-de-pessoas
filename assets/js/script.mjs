
/* 
ok - Criar uma classe Pessoa
ok - receberá as mesmas propriedades que o usuário deve preencher no formulário
ok - criar um novo usuário utilizando a classe Pessoa
ok - adicioná-lo na lista ao lado
ok - Criar um método na classe que filtre os usuários pelo tipo de cargo
ok - Caso o filtro seja todos, deverá renderizar todos os usuários.
ok - Não deixar que cadastre-se um novo usuário com um email já existente na lista (Exibir modal com mensagem de erro)
Não deixar que menores de 18 anos se cadastrem (Exibir modal com mensagem de erro).
*/

function exibirModal(valor) {
    const div = document.createElement("div");
    const divModal = document.createElement("div");
    const titulo = document.createElement("h1");
    const mensagem = document.createElement("p");
    const btnFechar = document.createElement("button");

    div.className = "modal";
    div.style.display = "flex";
    divModal.className = "msgModal";
    btnFechar.innerText = "Fechar"
    btnFechar.className = "bnt";
    titulo.innerText = "Aviso";
    mensagem.innerText = valor;

    div.appendChild(divModal)
    divModal.append(titulo,mensagem,btnFechar)

    return div;
}

const body = document.querySelector("body");
const bodyFilhos = body.children

function fecharModal() {
    const modal = document.querySelector(".modal");
    modal.addEventListener("click", (e) => {
        if(e.target.className == "bnt") {
            bodyFilhos[bodyFilhos.length-1].remove()
        }
    })  
}

function listarUsuario(usuario) {
    //função callback para listar os usuários
    const li = document.createElement("li");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    const p3 = document.createElement("p");

    p1.innerText = `${usuario.name} ${usuario.sobrenome}`;
    p2.innerText = usuario.email;
    p3.innerText = usuario.cargo;

    li.append(p1,p2,p3);
    return li;

}

class Pessoa {
    constructor(name,sobrenome,dataDeNascimento,email,contato,telefone,cargo) {
        this._name             = name;
        this._sobrenome        = sobrenome;
        this._dataDeNascimento = dataDeNascimento;
        this._email            = email;
        this._contato          = contato;
        this._telefone         = telefone;
        this._cargo            = cargo;
    }

    static bancoDePessoas = [];

    static adicionarPessoa(object) {

        const totalCadastrados = document.querySelector("#total-alunos");

        if(object.name != "" && object.sobrenome != "" && object.dataDeNascimento != "" && object.email != "" && object.telefone != "" && object.cargo != "") {
            
            const arrayIdade = object.dataDeNascimento.split("-");

            const dataAtual       = new Date();
            const diaAtual        = dataAtual.getDate();
            const anoAtual        = dataAtual.getFullYear();
            const mesAtual        = dataAtual.getMonth()+1;
            const anoMaiorDeIdade = anoAtual - 18;

            if(anoMaiorDeIdade >= arrayIdade[2] || mesAtual >= arrayIdade[1]) {

                if(diaAtual >= arrayIdade[0]) {

                    const value = Pessoa.bancoDePessoas.some(elem => elem.email == object.email)
                    
                    if(value == false) {
                        Pessoa.bancoDePessoas.push(object);
                        totalCadastrados.innerText = `${Pessoa.bancoDePessoas.length}`;
                        body.appendChild(exibirModal(`Usuário ${object.name} adicionado(a) com sucesso`));
                        fecharModal()
                    } else {
                        body.appendChild(exibirModal("Email já cadastrado!"));
                        fecharModal()
                    }

                } else {
                    body.appendChild(exibirModal("Não é possível cadastrar menores de 18 anos!"));
                    fecharModal()
                }

            } else {
                body.appendChild(exibirModal("Não é possível cadastrar menores de 18 anos!"));
                fecharModal()
            }

        } else {
            body.appendChild(exibirModal("Por favor, preencha todos os campos obrigatórios"));
            fecharModal()
        }
    }

    static filtrarCargo(value) {
        const ul = document.querySelector("#lista-de-alunos");
        if(value == "Todos") {
            ul.innerText = "";
            Pessoa.bancoDePessoas.forEach(elem => ul.appendChild(listarUsuario(elem)))
        }else if(value == "Aluno") {
            ul.innerText = "";
            const alunos = Pessoa.bancoDePessoas.filter(elem => elem.cargo == "Aluno")
            alunos.forEach(elem => ul.appendChild(listarUsuario(elem)))
        }else if(value == "Facilitador") {
            ul.innerText = "";
            const alunos = Pessoa.bancoDePessoas.filter(elem => elem.cargo == "Facilitador")
            alunos.forEach(elem => ul.appendChild(listarUsuario(elem)))
        }else if(value == "Instrutor") {
            ul.innerText = "";
            const alunos = Pessoa.bancoDePessoas.filter(elem => elem.cargo == "Instrutor")
            alunos.forEach(elem => ul.appendChild(listarUsuario(elem)))
        }
    }

}

function cadastroUsuario() {
    const form = document.querySelector("form");
    form.addEventListener("click", (e) => {
    
        let name             = "";
        let sobrenome        = "";
        let dataDeNascimento = "";
        let email            = "";
        let contato          = "";
        let telefone         = "";
        let cargo            = "";
    
        if(e.target.id == "register-button") {
    
            e.preventDefault();
    
            const inputNome = document.querySelector("#nome");
            name = inputNome.value
    
            const inputSobrenome = document.querySelector("#sobrenome");
            sobrenome = inputSobrenome.value
    
            const inputDate = document.querySelector("#date");
            dataDeNascimento = inputDate.value.split("-").reverse().join("-");
    
            const inputEmail = document.querySelector("#email");
            email = inputEmail.value
    
            const inputContato = document.querySelector("#contato");
            contato = inputContato.value
    
            const inputTelefone = document.querySelector("#telefone");
            telefone = inputTelefone.value
    
            const inputCargo = document.querySelector("#cargo");
            cargo = inputCargo.value
         
            //criando objeto pessoa para o BD
            const novaPessoa = {
                name,
                sobrenome,
                dataDeNascimento,
                email,
                contato,
                telefone,
                cargo,
            }
    
            //mandando objeto pro BD
            Pessoa.adicionarPessoa(novaPessoa)
            //append das li's
            Pessoa.filtrarCargo("Todos")
    
        }
    })
}
cadastroUsuario()

function exibirUsuarioPorCargo() {
    const cadastrados = document.querySelector("aside");
    cadastrados.addEventListener("click", (e) => {
    
        if(e.target.id == "btn") {
    
            e.preventDefault();
    
            const cargosOptions = document.querySelector("#cargoOption");
            const valor = cargosOptions.value;
            
            Pessoa.filtrarCargo(valor);
            
        }
    })
}
exibirUsuarioPorCargo()

