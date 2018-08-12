class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados() {
        for (let i in this) {
            if (this[i] === '' || this[i] === null || this[i] === undefined) {
                return true
            }
        }
        return false
    }
}
class Bd {
    constructor() {
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoID() {
        let id = localStorage.getItem('id')
        return parseInt(id) + 1
    }
    gravar(d) {
        let id = this.getProximoID()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros() {
        let despesas = Array()
        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))
            if (despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisardespesas(despesa) {
        let despesasfiltradas = Array()
        despesasfiltradas = this.recuperarTodosRegistros()
        if (despesa.ano != '') {
            despesasfiltradas = despesasfiltradas.filter(d => d.ano == despesa.ano)
        }
        if (despesa.mes != '') {
            despesasfiltradas = despesasfiltradas.filter(d => d.mes == despesa.mes)
        }
        if (despesa.dia != '') {
            despesasfiltradas = despesasfiltradas.filter(d => d.dia == despesa.dia)
        }
        if (despesa.tipo != '') {
            despesasfiltradas = despesasfiltradas.filter(d => d.tipo == despesa.tipo)
        }
        if (despesa.descricao != '') {
            despesasfiltradas = despesasfiltradas.filter(d => d.descricao == despesa.descricao)
        }
        if (despesa.valor != '') {
            despesasfiltradas = despesasfiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasfiltradas

    }
    remover(id) {
        localStorage.removeItem(id)
    }
}
bd = new Bd()

function cadastraDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )
    let textoCaixa = document.getElementById('Cabecalho_modal')
    let avisoModal = document.getElementById('conteudoModal')
    let botao = document.getElementById('btModal')
    if (despesa.validarDados()) {
        textoCaixa.className = 'text-danger'
        textoCaixa.innerHTML = 'Erro ao cadastrar'
        avisoModal.innerHTML = 'Dados incompletos'
        botao.className = 'btn btn-danger'
        botao.innerHTML = 'Voltar e Corrigir'


        $('#Modalregistradespesa').modal('show')

    } else {
        textoCaixa.className = 'text-success'
        textoCaixa.innerHTML = 'Cadastro Realizado'
        avisoModal.innerHTML = 'Despesa inserida com sucesso'
        botao.className = 'btn btn-success'
        botao.innerHTML = 'OK'
        document.getElementById('ano').value = ""
        document.getElementById('mes').value = ""
        document.getElementById('dia').value = ""
        document.getElementById('descricao').value = ""
        document.getElementById('valor').value = ""
        document.getElementById('tipo').value = ""

        $('#Modalregistradespesa').modal('show')
        bd.gravar(despesa)
    }
}

function carregarListaDespesas() {
    let despesas = Array()
    despesas = bd.recuperarTodosRegistros()
    let listaDespesas = document.getElementById('listaDespesas')

    despesas.forEach(function (d) {
        let linha = listaDespesas.insertRow()
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        switch (parseInt(d.tipo)) {
            case 1: d.tipo = 'Alimentação'
                break
            case 2: d.tipo = 'Educação'
                break
            case 3: d.tipo = 'Lazer'
                break
            case 4: d.tipo = 'Saúde'
                break
            case 5: d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i> '
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function () {
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
        }

        linha.insertCell(4).append(btn)

    })

    return despesas

}
function pesquisa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('ano').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    let filtrado = Array()

    filtrado = bd.pesquisardespesas(despesa)
    printFiltro(filtrado)
}


function printFiltro(despesas = Array()) {
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
    if (despesas.length == 0) {
        $('#modal_consuta').modal('show')
    } else {
        despesas.forEach(function (d) {
            let linha = listaDespesas.insertRow()
            linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
            switch (parseInt(d.tipo)) {
                case 1: d.tipo = 'Alimentação'
                    break
                case 2: d.tipo = 'Educação'
                    break
                case 3: d.tipo = 'Lazer'
                    break
                case 4: d.tipo = 'Saúde'
                    break
                case 5: d.tipo = 'Transporte'
                    break
            }
            linha.insertCell(1).innerHTML = d.tipo

            linha.insertCell(2).innerHTML = d.descricao
            linha.insertCell(3).innerHTML = d.valor
            let btn = document.createElement('button')
            btn.className = 'btn btn-danger'
            btn.innerHTML = '<i class="fas fa-times"></i> '
            btn.id = `id_despesa_${d.id}`
            btn.onclick = function () {
                let id = this.id.replace('id_despesa_', '')
                bd.remover(id)
                window.location.reload()
            }
            linha.insertCell(4).append(btn)
        })
    }

}
function listardespesas() {
    despesas = Array()
    despesas = bd.recuperarTodosRegistros()
    console.log(despesas)

    let v1 = 0;
    let v2 = 0;
    let v3 = 0;
    let v4 = 0;
    let v5 = 0;

    despesas.forEach(d => {
        d.valor.replace(',', '.')
        d.valor = parseFloat(d.valor)
        d.tipo = parseInt(d.tipo)
        switch (d.tipo) {
            case 1:
                v1 += d.valor
                break
            case 2:
                v2 += d.valor
                break
            case 3:
                v3 += d.valor
                break
            case 4:
                v4 += d.valor
                break
            case 5:
                v5 += d.valor
                break
        }
    });

    let tabela = document.getElementById('tabelaDespesas')

    let linha = tabela.insertRow()
    linha.insertCell(0).innerHTML = 'Alimentação'
    linha.insertCell(1).innerHTML = `R$ ${v1}`
    linha = tabela.insertRow()
    linha.insertCell(0).innerHTML = 'Educação'
    linha.insertCell(1).innerHTML = `R$ ${v2}`
        linha = tabela.insertRow()
    linha.insertCell(0).innerHTML ='Lazer'
    linha.insertCell(1).innerHTML = `R$ ${v3}`
    
    linha = tabela.insertRow()
    linha.insertCell(0).innerHTML ='Saúde'
    linha.insertCell(1).innerHTML = `R$ ${v4}`
    
    linha = tabela.insertRow()
    linha.insertCell(0).innerHTML ='Transporte'
    linha.insertCell(1).innerHTML = `R$ ${v5}`
    
}