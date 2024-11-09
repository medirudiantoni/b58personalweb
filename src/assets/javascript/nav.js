const navMenu = document.querySelector('.menu');
const toggle = document.querySelector('.toggle');
const menuToggle = document.querySelector('.menu-toggle');

toggle.addEventListener('click', function(){
    navMenu.classList.toggle('menu-active');
    menuToggle.classList.toggle('menu-toggle-x');
})