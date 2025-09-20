events.on("ready",function(){document.addEventListener("DOMContentLoaded",()=>{let t=document.querySelectorAll(".gallery .item");t.forEach(e=>{e.addEventListener("click",()=>{e.classList.contains("active")?e.classList.remove("active"):(t.forEach(e=>e.classList.remove("active")),e.classList.add("active"))})})})});
//# sourceMappingURL=script.js.map
