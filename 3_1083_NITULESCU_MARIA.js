 // extrag datele din JSON si formez listele

 var request = new XMLHttpRequest();
 request.open("GET", "media/eurostat.json", false);
 request.send(null);

 // in lista data storez toate informatiile din json
 var data = JSON.parse(request.responseText);
 
 var keys = [];
 for (var i = 0; i < data.length; i++) {
     for (var elem in data[i]) {
         if (keys.indexOf(elem) === -1) {
             keys.push(elem);
         }
     }
 }

 tari = []
 ani = []
 indicatori = []
 sv = [], pop = [], pib =[]


 for (var i = 0; i < data.length; i++) {
     for (var j = 0; j < keys.length; j++) {
         if(j==0) tari.push(data[i][keys[j]]);
         if(j==1) ani.push(data[i][keys[j]]);
         if(j==2) indicatori.push(data[i][keys[j]]);
     }
 }

 // liste cu tari, ani si indicatori unici
 tari = tari.filter((x, i, a) => a.indexOf(x) == i);
 ani = ani.filter((x, i, a) => a.indexOf(x) == i);
 indicatori = indicatori.filter((x, i, a) => a.indexOf(x) == i);

// adaug optiunile pt select-uri
var x = document.getElementById("mySelect");
for (var i = 0; i < ani.length; i++) {
    var option = document.createElement("option");
    option.text = ani[i];
    x.add(option);
}

var x = document.getElementById("selectIndicator");
for (var i = 0; i < indicatori.length; i++) {
    var option = document.createElement("option");
    option.text = indicatori[i];
    x.add(option);
}

var x = document.getElementById("selectTara");
for (var i = 0; i < tari.length; i++) {
    var option = document.createElement("option");
    option.text = tari[i];
    x.add(option);
}

var x = document.getElementById("selectBubbleChart");
for (var i = 0; i < ani.length; i++) {
    var option = document.createElement("option");
    option.text = ani[i];
    x.add(option);
}


// functie care afiseaza toate datele din json sub forma de tabel
function TabelCuToateDatele() {

    // creez capul de tabel

    var table = document.getElementById("table");
    table.innerHTML = "";
    var tr = table.insertRow(-1);

    for (var i = 0; i < keys.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = keys[i];
        tr.appendChild(th);
    }

   
    // adaug datele din json in tabel si formez liste
    for (var i = 0; i < data.length; i++) {

        tr = table.insertRow(-1);
        for (var j = 0; j < keys.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data[i][keys[j]];
        }
    }
}

//hsl(hue, saturation, lightness)

function getColorMedie(value, min, max, avg){
    if (value >= avg) {
        var v = (value-avg) / (max-avg);
        var hue=(v*60 + 60).toString(); //intre galben si verde
        return ["hsl(",hue,",100%,50%)"].join("");
    } else 
    if (value == null) return ["hsl(0,100%,0%)"].join(""); //negru
    else {
        var v = (value-min) / (avg-min);
        var hue=(v*60).toString(); //intre rosu si galben
        return ["hsl(",hue,",100%,50%)"].join("");
    }

}


// functie care afiseaza toate datele din tabel in functie de anul selectat de utilizator
function TabelPeAni(evt) {
    var anSelectat = evt.target.value;

    // calculez mediile din anul respectiv

    var msv=0, mpop=0, mpib=0, countsv=0, countpop=0, countpib=0;
    var max1=0, max2=0, max3=0;
    var min1=9999999999, min2=9999999999, min3=9999999999;

    for (var i = 0; i < data.length; i++) {
        if(data[i][keys[1]] == anSelectat) {
            if(data[i][keys[2]] == "SV" && data[i][keys[3]] != null) {
                if(data[i][keys[3]]>max1) max1=data[i][keys[3]];
                if(data[i][keys[3]]<min1) min1=data[i][keys[3]];
                msv = msv + data[i][keys[3]];
                countsv = countsv + 1;
            }
            if(data[i][keys[2]] == "POP" && data[i][keys[3]] != null) {
                if(data[i][keys[3]]>max2) max2=data[i][keys[3]];
                if(data[i][keys[3]]<min2) min2=data[i][keys[3]];
                mpop = mpop + data[i][keys[3]];
                countpop = countpop + 1;
            }
            if(data[i][keys[2]] == "PIB" && data[i][keys[3]] != null) {
                if(data[i][keys[3]]>max3) max3=data[i][keys[3]];
                if(data[i][keys[3]]<min3) min3=data[i][keys[3]];
                mpib= mpib + data[i][keys[3]];
                countpib = countpib + 1;
            }
        }
    }

    msv = (msv / countsv).toFixed(2);
    mpop = (mpop / countpop).toFixed(2);
    mpib = (mpib / countpib).toFixed(2);

    // creez capul de tabel
    var table = document.getElementById("table");
    table.innerHTML = "";

    var tr = table.insertRow(-1);
    var th = document.createElement("th");
    th.innerHTML = " ";
    tr.appendChild(th);

    for (var i = 0; i < indicatori.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = indicatori[i];
        tr.appendChild(th);
    }

    for (var i = 0; i < tari.length; i++) {

        tr = table.insertRow(-1);
        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = tari[i];

        for (var j = 0; j < data.length; j++) {
            if (data[j][keys[0]] == tari[i] && data[j][keys[1]] == anSelectat) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = data[j][keys[3]];
                if(data[j][keys[2]] == "SV") tabCell.style.backgroundColor = getColorMedie(data[j][keys[3]],min1,max1,msv);
                if(data[j][keys[2]] == "POP") tabCell.style.backgroundColor = getColorMedie(data[j][keys[3]],min2,max2,mpop);
                if(data[j][keys[2]] == "PIB") tabCell.style.backgroundColor = getColorMedie(data[j][keys[3]],min3,max3,mpib);
            }
        }
    }

    tr = table.insertRow(-1);
    var tabCell = tr.insertCell(-1);
    tabCell.innerHTML = "Media";
    tabCell = tr.insertCell(-1);
    tabCell.innerHTML = msv;
    tabCell = tr.insertCell(-1);
    tabCell.innerHTML = mpop;
    tabCell = tr.insertCell(-1);
    tabCell.innerHTML = mpib;

}

