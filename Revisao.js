class Pessoa {
    constructor(nome, idade){
        this.idade = idade
        this.nome = nome
    }
    apresentar() {
        console.log(`Olá! meu nome é: ${this.nome} e tenho ${this.idade} anos`)
    }
}

const pessoa1 = new Pessoa('cleison', 24)
pessoa1.apresentar()

class Produto {
    constructor(nome, preco) {
        this.nome = nome
        this.preco = preco
    }

    mostrarPreco() {
        console.log(`Salve, sou o ${this.nome} e tenho o custo de ${this.preco} por unidade`)
    }
}

const produto1 = new Produto('prego', 1.99) 
produto1.mostrarPreco()

class Funcionario{
    constructor(nome){
        this.nome = nome
    }
}
class Gerente extends Funcionario{
    constructor(nome, setor){
        super(nome, setor)
        this.setor = setor
        this.nome = nome
    }
    exibir() {
        console.log(`Olá! O setor ${this.setor} tem o ${this.nome} como gerente`)
    }
}

const teste1 = new Gerente('Geraldo', 'policial')
teste1.exibir()

class Veiculo {
    constructor(marca) {
        this.marca = marca;
    }
}
class Carro extends Veiculo {
    constructor(modelo, marca) {
        super(marca); 
        this.modelo = modelo;
    }

    exibir() {
        console.log(`Olá, o carro é o ${this.modelo} e é da marca ${this.marca}`);
    }
}

const carro1 = new Carro('Dodge Viper R/T', 'Dodge');
carro1.exibir();

class Conta {
    #saldo
    constructor(saldo) {
        this.saldo = saldo
    }
    depositar(valor){
        if(valor < 0){
            console.log(`Valor inválido!`)
        } else {
            this.saldo += valor
        }
        console.log(`Saldo atual: ${this.saldo}`)
    }
    mostrarSaldo(){
        console.log(`Saldo atual: ${this.saldo}`)
    }
    sacar(valor1){
        if(valor1 > this.saldo & valor1 > this.saldo) {
            console.log(`Saldo insuficiente!`)
        } else {
            this.saldo -= valor1
        }
        console.log(`Saldo atual: ${this.saldo}`)
    }
}

const conta1 = new Conta(100)
conta1.mostrarSaldo()
conta1.depositar(50)
conta1.mostrarSaldo()
conta1.sacar(25)
conta1.depositar(-50)
conta1.depositar(10)
conta1.sacar(200)
conta1.sacar(120)

class Aluno {
    #nota
    constructor(nota) {
        this.#nota = nota
    }
    definirNota(nota1) {
        if(nota1 < 0) {
            console.log(`Nota inválida!`)
        } else {
            this.#nota += nota1
        }
        console.log(`Nota: ${this.#nota}`)
    }
    mostrarNota() {
        console.log(`Nota: ${this.#nota}`)
    }
}

const aluno1 = new Aluno(0)
const Nickao = new Aluno(0)
aluno1.definirNota(10)
aluno1.mostrarNota()
Nickao.definirNota(-7)
