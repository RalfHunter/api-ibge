import './style.css'

const cep = document.querySelector<HTMLInputElement>('#cep')!
const logradouro = document.querySelector<HTMLInputElement>('#logradouro')!
const numero = document.querySelector<HTMLInputElement>('#numero')!
const bairro = document.querySelector<HTMLInputElement>('#bairro')!
const cidade = document.querySelector<HTMLInputElement>('#cidade')!
const estado = document.querySelector<HTMLInputElement>('#estado')!
let estado_opcoes:any;
let estadoValues:number = 0


cep.addEventListener('blur',async() => {
  consultarCep()

})

function limparFormulario () {
 logradouro.value = ''
 numero.value = ''
 cidade.value = ''
 estado.value = ''
}


async function obterEstados (){
  const estado = await fetch(`https://brasilapi.com.br/api/ibge/uf/v1`)
  const result = await estado.json()
  return result
}
async function listarEstados(estados:JSON[]) {
  for( const item of estados) {
    const novo_estado = document.createElement('option')
    estadoValues += 1
    novo_estado.value = estadoValues.toString()
    novo_estado.textContent = item.nome
    estado.appendChild(novo_estado)
    estado_opcoes.push(novo_estado)
  }
}


limparFormulario()

async function consultarCep() {
  const result = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep.value}`)
  const body = await result.json()
  numero.focus()
  logradouro.value = body.street
  bairro.value = body.neighborhood
  cidade.value = body.city

}

const estados = await obterEstados()
await listarEstados(estados)