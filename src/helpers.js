
import {navTargets, cameraTargetZ, minScrollZ, maxScrollZ} from './script.js'
// Calculate max scrollable height based on camera's max position
const maxScrollableHeight = Math.abs(navTargets['contact'] - navTargets['home']) * 200; // You can adjust the multiplier as needed

// Adjust document's body height based on maxScrollableHeight
document.body.style.height = `${maxScrollableHeight}px`;

document.onreadystatechange = function () {
  if (document.readyState == "interactive" || document.readyState == "complete") {
      var acc = document.getElementsByClassName("accordion");
      var i;
      function removeAnimation() {
          for (var j = 0; j < acc.length; j++) {
              acc[j].style.animation = '';
          }
      }
      
      function animateRandomButton() {
          removeAnimation();
      
          // Get all the inactive buttons
          var inactiveButtons = Array.from(acc).filter(button => !button.classList.contains("active"));
      
          if(inactiveButtons.length) {
              // Choose a random button
              var randomButton = inactiveButtons[Math.floor(Math.random() * inactiveButtons.length)];
      
              // Apply the animation
              randomButton.style.animation = "hintToPress 2s";
      
              // After 2 seconds, stop the animation and start over
              setTimeout(() => {
                  animateRandomButton();
              }, 2000);
          }
      }

      for (i = 0; i < acc.length; i++) {
          acc[i].addEventListener("click", function() {
              this.classList.toggle("active");
              var panel = this.nextElementSibling;
              if (panel.style.maxHeight) {
                  panel.style.maxHeight = null;
              } else {
                  panel.style.maxHeight = panel.scrollHeight + "px";
              } 
          });
      }

      animateRandomButton();
  }
};


document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        let rect = card.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let tiltX = -(y / rect.height - 0.5) * 10; // Adjust "10" for more or less tilt
        let tiltY = (x / rect.width - 0.5) * 10;
        card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
  
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0) rotateY(0)';
    });
  });
  
  
  
  
  
  $(window).on('load', function() {
    
    // Listen to wheel event
    window.addEventListener('wheel', function() {
      $('html, body').stop(); // Stop the animation
      cameraTargetZ = undefined; // Reset camera target
    });
    

    $("#navbar a").on('click', function(event) {
      if (this.hash !== "") {
        event.preventDefault();
        console.log("CKEWmckeejkFNFEKEMNKCENMC");
        var hash = this.hash;
  
        // Get the current scroll position
        var currentScrollPosition = $(window).scrollTop();
  
        // Calculate scrollToPosition right when the click event is processed
        var scrollToPosition = $(hash).offset().top - $(window).height() * 0.1;
  
        // Check if the screen is already at the target location
        if (Math.abs(currentScrollPosition - scrollToPosition) < 2) {
          return;
        }
  
        // Stop currently running animations only if the target hash is different
        if (window.location.hash !== hash) {
          $('html, body').stop();
        }
  
        // Set the target camera position
        var cameraZ = $(hash).data('cameraZ'); // Get the associated cameraZ position
        cameraTargetZ = cameraZ; // Update the cameraTargetZ
  
        // Animate the scroll position
        $('html, body').animate(
          {
          scrollTop: scrollToPosition
        }, 800, function() 
        {
          // Only push the state if the animation completed (cameraTargetZ wasn't reset)
          if (cameraTargetZ !== undefined) {
            history.pushState(null, null, hash);
          }
        });
      }
    });
    
    $(document).on("scroll", function() {
      var scrollPos = $(document).scrollTop() + $(window).height() * 0.3;
      var tags = $("section");
    
      tags.each(function() {
          var tag = $(this);
          
          if (tag.position().top <= scrollPos && tag.position().top + tag.height() > scrollPos) {
              var id = tag.attr('id');
              $("#navbar a").removeClass("active");
              $("#navbar a[href='#"+id+"']").addClass("active");
          }
      });
    });
  });
  
  document.querySelector(".nav-toggle").addEventListener("click", function() {
    this.classList.toggle("active");
  });


 
  