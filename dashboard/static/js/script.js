/*====================================
        LIVE DATE & TIME
====================================*/

function updateDateTime(){

    const now = new Date();

    const options = {
        weekday:'short',
        day:'2-digit',
        month:'short',
        year:'numeric'
    };

    const date = now.toLocaleDateString('en-IN', options);
    const time = now.toLocaleTimeString();

    const clock = document.getElementById("datetime");

    if(clock){
        clock.innerHTML = date + " | " + time;
    }

}

setInterval(updateDateTime,1000);
updateDateTime();


/*====================================
        COUNTER ANIMATION
====================================*/

function counter(id,target){

    const element = document.getElementById(id);

    if(!element) return;

    let count = 0;

    const speed = Math.ceil(target/100);

    const timer = setInterval(()=>{

        count += speed;

        if(count >= target){

            count = target;
            clearInterval(timer);

        }

        element.innerHTML = count.toLocaleString();

    },20);

}

window.onload=function(){

    counter("packetCount",24650);

};


/*====================================
        BUTTON ACTIONS
====================================*/

const startBtn=document.querySelector(".start");
const stopBtn=document.querySelector(".stop");
const reportBtn=document.querySelector(".report");

if(startBtn){

startBtn.addEventListener("click",()=>{

alert("Monitoring Started Successfully");

});

}

if(stopBtn){

stopBtn.addEventListener("click",()=>{

alert("Monitoring Stopped");

});

}

if(reportBtn){

reportBtn.addEventListener("click",()=>{

alert("Generating Report...");

});

}


/*====================================
        CARD HOVER EFFECT
====================================*/

document.querySelectorAll(".stat-card").forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.transform="translateY(-8px)";

});

card.addEventListener("mouseleave",()=>{

card.style.transform="translateY(0px)";

});

});


/*====================================
        PROGRESS BAR ANIMATION
====================================*/

window.addEventListener("load",()=>{

document.querySelectorAll(".progress-fill").forEach(bar=>{

const width=bar.style.width;

bar.style.width="0";

setTimeout(()=>{

bar.style.width=width;

},300);

});

});


/*====================================
        SMOOTH PAGE LOAD
====================================*/

document.body.style.opacity="0";

window.addEventListener("load",()=>{

document.body.style.transition="opacity .5s";

document.body.style.opacity="1";

});


/*====================================
        NOTIFICATION BELL
====================================*/

const bell=document.querySelector(".notification");

if(bell){

setInterval(()=>{

bell.classList.toggle("active");

},1500);

}


/*====================================
        SEARCH
====================================*/

const search=document.querySelector(".search-box input");

if(search){

search.addEventListener("focus",()=>{

search.parentElement.style.boxShadow="0 0 0 3px rgba(11,110,121,.15)";

});

search.addEventListener("blur",()=>{

search.parentElement.style.boxShadow="";

});

}


/*====================================
        END
====================================*/

/*====================================
        LIVE MONITORING
====================================*/

/* Live Packets Counter */

function animatePackets(){

    const packet=document.getElementById("pps");

    if(!packet) return;

    let value=245;

    setInterval(()=>{

        value+=Math.floor(Math.random()*8);

        packet.innerHTML=value;

    },1000);

}

animatePackets();


/*====================================
        LIVE TRAFFIC CHART
====================================*/

const liveCanvas=document.getElementById("liveChart");

if(liveCanvas){

const liveChart=new Chart(liveCanvas,{

type:"line",

data:{

labels:["0","5","10","15","20","25","30"],

datasets:[{

label:"Packets",

data:[120,180,140,260,210,320,280],

borderWidth:3,

fill:true,

tension:.4

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

display:false

}

},

scales:{

x:{

grid:{

display:false

}

},

y:{

beginAtZero:true

}

}

}

});

setInterval(()=>{

liveChart.data.datasets[0].data.shift();

liveChart.data.datasets[0].data.push(

Math.floor(Math.random()*250)+100

);

liveChart.update();

},3000);

}


/*====================================
        REFRESH BUTTON
====================================*/

const refresh=document.querySelector(".refresh-btn");

if(refresh){

refresh.addEventListener("click",()=>{

location.reload();

});

}


/*====================================
        TABLE ROW HOVER
====================================*/

document.querySelectorAll(".table-card tbody tr").forEach(row=>{

row.addEventListener("mouseenter",()=>{

row.style.transform="scale(1.01)";

});

row.addEventListener("mouseleave",()=>{

row.style.transform="scale(1)";

});

});


/*====================================
        ACTIVITY AUTO SCROLL
====================================*/

const activity=document.querySelector(".activity-list");

if(activity){

setInterval(()=>{

activity.scrollTop+=40;

if(activity.scrollTop>=activity.scrollHeight){

activity.scrollTop=0;

}

},3000);

}


/*====================================
        SEARCH FILTER
====================================*/

const searchBox=document.querySelector(".table-card input");

if(searchBox){

searchBox.addEventListener("keyup",function(){

const filter=this.value.toUpperCase();

const rows=document.querySelectorAll(".table-card tbody tr");

rows.forEach(row=>{

const text=row.innerText.toUpperCase();

row.style.display=text.includes(filter)?"":"none";

});

});

}


/*====================================
        BUTTON ACTIONS
====================================*/

document.querySelectorAll(".quick-actions button").forEach(btn=>{

btn.addEventListener("click",()=>{

btn.style.transform="scale(.95)";

setTimeout(()=>{

btn.style.transform="scale(1)";

},150);

});

});


/*====================================
        END LIVE MONITORING
====================================*/