import './style.css';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'; 
import Stats from 'stats.js'
import { fireflies, createFirefly } from './fireflies.js';
import { NighttimeShader } from './shaders';





// Setup
const stats = new Stats();
//stats.showPanel(0);
//document.body.appendChild(stats.dom);
//stats.dom.style.transform = 'scale(1, 0.1)';  // Adjust the scale values as needed

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.x = Math.PI; // Set rotation (x, y, z)


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  //precision: 'lowp',
  antialias: true,
  powerPreference: 'high-performance'

  
});


let maxPixelRatio;

// Check if the device is an iPad
const isIpad = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (isIpad) {
    maxPixelRatio = 1;
} else {
    // For desktop or other devices
    maxPixelRatio = 1; // or whatever value you deem appropriate
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));

// Updated composition setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);



// Nighttime shader pass
const nighttimePass = new ShaderPass(NighttimeShader);
nighttimePass.uniforms.amount.value = 0.2; // Adjust this to control darkness
composer.addPass(nighttimePass);

// Color correction pass
const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
colorCorrectionPass.uniforms['powRGB'].value = new THREE.Vector3(0.8, 0.8, 0.8); // Adjust this to control darkness
colorCorrectionPass.uniforms['mulRGB'].value = new THREE.Vector3(1.3, 1.3, 1.3); // Adjust this to control contrast
composer.addPass(colorCorrectionPass);

composer.setSize(renderer.getSize(new THREE.Vector2()).width, renderer.getSize(new THREE.Vector2()).height);

const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  composer.setSize(width, height);

window.addEventListener('resize', function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  composer.setSize(width, height);
}, false);





camera.position.setZ(10);
camera.position.setX(-10);
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;


// Fog setup
scene.fog = new THREE.Fog(0x4537DE, 0.5, 80);



// Define an array of warm colors
const warmColors = [
  0xffa800, // Orange
  0xff4500, // Red-orange
  
  0xff6347, // Tomato
  0xff7f50, // Coral
];

const lightLocations = [
  [-17, 0, 23],
  [-19, 0, 33],
  [2, 0, 60],
  [-4, 0, 69],
  [-10, 0, 83],
  [-15, 0, 83]

];

export const navTargets = {
  'About': 30.22, 
  'Game-Engine': 21.74,
  'Projects': 26.45,
  'Accomplishments': 50.21,
  'Work': 57.86,
  'Skills': 64.34,
  'Contact': 69.22



};


function getRandomWarmColor() {
  const index = Math.floor(Math.random() * warmColors.length);
  return warmColors[index];
}
function createPointLight(color, intensity, distance, position, lightIntensity = 5) {
  const housePointLight = new THREE.PointLight(color, intensity, distance);
  housePointLight.position.set(...position);
  housePointLight.intensity = lightIntensity;
  housePointLight.distance = distance;
  housePointLight.castShadow = false;

  scene.add(housePointLight);
  return housePointLight;
}
// Lights
const pointLight = new THREE.PointLight(getRandomWarmColor(), 0.2, 100); // Warm point light
pointLight.position.set(10, 10, 10);
pointLight.intensity = 2;
scene.add(pointLight);

const forestLights = {
  'house1': createPointLight(getRandomWarmColor(), 0.2, 10, lightLocations[0]), // Greenish light
  'house2': createPointLight(getRandomWarmColor(), 0.2, 10, lightLocations[1]), // Yellowish light
  'house3': createPointLight(getRandomWarmColor(), 0.2, 10, lightLocations[2]), // Greenish light
  'house4': createPointLight(getRandomWarmColor(), 0.2, 10, lightLocations[3], 5), // Yellowish light with higher intensity
  'house5': createPointLight(getRandomWarmColor(), 0.2, 10, lightLocations[4], 2), // Greenish light
  'house6': createPointLight(getRandomWarmColor(), 0.2, 10, lightLocations[5], 2), // Yellowish light
};

const ambientLight = new THREE.AmbientLight(0x404040, 0.4); // Soft ambient forest light
scene.add(pointLight, ambientLight);
// Background
scene.background = new THREE.Color(0x000033); // Dark blue background