//functii barchart SVG
class BarChart{
  constructor(domElement) {
      this.domElement = domElement;
      this.svgns = "http://www.w3.org/2000/svg"; 
  }
  draw(){
      this.data = values;
      this.width = this.domElement.clientWidth;
      this.height = this.domElement.clientHeight;

      this.createSVG();
      this.drawBackground();
      this.drawBars();

      this.domElement.appendChild(this.svg);
  }
  createSVG(){
      this.svg = document.createElementNS(this.svgns, "svg");
      this.svg.id = "svg";
      this.svg.setAttribute('width', this.width*2);
      this.svg.setAttribute('height', this.height);
  }
  drawBackground(){
      const rect = document.createElementNS(this.svgns, 'rect');
      rect.setAttribute('x', 0);
      rect.setAttribute('y', 0);
      rect.setAttribute('height', this.height);
      rect.setAttribute('width', this.width*2);
      rect.style.fill = 'WhiteSmoke';
      this.svg.appendChild(rect);
  }
  drawBars(){
      const barWidth = this.width / this.data.length * 2;

      const f = this.height*0.9 / Math.max(...this.data);

      for(let i=0; i<this.data.length; i++){

          const label = ani[i];
          const value = this.data[i];

          const barHeight = value * f * 0.9;
          const barY = this.height - barHeight;
          const barX = i * barWidth + barWidth/4;

          const bar = document.createElementNS(this.svgns, 'rect');
          bar.setAttribute('class','bar');
          bar.setAttribute('id', value);

          bar.setAttribute('x', barX);
          bar.setAttribute('y', barY);
          bar.setAttribute('height', barHeight);
          bar.setAttribute('width', barWidth/2);

          bar.setAttribute("fill", '#7d0066');
          bar.setAttribute("stroke-width", 2);
          bar.setAttribute("stroke", "black");

        // tooltip-ul pentru fiecare bar

        var mypopup = document.getElementById("mypopup");
        var ttp = document.getElementById("tooltiptext");

        bar.addEventListener("mouseover", showPopup);
        bar.addEventListener("mouseout", hidePopup);

        function showPopup(evt) {
            var iconPos = bar.getBoundingClientRect();
            ttp.innerHTML = "În anul " + ani[i] + " indicatorul " + indsel + " a avut valoarea de: " + value;
            mypopup.style.left = (iconPos.right + 20) + "px";
            mypopup.style.top = (window.scrollY + iconPos.top - 60) + "px";
            mypopup.style.display = "block";
        }

        function hidePopup(evt) {
            mypopup.style.display = "none";
        }


          this.svg.appendChild(bar);

          const text = document.createElementNS(this.svgns, 'text');
          text.appendChild(document.createTextNode(label));
          text.setAttribute('x', barX);
          text.setAttribute('y', barY - 10);
          this.svg.appendChild(text);
      }
    }
  }

var values = [], indsel, tarasel;

