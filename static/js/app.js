/* =====================================================
   GLOBAL STATE
===================================================== */

let selectedRoomId = null;
let activeRoomType = null;
let priceLimit = 999999;


/* =====================================================
   SMALL UTILITIES
===================================================== */

function $(id){
    return document.getElementById(id);
}

function toast(msg){
    const t=document.createElement("div");
    t.className="toast";
    t.innerText=msg;
    document.body.appendChild(t);

    setTimeout(()=>t.classList.add("show"),20);
    setTimeout(()=>t.remove(),2500);
}


/* =====================================================
   NAVIGATION
===================================================== */

function logout(){ location.href="/"; }
function goToHome(){ location.href="/home"; }
function goToAdmin(){ location.href="/admin_panel"; }
function goBack(){ location.href="/"; }

function showSection(id){
    document.querySelectorAll(".admin-section")
        .forEach(s=>s.style.display="none");

    $(id).style.display="block";
}


/* =====================================================
   ============================================
   USER SIDE
   ============================================
===================================================== */


/* =====================================================
   LOAD HOTELS WITH ROOMS (grouped)
   API → /hotels_with_rooms
===================================================== */

function loadHotels(){

    const container = $("homestays");
    if(!container) return;

    fetch("/hotels_with_rooms")
    .then(r=>r.json())
    .then(data=>{

        container.innerHTML="";

        data.forEach(h=>{

            let roomsHTML="";

            h.rooms
            .filter(r=>r.price <= priceLimit)
            .forEach(r=>{

                roomsHTML += `
                    <div class="room-card">
                        <img src="/static/uploads/rooms/${r.image||''}">
                        <p>₹${r.price}</p>
                        <button onclick="openBooking(${r.id})">Book</button>
                    </div>
                `;
            });

            container.innerHTML += `
                <div class="hotel-main-card">
                    <img class="hotel-img"
                         src="/static/uploads/rooms/${h.image||''}">
                    <h3>${h.name}</h3>
                    <p>${h.description||""}</p>

                    <div class="rooms-grid">
                        ${roomsHTML}
                    </div>
                </div>
            `;
        });
    });
}


/* =====================================================
   PRICE FILTER
===================================================== */

function filterPrice(val){
    priceLimit = val;
    loadHotels();
}


/* =====================================================
   BOOKING MODAL
===================================================== */

function openBooking(id){
    selectedRoomId = id;
    $("bookingModal").style.display="flex";
}

function closeModal(){
    $("bookingModal").style.display="none";
}

async function confirmBooking(){

    const data = {
        room_id:selectedRoomId,
        name:$("custName")?.value,
        phone:$("custPhone")?.value,
        date:$("custDate")?.value
    };

    const res = await fetch("/book",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
    });

    const result = await res.json();

    toast(result.message || result.error);

    closeModal();
    loadHotels();
}


/* =====================================================
   SEARCH (price + pagination ready)
   API → /search
===================================================== */

function search(){

    const params = new URLSearchParams({
        min:0,
        max:priceLimit,
        page:1
    });

    fetch("/search?"+params)
    .then(r=>r.json())
    .then(data=>{
        console.log(data);
    });
}


/* =====================================================
   ============================================
   ADMIN SIDE
   ============================================
===================================================== */


/* =====================================================
   ADMIN LOGIN
===================================================== */

async function adminLogin(){

    const res = await fetch("/admin/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            username:$("username").value,
            password:$("password").value
        })
    });

    const result = await res.json();

    if(result.message){
        location.href="/admin_dashboard";
    }else{
        $("msg").innerText = result.error;
    }
}


/* =====================================================
   CANCEL BOOKING
===================================================== */

function cancelBooking(id){
    fetch("/cancel/"+id,{method:"POST"})
    .then(()=>location.reload());
}


/* =====================================================
   LOAD BOOKINGS TABLE
===================================================== */