const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3); // Dimmed directional light
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);



// Add a red spotlight
const spotLight = new THREE.SpotLight(0xff0000, 0.5); // Red spotlight with half intensity
spotLight.position.set(10, 10, 10);
scene.add(spotLight);

// Add a HemisphereLight
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.1); // Dimmed hemisphere light
scene.add(hemisphereLight);

// Change your ambient light color and intensity

// Background

const spaceTexture = new THREE.TextureLoader().load('nightsky.png');
scene.background = spaceTexture;

const loadingManager = new THREE.LoadingManager();
const progressBar = document.getElementById('progress-bar');

var finishedLoading = false;
loadingManager.onProgress = function(url, loaded, total)
{
  progressBar.value = (loaded / total) * 100;
}
const progressBarContainer = document.querySelector('.progress-bar-container');

loadingManager.onLoad = function() {
  progressBarContainer.style.display = 'none';
  finishedLoading = true;
}
const loader = new GLTFLoader(loadingManager);
const dLoader = new DRACOLoader();
dLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
dLoader.setDecoderConfig({type: 'js'});
loader.setDRACOLoader(dLoader);
let degrees = 20; 

loader.load(
  'ForestPathPortfolioGrouped1.glb', 
  function (gltf) {
    gltf.scene.position.set(14, 0, 0); // Set position (x, y, z)
    gltf.scene.rotation.x = Math.PI; // Set rotation (x, y, z)


    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);



// Scroll Animation
// Calculate max scrollable height based on camera's max position
const maxScrollableHeight = Math.abs(navTargets['contact'] - navTargets['home']) * 200; // You can adjust the multiplier as needed

// Adjust document's body height based on maxScrollableHeight
//document.body.style.height = `${maxScrollableHeight}px`;

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
    scrollToSection(this.hash);
  });
  
  // Scroll to section when introCOntactButton is clicked
  $("#introContactButton").on('click', function(event) {
    scrollToSection(this.hash);
  });
  
  function scrollToSection(hash) {
    if (hash !== "") {
      event.preventDefault();
  
      // Get the current scroll position
      var currentScrollPosition = $(window).scrollTop();
      
      // Get the target section's position
      var targetPosition = $(hash).offset().top;

      // Calculate scrollToPosition right when the click event is processed
      var scrollToPosition = targetPosition - $(window).height() * 0.1;
      
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
      $('html, body').animate({
        scrollTop: scrollToPosition
      }, 800, function() {
        // Only push the state if the animation completed (cameraTargetZ wasn't reset)
        if (cameraTargetZ !== undefined) {
          history.pushState(null, null, hash);
        }
      });
    }
  }
  

  
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
// Create a function to handle the intersection
function handleIntersection(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // If the section is in the viewport, add the fadeIn class
      entry.target.classList.add("fadeIn");
    } else {
      // If the section is out of the viewport, remove the fadeIn class
      entry.target.classList.remove("fadeIn");
    }
  });
}
// Create a function to handle the intersection of cards
function handleCardIntersection(entries, observer) {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Calculate the delay based on the index
      const delay = index * 200; // Adjust the delay as needed

      // Add the fadeIn class with the calculated delay
      setTimeout(() => {
        entry.target.classList.remove("fadeIn");
      }, delay);
    } else {
      // If the card is out of the viewport, remove the fadeIn class
      entry.target.classList.add("fadeIn");
    }
  });
}
// Create an observer that will call the handleIntersection function
const observer = new IntersectionObserver(handleIntersection, {
  threshold: 0.4, // Trigger the callback when at least 40% of the section is visible
});

// Create an observer for the cards
const cardObserver = new IntersectionObserver(handleCardIntersection, {
  threshold: 0.4, // Trigger the callback when at least 40% of the card is visible
});

// Get all cards you want to observe
const cards = document.querySelectorAll(".card");

// Observe each card
cards.forEach((card) => {
  cardObserver.observe(card);
});

// Get all sections you want to observe
const sections = document.querySelectorAll("section");

// Observe each section
sections.forEach((section) => {
  observer.observe(section);
});
 
document.querySelector(".nav-toggle").addEventListener("click", function() {
  this.classList.toggle("active");
});

