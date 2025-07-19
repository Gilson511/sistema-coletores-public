async function fetchDados() {
  const [base, uso] = await Promise.all([
    fetch("https://sistema-coletores-backend-4.onrender.com/api/basecoletores").then(r => r.json()),
    fetch("https://sistema-coletores-backend-4.onrender.com/api/coletores").then(r => r.json())
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

  // Destrói gráfico anterior se existir
  if (window[canvasId] instanceof Chart) {
    window[canvasId].destroy();
  }

  const paleta = cores || [
    "#4E79A7", "#F28E2B", "#E15759", "#76B7B2", "#59A14F", "#EDC948", "#B07AA1", "#FF9DA7"
  ];

  window[canvasId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: titulo,
        data: dados,
        backgroundColor: paleta,
        borderRadius: 10, // cantos arredondados
        borderSkipped: false, // remove cortes nas barras
        barThickness: 40
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false // remove legenda repetitiva
        },
        title: {
          display: true,
          text: titulo,
          color: "#ffffff",
          font: {
            size: 18,
            weight: "bold",
            family: "'Segoe UI', sans-serif"
          },
          padding: { top: 10, bottom: 20 }
        },
        tooltip: {
          backgroundColor: "#333",
          titleFont: { weight: 'bold' },
          bodyFont: { family: "'Segoe UI', sans-serif" },
          borderColor: "#888",
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#ffffff",
            font: { size: 12 }
          },
          grid: {
            color: "rgba(255,255,255,0.1)"
          }
        },
        y: {
          ticks: {
            color: "#ffffff",
            font: { size: 12 }
          },
          grid: {
            color: "rgba(255,255,255,0.1)"
          },
          beginAtZero: true
        }
      }
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
