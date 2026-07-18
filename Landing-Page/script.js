// Smooth scroll for navigation links

document.querySelectorAll('a[href^="#"]').forEach(link => {

link.addEventListener("click", function(e){

e.preventDefault();

const target=document.querySelector(this.getAttribute("href"));

if(target){

target.scrollIntoView({

behavior:"smooth"

});

}

});

});

// Navbar shadow on scroll

window.addEventListener("scroll",()=>{

const navbar=document.querySelector("header");

if(window.scrollY>50){

navbar.style.boxShadow="0 5px 20px rgba(0,0,0,.35)";

}else{

navbar.style.boxShadow="none";

}

});