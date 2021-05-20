let myGraph;

const graph_data = {
  labels: [],
  datasets: [
    {
      label: "Temperature",
      data: [],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Humidity",
      data: [],
      borderColor: "rgb(54, 162, 235)",
      backgroundColor: "rgba(rgb(54, 162, 235), 0.5)",
    },
  ],
};
const config = {
  type: "line",
  data: graph_data,
  options: {
    response: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Temperature and Humidity",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 50,
      },
    },
  },
};

function getData() {
  fetch("/graph-data")
    .then((response) => response.json())
    .then((dht_data) => {
      myGraph.data.labels = [];
      for (let i = 0; i < dht_data.temps.length; i += 1) {
        myGraph.data.labels.push(i + 1);
      }
      myGraph.data.datasets[0].data = dht_data.temps;
      myGraph.data.datasets[1].data = dht_data.humis;

      const max = Math.max(...dht_data.temps.concat(dht_data.humis));

      if (max > 50) {
        myGraph.options.scales.y.max = max + 10;
      } else {
        myGraph.options.scales.y.max = 50;
      }
      console.log("update");
      myGraph.update();
    });
}

window.onload = function () {
  const ctx = document.getElementById("canvas").getContext("2d");
  myGraph = new Chart(ctx, config);

  getData();
  setInterval(getData, 3000);
};
