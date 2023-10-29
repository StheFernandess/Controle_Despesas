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
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
            //console.log(i, this[i]) 
            //i: retorna indice ou atributos de algum objeto não retorna valor
            //this[i] recupera o valor
        }

        return true
    }
}
class Bd {

    constructor() {
        let id = localStorage.getItem('id') 

        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        //getItem: recupera um dado dentro do localstorage
        let proximoId = localStorage.getItem('id')       
        return parseInt(proximoId) +1
    }

    gravar(d) {
        //  d é a despesa!

        let id = this.getProximoId() 
        //setItem: insere um item dentro do localstorage 
        //e o json intermedia 
        localStorage.setItem(id, JSON.stringify(d))
        

        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros() {

        //array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')

        //recupera todas as despesas no localstorage
        for(let i = 1; i <= id; i++) {
            
            //recupera a despesa
            let despesa = JSON.parse(localStorage.getItem(i))
            
            //se houver índices q foram removidos/pulados e pular esses índices
            if(despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa) {
        
        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesa)

        console.log(despesasFiltradas)

        //ano
        if(despesa.ano != '') {
            console.log('filtro de ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        //mes
        if(despesa.mes != '') {
            console.log('filtro de mes')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if(despesa.dia != '') {
            console.log('filtro de dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if(despesa.tipo != '') {
            console.log('filtro de tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao
        if(despesa.descricao != '') {
            console.log('filtro de descrição')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }


        return despesasFiltradas

    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {

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

    if (despesa.validarDados()) { 
        //dialogo com sucesso
        bd.gravar(despesa)
        alert('Registro salvo com sucesso!')
    } else {
        //dialogo de erro
        alert('Existem campos obrigatórios que não foram preenchidos')
    }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    //seleciona o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //percorrer o array despesas, listando cada despesa
    despesas.forEach(function(d) {

        //console.log(d)
        
        //criar linha (tr)
        let linha = listaDespesas.insertRow()

        //criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        
        // ajustar o tipo
        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
        
        //criar botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${ d.id}`
        btn.onclick = function() {
            //remover a despesa
            
            let id = this.id.replace('id_despesa_', '')

            //alert (id)

            bd.remover(id)

            window.location.reload()
        }
        linha.insertCell(4).append(btn)

        console.log(d)
    })
}

function limpaCampos() {
    var elements = document.getElementsByName("form_txt");
    elements.forEach(element => {
      console.log(element);
      element.value = '';
    })
  }

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas =  bd.pesquisar(despesa)

    carregaListaDespesas (despesas, true)
}




