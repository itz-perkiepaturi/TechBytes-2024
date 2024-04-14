
    window.addEventListener('scroll', function() {
        var navbar = document.getElementBy('navbar');
        if (window.scrollY > 0) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

// JavaScript to trigger the text animation after the page loads
document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = document.getElementById('welcomeText');
    const descriptionText = document.getElementById('descriptionText');
    
    // Add a delay before animating the description text
    setTimeout(() => {
        descriptionText.style.animation = 'fadeIn 2s forwards';
    }, 1000); // Delay of 1000ms (1 second) before starting the animation
});