function loadBookings(){

    const table = $("bookingTable");
    if(!table) return;

    fetch("/admin/bookings")
    .then(r=>r.json())
    .then(data=>{

        table.innerHTML="";

        data.forEach(b=>{

            table.innerHTML += `
                <tr>
                    <td>${b.id}</td>
                    <td>${b.room}</td>
                    <td>${b.name}</td>
                    <td>${b.phone}</td>
                    <td>${b.date}</td>
                    <td>${b.status}</td>
                    <td>
                        ${b.status==='CONFIRMED'
                        ? `<button onclick="cancelBooking(${b.id})">Cancel</button>`
                        : '-'}
                    </td>
                </tr>
            `;
        });
    });
}


/* =====================================================
   HOTEL SETUP FORM (multiple images)
   API → /admin/add_full_setup
===================================================== */

$("setupForm")?.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const formData = new FormData(e.target);

    const res = await fetch("/admin/add_full_setup",{
        method:"POST",
        body:formData
    });

    const result = await res.json();

    toast(result.message);
    e.target.reset();
});


/* =====================================================
   IMAGE PREVIEW (multiple)
===================================================== */

function previewImage(input){

    const preview = $("previewBox");
    if(!preview) return;

    preview.innerHTML="";

    Array.from(input.files).forEach(f=>{
        const img=document.createElement("img");
        img.src=URL.createObjectURL(f);
        preview.appendChild(img);
    });
}


/* =====================================================
   ANALYTICS CHARTS
===================================================== */

async function loadChart(url, canvasId){

    if(!$(canvasId)) return;

    const res = await fetch(url);
    const data = await res.json();

    new Chart($(canvasId),{
        type:'bar',
        data:{
            labels:data.map(x=>Object.values(x)[0]),
            datasets:[{
                label:"Bookings",
                data:data.map(x=>x.total)
            }]
        }
    });
}


/* =====================================================
   REPORTS
===================================================== */

function loadReports(){

    fetch("/admin/revenue")
    .then(r=>r.json())
    .then(d=>{
        if($("rev"))
            $("rev").innerText="₹"+(d[0]?.revenue||0);
    });

    fetch("/admin/occupancy")
    .then(r=>r.json())
    .then(d=>{
        if($("occ"))
            $("occ").innerText=d.occupancy+"%";
    });
}


function downloadCSV(){
    location.href="/admin/export_csv";
}


/* =====================================================
   LOCATION DROPDOWN AUTO FILL
===================================================== */

const locationData = {
    "India":{
        "Karnataka":["Bengaluru","Mysore","Hubli","Belgaum","Mangalore"],
        "Tamil Nadu":["Chennai","Madurai","Salem","Trichy","Coimbatore"]
    },
    "Thailand":{
        "Bangkok":["Bang Kapi","Dusit","Lat Phrao","Pathum Wan","Thonburi"],
        "Phuket":["Patong","Kata","Karon","Rawai","Chalong"]
    }
};

function initLocations(){

    const c=$("country"), s=$("state"), ci=$("city");
    if(!c || !s || !ci) return;

    Object.keys(locationData).forEach(x=>{
        c.innerHTML+=`<option>${x}</option>`;
    });

    c.onchange=()=>{
        s.innerHTML="";
        ci.innerHTML="";

        Object.keys(locationData[c.value]).forEach(st=>{
            s.innerHTML+=`<option>${st}</option>`;
        });

        s.onchange();
    };

    s.onchange=()=>{
        ci.innerHTML="";
        locationData[c.value][s.value]
            .forEach(ct=>{
                ci.innerHTML+=`<option>${ct}</option>`;
            });
    };

    c.onchange();
}


/* =====================================================
   AUTO INIT
===================================================== */

document.addEventListener("DOMContentLoaded",()=>{

    loadHotels();
    loadBookings();
    loadReports();

    loadChart("/admin/stats/daily","dailyChart");
    loadChart("/admin/stats/monthly","monthlyChart");
    loadChart("/admin/stats/yearly","yearlyChart");

    initLocations();
});
