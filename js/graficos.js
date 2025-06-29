async function fetchDados() {
  const [base, uso] = await Promise.all([
    fetch("http://localhost:3000/api/basecoletores").then(r => r.json()),
    fetch("http://localhost:3000/api/coletores").then(r => r.json())
  ]);
  return { base, uso };
}

function agruparPorData(lista, campoData, dias = "todos") {
  const hoje = new Date();
  return lista.reduce((acc, item) => {
    const data = new Date(item[campoData]);
    if (!isNaN(data)) {
      const diffDias = (hoje - data) / (1000 * 60 * 60 * 24);
      if (dias === "todos" || diffDias <= dias) {
        const dia = data.toISOString().split("T")[0];
        acc[dia] = (acc[dia] || 0) + 1;
      }
    }
    return acc;
  }, {});
}
function gerarGrafico(canvasId, tipo, labels, dados, titulo, cores = null) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  // Verifica se já existe um gráfico anterior e destrói corretamente
  if (window[canvasId] instanceof Chart) {
    window[canvasId].destroy();
  }

  window[canvasId] = new Chart(ctx, {
    type: tipo,
    data: {
      labels: labels,
      datasets: [{
        label: titulo,
        data: dados,
        backgroundColor: cores || [
          "#f39c12", "#3498db", "#2ecc71", "#e74c3c", "#9b59b6"
        ],
        borderColor: "#fff",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: "white" }},
        title: {
          display: true,
          text: titulo,
          color: "white"
        }
      },
      scales: tipo === "bar" || tipo === "line" ? {
        x: { ticks: { color: "white" }},
        y: { ticks: { color: "white" }}
      } : {}
    }
  });
}

async function gerarGraficosFiltrados() {
  const filtroDias = document.getElementById("filtroData").value;
  const dias = filtroDias === "todos" ? "todos" : parseInt(filtroDias);
  const { base, uso } = await fetchDados();

  const totalUso = uso.length;
  const totalArmazem = base.length - totalUso;

  gerarGrafico("graficoStatus", "doughnut", ["Em uso", "Armazenado"], [totalUso, totalArmazem], "Status dos Coletores");

  const retiradas = agruparPorData(uso, "hora_pegou", dias);
  gerarGrafico("graficoLinhaData", "line", Object.keys(retiradas), Object.values(retiradas), "Retiradas por Data");

  const devolucoes = agruparPorData(uso, "hora_baixa", dias);
  gerarGrafico("graficoBaixas", "bar", Object.keys(devolucoes), Object.values(devolucoes), "Devoluções por Data");
}

window.addEventListener("DOMContentLoaded", gerarGraficosFiltrados);
