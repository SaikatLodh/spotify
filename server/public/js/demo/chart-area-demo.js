function Subscription() {
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const values = () => {
    if (!subscriptions) return new Array(12).fill(0);

    const monthValues = new Array(12).fill(0);

    subscriptions.forEach((item) => {
      const monthIndex = item._id.month - 1;
      monthValues[monthIndex] = item.totalEarnings + monthValues[monthIndex];
    });

    return monthValues;
  };

  var ctx = document.getElementById("myAreaChart");
  var myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Courses Created",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: values(),
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: { left: 10, right: 25, top: 25, bottom: 0 },
      },
      scales: {
        xAxes: [
          {
            gridLines: { display: false, drawBorder: false },
            ticks: { maxTicksLimit: 7 },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value) {
                return value; // just show numbers, remove $
              },
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2],
            },
          },
        ],
      },
      legend: { display: false },
    },
  });
}

Subscription();
