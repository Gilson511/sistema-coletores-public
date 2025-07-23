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

function gerarGrafico(id, tipo, labels, dados, titulo, cores = null) {
  const ctx = document.getElementById(id).getContext("2d");

  // Definindo as cores: vermelho (#D5001C) e laranja (#FF8C00)
  const paleta = cores || ["#D5001C", "#ff8c00da"];

  new Chart(ctx, {
    type: tipo,
    data: {
      labels: labels,
      datasets: [{
        label: titulo,
        data: dados,
        backgroundColor: paleta,
        borderColor: "#ffffff",
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#333",
            font: {
              size: 14,
              weight: "bold",
            },
          },
        },
        title: {
          display: true,
          text: titulo,
          color: "#000",
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
    },
  });
}


async function gerarGraficosFiltrados() {
  const filtroDias = document.getElementById("filtroData").value;
  const dias = filtroDias === "todos" ? "todos" : parseInt(filtroDias);
  const { base, uso } = await fetchDados();

  const totalUso = uso.length;
  const totalArmazem = base.length - totalUso;

  // Muda de "doughnut" para "pie"
  gerarGrafico("graficoStatus", "pie", ["Em uso", "Armazenado"], [totalUso, totalArmazem], "Status dos Coletores");

  const retiradas = agruparPorData(uso, "hora_pegou", dias);
  gerarGrafico("graficoLinhaData", "pie", Object.keys(retiradas), Object.values(retiradas), "Retiradas por Data");

  const devolucoes = agruparPorData(uso, "hora_baixa", dias);
  gerarGrafico("graficoBaixas", "pie", Object.keys(devolucoes), Object.values(devolucoes), "Devoluções por Data");
}

window.addEventListener("DOMContentLoaded", gerarGraficosFiltrados);
