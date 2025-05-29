import './style.css'
import ddds from './ddds.json'
const cep = document.querySelector<HTMLInputElement>('#cep')!
const logradouro = document.querySelector<HTMLInputElement>('#logradouro')!
const numero = document.querySelector<HTMLInputElement>('#numero')!
const bairro = document.querySelector<HTMLInputElement>('#bairro')!
const cidade = document.querySelector<HTMLInputElement>('#cidade')!
const estado = document.querySelector<HTMLInputElement>('#estado')!


let estado_opcoes: any[] = [];



cep.addEventListener('blur', async () => {
  await consultarCep()

})
estado.addEventListener('change', async () => {
  let lista_cidades: string[] = []
  cidade.disabled = true
  cidade.innerHTML ='<option value="" selected>Procurando por cidades...</option>'
  const estado_ddds = ddds[estado.value as keyof typeof ddds]
  for (const estado_ddd of estado_ddds) {
    const ddd = estado_ddd.toString()
    const result = await fetch(`https://brasilapi.com.br/api/ddd/v1/${ddd}`)
    const cidade = await result.json()
    lista_cidades.push(...cidade.cities)
  }
  cidade.disabled = false
  cidade.innerHTML = '<option value="" selected>Selecione uma cidade</option>'
  for (const item of lista_cidades) {
    const nova_cidade = document.createElement('option')
    nova_cidade.textContent = await normalizarCase(item)
    cidade.appendChild(nova_cidade)
  }

})

function limparFormulario() {
  logradouro.value = ''
  numero.value = ''
  cidade.value = ''
}

interface dadoAPI {
  nome: string,
  sigla: string,
}

async function obterEstados() {
  const estado = await fetch(`https://brasilapi.com.br/api/ibge/uf/v1`)
  const result = await estado.json()
  return result
}

async function listarCidades(cidades: string[], cidade_create: any = null) {
  if (!cidade_create) {
    cidade.innerHTML = '<option value="" selected>Selecione uma cidade</option>'
    for (const item of cidades) {
      const nova_cidade = document.createElement('option')
      nova_cidade.textContent = item
      cidade.appendChild(nova_cidade)
    }
    
  } else {
    if (cidades.length === 0) {
      let lista_cidades: string[] = []
      const estado_ddds = ddds[estado.value as keyof typeof ddds]
      for (const estado_ddd of estado_ddds) {
        const ddd = estado_ddd.toString()
        const result = await fetch(`https://brasilapi.com.br/api/ddd/v1/${ddd}`)
        const cidade = await result.json()
        lista_cidades.push(...cidade.cities)
      }
      for (const item of lista_cidades) {
        if (item != cidade_create.textContent) {
          const nova_cidade = document.createElement('option')
          nova_cidade.textContent = await normalizarCase(item)
          cidade.appendChild(nova_cidade)
        }
        else {
          continue
        }
      }
    }
  }
}

async function listarEstados(estados: dadoAPI[]) {
  for (const item of estados) {
    const novo_estado = document.createElement('option')
    novo_estado.textContent = item.nome
    novo_estado.value = item.sigla
    estado.appendChild(novo_estado)
    estado_opcoes.push(novo_estado)
  }
}

limparFormulario()

async function consultarCep() {
  cidade.innerHTML = '<option value="" selected>Selecione uma cidade</option>'
  const result = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep.value}`)
  const body = await result.json()
  numero.focus()
  logradouro.value = body.street
  bairro.value = body.neighborhood
  // cidade.value = body.city
  // console.log(body.state)
  for (let i: number = 0; i < estado.children.length; i++) {
    if (estado.children[i].getAttribute('value') == body.state) {
      estado.children[i].setAttribute('selected', 'selected')
      const nova_cidade = document.createElement('option')
      nova_cidade.textContent = body.city
      nova_cidade.setAttribute('selected', 'selected')
      cidade.appendChild(nova_cidade)
      await listarCidades([], nova_cidade)
      // console.log(estado.children[i].textContent)
      const select = document.querySelector<HTMLSelectElement>('#estado')!
      select.selectedIndex = i
      cidade.disabled = false
    }
    else {
      estado.children[i].removeAttribute('selected')
    }
  }

}

async function normalizarCase(texto: string) {
  return texto
    .toLowerCase()                       // tudo minúsculo
    .split(' ')                          // separa por espaço
    .map(palavra =>
      palavra.charAt(0).toUpperCase() + palavra.slice(1)
    )
    .join(' ');
}
var estados = await obterEstados()
await listarEstados(estados)