// functie  care creaza barchart-ul
function creeazaSVG() {
    var table = document.getElementById("table");
    table.innerHTML = "";

    var ind = document.getElementById("selectIndicator");
    indsel= ind.options[ind.selectedIndex].text;

    var sel = document.getElementById("selectTara");
    tarasel= sel.options[sel.selectedIndex].text;

    for (var i = 0; i < data.length; i++) {
        if(data[i][keys[0]] == tarasel && data[i][keys[2]] == indsel) {
            values.push(data[i][keys[3]]);
        }
    }

    
    const barChart = new BarChart(document.getElementById("barChart"));

    if(barChart.domElement.innerHTML == '') {
        barChart.draw();
    } else {
        // in cazul in care exista deja un barchart desenat, trebuie sa desenez peste el
        const b2 = new BarChart(document.getElementById("barChart"));
        b2.data = values;
        b2.width = b2.domElement.clientWidth;
        b2.height = b2.domElement.clientHeight;
        b2.createSVG();
        b2.drawBackground();
        b2.drawBars();
        document.getElementById("svg").innerHTML += b2.svg.innerHTML;        
    }

    values=[];
}

// functie care imi creaza cate un bubble chart pentru fiecare indicator, in functie de anul selectat de utilizator
function creeazaBubble(evt) {
    var table = document.getElementById("table");
    table.innerHTML = "";

    var barChart = document.getElementById("barChart");
    barChart.innerHTML = "";

    var ansel = evt;

    var points = [], psv = [], ppop = [], ppib = [];

    for (var j = 0; j < data.length; j++) {
        if (data[j][keys[1]] == ansel && data[j][keys[2]] == "SV") {

            points = []

            points['y'] = data[j][keys[3]];
            points['x'] = data[j][keys[3]];

            points['name'] = data[j][keys[0]];
            psv.push(points);
        }
        if (data[j][keys[1]] == ansel && data[j][keys[2]] == "POP") {

            points = []

            points['y'] = data[j][keys[3]]; 
            points['x'] = data[j][keys[3]];

            points['name'] = data[j][keys[0]];
            ppop.push(points);
        }
        if (data[j][keys[1]] == ansel && data[j][keys[2]] == "PIB") {

            points = []

            points['y'] = data[j][keys[3]];
            points['x'] = data[j][keys[3]];

            points['name'] = data[j][keys[0]];
            ppib.push(points);
        }
    }


    var chartsv = new CanvasJS.Chart("chartContainer", {
        title:{ text: "Bubble Chart Speranță de Viață - " + ansel },
        legend:{ horizontalAlign: "left" },
        data: [{
            type: "scatter",
            legendMarkerType: "circle",
            legendMarkerColor: "grey",
            toolTipContent: "<b> Tara: {name}</b><br/>Speranța de viață: {x} <br/>Anul: " + ansel,
            dataPoints: psv
        }]
    });

    var chartpop = new CanvasJS.Chart("chartContainer2", {
        title:{ text: "Bubble Chart Populație - " + ansel },
        legend:{ horizontalAlign: "left" },
        data: [{
            type: "scatter",
            legendMarkerType: "circle",
            legendMarkerColor: "grey",
            toolTipContent: "<b> Tara: {name}</b><br/>Populație: {x} <br/>Anul: " + ansel,
            dataPoints: ppop
        }]
    });

    var chartpib = new CanvasJS.Chart("chartContainer3", {
        title:{ text: "Bubble Chart PIB pe cap de locuitor - " + ansel },
        legend:{ horizontalAlign: "left" },
        data: [{
            type: "scatter",
            legendMarkerType: "circle",
            legendMarkerColor: "grey",
            toolTipContent: "<b> Tara: {name}</b><br/>Valoare PIB: {x} <br/>Anul: " + ansel,
            dataPoints: ppib
        }]
    });

    chartsv.render();
    chartpop.render();
    chartpib.render();

    sleep(1000); // pt partea de animatie, graficele sa se schimbe o data la o secunda
}

function sleep(miliseconds) {
    var currentTime = new Date().getTime();
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
 }

// functie care deseneaza bubble charts in continuu
function animeazaBubble() {
    for (var i = 2; i < ani.length; i++) {
        setInterval(creeazaBubble, 2000, ani[i]);
    }
}

// încercare de extragere din eurostat
var tari =[ 'BE', 'BG', 'CZ', 'DK', 'DE', 'EE', 'IE', 'EL', 'ES', 'FR', 'HR', 'IT', 'CY', 'LV', 'LT', 'LU', 'HU', 'MT', 'NL', 'AT', 'PL', 'PT', 'RO', 'SI', 'SK', 'FI', 'SE' ];

var link1 = "http://ec.europa.eu/eurostat/wdds/rest/data/v2.1/json/en/demo_mlexpec?precision=1&sex=T&age=Y1";

var req = new XMLHttpRequest();
req.open("GET", link1, false);
req.send(null);
var date1 = JSON.parse(req.responseText);

console.log(date1);


console.log(date1.value);
console.log(date1.dimension.time);
