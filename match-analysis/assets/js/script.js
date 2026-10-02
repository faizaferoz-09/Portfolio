$(document).ready(function () {

  if (typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
  }

  /* ─────────────────────────────────────────────────────
     Match Data
  ───────────────────────────────────────────────────── */
  const matchData = [
    { over: 1,  runs: 7,  wickets: 0, wicketBall: null  },
    { over: 2,  runs: 10, wickets: 0, wicketBall: null  },
    { over: 3,  runs: 8,  wickets: 1, wicketBall: "3.4" },
    { over: 4,  runs: 12, wickets: 0, wicketBall: null  },
    { over: 5,  runs: 6,  wickets: 1, wicketBall: "5.2" },
    { over: 6,  runs: 11, wickets: 0, wicketBall: null  },
    { over: 7,  runs: 14, wickets: 0, wicketBall: null  },
    { over: 8,  runs: 5,  wickets: 1, wicketBall: "8.5" },
    { over: 9,  runs: 9,  wickets: 0, wicketBall: null  },
    { over: 10, runs: 10, wickets: 0, wicketBall: null  }
  ];

  /* ── Calculations ── */
  let totalRuns = 0;
  let totalWickets = 0;
  let highestOver = matchData[0];

  const cumulative = matchData.map(d => {
    totalRuns += d.runs;
    totalWickets += d.wickets;
    if (d.runs > highestOver.runs) highestOver = d;
    return totalRuns;
  });

  const totalOvers = matchData.length;
  const runRate = (totalRuns / totalOvers).toFixed(2);

  // Set Chips Data
  $('#chipScore').text(`${totalRuns} / ${totalWickets}`);
  $('#chipOvers').text(`${totalOvers}.0`);
  $('#chipRunRate').text(runRate);
  $('#chipHighestOver').text(`Over ${highestOver.over} (${highestOver.runs} Runs)`);

  /* ── Image Marker Loading ── */
  function stripWhite(img, threshold = 230) {
    const oc   = document.createElement('canvas');
    oc.width   = img.naturalWidth || 100;
    oc.height  = img.naturalHeight || 100;
    const oc2d = oc.getContext('2d');
    oc2d.drawImage(img, 0, 0);

    const pxData = oc2d.getImageData(0, 0, oc.width, oc.height);
    const px = pxData.data;
    for (let i = 0; i < px.length; i += 4) {
      if (px[i] > threshold && px[i+1] > threshold && px[i+2] > threshold) {
        px[i+3] = 0;
      }
    }
    oc2d.putImageData(pxData, 0, 0);
    return oc;
  }

  const batRaw  = new Image();
  const ballRaw = new Image();
  batRaw.crossOrigin  = 'anonymous';
  ballRaw.crossOrigin = 'anonymous';
  batRaw.src  = 'assets/img/bat.png';
  ballRaw.src = 'assets/img/ball.png';

  let batClean  = null;
  let ballClean = null;

  /* ── Custom Marker Plugin ── */
  const imageMarkers = {
    id: 'imageMarkers',
    afterDatasetsDraw(chart) {
      const c    = chart.ctx;
      const meta = chart.getDatasetMeta(0);

      meta.data.forEach((point, i) => {
        const d        = matchData[i];
        const isWicket = d.wickets > 0;
        const cleanImg = isWicket ? ballClean : batClean;
        if (!cleanImg) return;

        const size = isWicket ? 30 : 24;
        const x    = point.x - size / 2;
        const y    = point.y - size - 12;

        c.save();
        c.drawImage(cleanImg, x, y, size, size);
        c.restore();
      });
    }
  };

  /* ── Canvas Initialization ── */
  const ctx = $('#mainCricketChart')[0].getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0,   'rgba(0, 230, 118, 0.35)');
  gradient.addColorStop(0.7, 'rgba(0, 230, 118, 0.05)');
  gradient.addColorStop(1,   'rgba(0, 230, 118, 0.0)');

  let currentMode = 'cumulative'; // 'cumulative' or 'perOver'

  const mainChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: matchData.map(d => `Over ${d.over}`),
      datasets: [{
        label: 'Cumulative Score',
        data: cumulative,
        borderColor: '#00e676',
        borderWidth: 2.5,
        backgroundColor: gradient,
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: matchData.map(d => d.wickets > 0 ? '#f87171' : '#00e676'),
        pointBorderColor: '#111c28',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 50, right: 16, bottom: 6, left: 6 } },
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: 'end',
          align: 'top',
          offset: 2,
          color: ctx => matchData[ctx.dataIndex].wickets > 0 ? '#f87171' : 'rgba(255,255,255,0.7)',
          font: { size: 11, weight: '700', family: 'Inter' },
          formatter: val => val
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#00e676',
          titleFont: { size: 12, weight: '700' },
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(0, 230, 118, 0.2)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: items => `Over ${matchData[items[0].dataIndex].over}`,
            label: items => {
              const d = matchData[items.dataIndex];
              return [
                `Runs this over: ${d.runs}`,
                `Total Score   : ${cumulative[items.dataIndex]}`
              ];
            },
            footer: items => {
              const d = matchData[items[0].dataIndex];
              return d.wickets > 0 ? `Wicket Fallen (Ball ${d.wicketBall})` : '';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#64748b', font: { size: 11 } }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#64748b', font: { size: 11 } }
        }
      }
    },
    plugins: [imageMarkers]
  });

  /* ── Interactive Mode Toggle Buttons ── */
  $('#btnCumulative').on('click', function() {
    $('.toggle-btn').removeClass('active');
    $(this).addClass('active');
    currentMode = 'cumulative';
    mainChart.data.datasets[0].label = 'Cumulative Score';
    mainChart.data.datasets[0].data = cumulative;
    mainChart.options.scales.y.suggestedMax = totalRuns + 15;
    mainChart.update();
  });

  $('#btnPerOver').on('click', function() {
    $('.toggle-btn').removeClass('active');
    $(this).addClass('active');
    currentMode = 'perOver';
    mainChart.data.datasets[0].label = 'Runs Per Over';
    mainChart.data.datasets[0].data = matchData.map(d => d.runs);
    mainChart.options.scales.y.suggestedMax = undefined;
    mainChart.update();
  });

  /* ── Image Load Triggers ── */
  batRaw.onload = () => {
    batClean = stripWhite(batRaw);
    mainChart.update();
  };
  ballRaw.onload = () => {
    ballClean = stripWhite(ballRaw);
    mainChart.update();
  };

});