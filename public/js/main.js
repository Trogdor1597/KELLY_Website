document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    // Ensure the mobile menu is hidden on medium screens and up by default
    mobileMenu.classList.add('md:hidden');

    // Function to open the mobile menu
    const openMobileMenu = () => {
        mobileMenu.classList.remove('hidden'); // Make it visible
        // Force reflow to ensure 'display: flex' is applied before transform transition starts
        mobileMenu.offsetWidth; // Trigger reflow
        mobileMenu.classList.remove('-translate-x-full'); // Slide it in
        mobileMenu.classList.add('translate-x-0');
    };

    // Function to close the mobile menu
    const closeMobileMenu = () => {
        mobileMenu.classList.remove('translate-x-0'); // Slide it out
        mobileMenu.classList.add('-translate-x-full');
        mobileMenu.addEventListener('transitionend', () => mobileMenu.classList.add('hidden'), { once: true }); // Hide after transition
    };

    mobileMenuButton.addEventListener('click', openMobileMenu);
    closeMobileMenuButton.addEventListener('click', closeMobileMenu);
});