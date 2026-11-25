
  function toggleView(event) {
    event.stopPropagation();
    const stickySocial = document.querySelector('.sticky-social');
    if (stickySocial) {
      stickySocial.classList.toggle('show');
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    const shareIcon = document.querySelector('.share-icon');
    if (shareIcon) {
      shareIcon.onclick = function(event) {
        toggleView(event);
      };
    }
  });

  





