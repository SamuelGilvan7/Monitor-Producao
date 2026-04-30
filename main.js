// Seleção de Elementos
const btnRegistrar = document.getElementById('btnRegistrar');
const btnVerificar = document.getElementById('btnVerificarMaquinas');
const listaProducao = document.getElementById('listaProducao');
const somaTotalTxt = document.getElementById('somaTotal');
const totalAlertasTxt = document.getElementById('totalAlertas');
const resultadoMaquinas = document.getElementById('resultadoMaquinas');

// Estado da Aplicação (Dados salvos no navegador)
let producoes = JSON.parse(localStorage.getItem('producao_db')) || [];

// Inicialização ao abrir a página
renderizar();

// --- FUNÇÃO 1: REGISTRAR PRODUÇÃO ---
btnRegistrar.onclick = () => {
  const produto = document.getElementById('produto').value;
  const qtd = Number(document.getElementById('qtd').value);
  const meta = Number(document.getElementById('meta').value);

  if (!produto || qtd <= 0 || meta <= 0) {
    alert("Preencha todos os campos com valores válidos!");
    return;
  }

  // Cria o objeto e adiciona ao array
  const novaProducao = { produto, qtd, meta, velocidade: 0, id: Date.now() };
  producoes.push(novaProducao);
  
  salvarERenderizar();
  limparCampos();
};

// --- FUNÇÃO 2: RENDERIZAÇÃO (O Coração do Dashboard) ---
function renderizar() {
  if (!listaProducao) return;
  
  // Limpando os containers
  listaProducao.innerHTML = '';
  resultadoMaquinas.innerHTML = '';
  
  let somaTotal = 0;
  let alertas = 0;

  producoes.forEach((item, index) => {
    // 1. Cálculos de Produção
    somaTotal += item.qtd;
    const atingiuMeta = item.qtd >= item.meta;
    const porcentagem = Math.min((item.qtd / item.meta) * 100, 100);
    
    // 2. Cálculos de Status da Máquina
    const v = item.velocidade || 0;
    const emAlerta = v > 100;
    if (emAlerta) alertas++;

    // 3. Alimenta a Tabela de Histórico
    listaProducao.innerHTML += `
      <tr>
        <td><strong>M-0${index + 1}</strong> - ${item.produto}</td>
        <td>
          ${item.qtd} / ${item.meta}
          <div class="progress-bar-custom" style="height: 6px; background: #e2e8f0; border-radius: 3px; margin-top: 5px;">
            <div class="progress-fill ${atingiuMeta ? 'bg-success' : 'bg-danger'}" style="width: ${porcentagem}%; height: 100%;"></div>
          </div>
        </td>
        <td>
          <span class="badge ${atingiuMeta ? 'bg-success' : 'bg-danger'}">
            ${atingiuMeta ? 'Meta Atingida' : 'Abaixo da Meta'}
          </span>
        </td>
      </tr>
    `;

    // 4. Alimenta o Card de Status das Máquinas (Fora do histórico!)
    resultadoMaquinas.innerHTML += `
      <div class="list-group-item d-flex justify-content-between align-items-center mb-2 shadow-sm border-0" style="background: #f8fafc; border-radius: 10px;">
        <div>
          <small class="text-primary fw-bold">M-0${index + 1}</small><br>
          <span class="fw-bold" style="font-size: 0.9rem;">${item.produto}</span>
        </div>
        <div class="text-end">
          <span class="badge ${emAlerta ? 'bg-danger' : 'bg-success'} mb-1">
            ${v} km/h ${emAlerta ? '⚠️' : '✅'}
          </span><br>
          <button onclick="editarVelocidade(${index})" class="btn btn-sm btn-light border" style="font-size: 0.7rem;">
            ⚙️ AJUSTAR
          </button>
        </div>
      </div>
    `;
  });

  // Atualiza os números nos Cards de cima
  somaTotalTxt.innerText = somaTotal;
  totalAlertasTxt.innerText = alertas;
}

// --- FUNÇÃO 3: AJUSTE INDIVIDUAL ---
window.editarVelocidade = (index) => {
  const novaV = parseFloat(prompt(`[M-0${index + 1}] Ajustar velocidade de: ${producoes[index].produto}`));
  
  if (!isNaN(novaV)) {
    producoes[index].velocidade = novaV;
    salvarERenderizar();
  }
};

// --- FUNÇÃO 4: DIAGNÓSTICO GERAL (O botão que pergunta tudo) ---
btnVerificar.onclick = () => {
  if (producoes.length === 0) {
    alert("Registre máquinas para iniciar o diagnóstico!");
    return;
  }

  producoes.forEach((item, index) => {
    let v = parseFloat(prompt(`[DIAGNÓSTICO GERAL]\nMáquina 0${index + 1} (${item.produto})\nVelocidade atual:`));
    if (!isNaN(v)) item.velocidade = v;
  });

  salvarERenderizar();
};

// Auxiliares
function salvarERenderizar() {
  localStorage.setItem('producao_db', JSON.stringify(producoes));
  renderizar();
}

function limparCampos() {
  document.getElementById('produto').value = '';
  document.getElementById('qtd').value = '';
  document.getElementById('meta').value = '';
}