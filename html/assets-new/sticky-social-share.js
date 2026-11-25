
  // Define the toggleView function that accepts the event parameter
  function toggleView(event) {
    // Prevent the event from bubbling up to other components
    event.stopPropagation();

    // Toggle the visibility of the sticky social element
    const stickySocial = document.querySelector('.sticky-social');
    stickySocial.classList.toggle('show');
}

// Add the event listener after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.share-icon').onclick = function(event) {
        toggleView(event);
    };
});