for(let i = 0; i < 50; i++){ // 50 fireflies
  const fireflyObject = createFirefly(scene);
  fireflies.push(fireflyObject);
}
function moveCameraOnScroll() {
  const t = document.documentElement.scrollTop || document.body.scrollTop; // Get the scroll position

  // Calculate the maximum scroll value based on the page content
  const maxScrollValue = document.documentElement.scrollHeight - window.innerHeight;

  // Map the scroll position to the camera's `z` position
  let targetZ = (t / maxScrollValue) * (maxScrollZ - minScrollZ) + minScrollZ;

  if (finishedLoading) {
    // Check the limits
    if (targetZ < minScrollZ) targetZ = minScrollZ;
    if (targetZ > maxScrollZ) targetZ = maxScrollZ;

    if (cameraTargetZ === undefined && Math.abs(camera.position.z - targetZ) > 0.01) {
      camera.position.z += (targetZ - camera.position.z) * 0.05; // Adjust the 0.05 value to control the speed of the movement
    }
  }
}




export let cameraTargetZ;
export let minScrollZ = 10;  // set the minimum distance here
export let maxScrollZ = 78; // set the maximum distance here
const maxRotationX = 0.8; // Adjust as needed.
const maxRotationY = 1.2; // Adjust as needed.


// Select elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');



navToggle.addEventListener('click', () => {
  navbar.classList.toggle('active');

  
});
let mouseX = 0;
let mouseY = 0;

// Initial target position
let hasMouseMoved = false;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    hasMouseMoved = true;
});
const initialRotation = new THREE.Euler().copy(camera.rotation);
function updateCameraRotation() {
  if (!hasMouseMoved) return; // Don't update rotation if the mouse hasn't moved

  const normalizedMouseX = (mouseX / window.innerWidth) - 0.5;
  const normalizedMouseY = (mouseY / window.innerHeight) - 0.5;

  


  const targetRotationX = initialRotation.x - normalizedMouseY * (maxRotationX);
  const targetRotationY = initialRotation.y - normalizedMouseX * (maxRotationY);

  camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.35; // Adjust the 0.1 value for damping.
  camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.35;
}




document.body.onscroll = moveCameraOnScroll;


function updateFireflies() {
  fireflies.forEach(({firefly, fireflyLight, velocity}) => {
    
      firefly.position.add(velocity);
      //fireflyLight.position.copy(firefly.position);
      

      // Boundary checks
      if (firefly.position.x < -10 || firefly.position.x > 10) velocity.x = -velocity.x;
      if (firefly.position.y < -10 || firefly.position.y > 10) velocity.y = -velocity.y;
      if (firefly.position.z < -10 || firefly.position.z > 10) velocity.z = -velocity.z;

      // Flicker effect
      //fireflyLight.intensity = 0.8 + Math.sin(Date.now() * 0.005) * 0.2;
      console.log(camera.position.z);
  });
}


// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  updateCameraRotation();
  updateFireflies();
  
  stats.begin()
  

  renderer.render(scene, camera);
  stats.end()

}

animate();

const fieldsOfInterest = [
  "Game Developer",
  "Game Engine Programmer",
  "Web Developer"
];

let index = 0;
let charIndex = 0;
let isDeleting = false;
const typingEffectElement = document.getElementById('typing-effect');
let currentField = fieldsOfInterest[index];

function type() {
  if (!isDeleting && charIndex <= currentField.length) {
      typingEffectElement.textContent += currentField[charIndex] || '';
      charIndex++;
      setTimeout(type, 100); // typing speed
  } else if (isDeleting && charIndex > 0) {
      typingEffectElement.textContent = typingEffectElement.textContent.slice(0, -1);
      charIndex--;
      setTimeout(type, 50); // backspace speed (faster than typing speed)
  } else if (charIndex === 0 && isDeleting) {
      isDeleting = false;
      index = (index + 1) % fieldsOfInterest.length; // move to next field
      currentField = fieldsOfInterest[index];
      setTimeout(type, 500); // delay before typing next field
  } else {
      isDeleting = true;
      setTimeout(type, 1000); // delay before starting backspace
  }
}

type();



