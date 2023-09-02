import './style.css';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'; 

import { fireflies, createFirefly } from './fireflies.js';
import { DarkenShader } from './shaders';





// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.x = Math.PI; // Set rotation (x, y, z)


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

const composer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );
const darkenPass = new ShaderPass( DarkenShader );
darkenPass.uniforms.amount.value = 0.6; // Adjust this to control darkness
composer.addPass( darkenPass );
const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
colorCorrectionPass.uniforms['powRGB'].value = new THREE.Vector3(0.8, 0.8, 0.8); // lower this to darken
colorCorrectionPass.uniforms['mulRGB'].value = new THREE.Vector3(1.3, 1.3, 1.3); // increase this to raise contrast
composer.addPass(colorCorrectionPass);
composer.setSize(renderer.getSize(new THREE.Vector2()).width, renderer.getSize(new THREE.Vector2()).height);

const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  //composer.setSize(width, height);

window.addEventListener('resize', function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  //composer.setSize(width, height);
}, false);






camera.position.setZ(10);
camera.position.setX(-10);


// Fog setup
scene.fog = new THREE.Fog(0x4537DE, 0.5, 80);
const lightDistance = 10;


// Define an array of warm colors
const warmColors = [
  0xffa800, // Orange
  0xff4500, // Red-orange
  0xffff00, // Yellow
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

const navTargets = {
  'About': 10.22, 
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
function createPointLight(color, intensity, distance, position, lightIntensity = 10) {
  const housePointLight = new THREE.PointLight(color, intensity, distance);
  housePointLight.position.set(...position);
  housePointLight.intensity = lightIntensity;
  housePointLight.distance = lightDistance;

  scene.add(housePointLight);
  return housePointLight;
}
// Lights
const pointLight = new THREE.PointLight(getRandomWarmColor(), 0.2, 100); // Warm point light
pointLight.position.set(10, 10, 10);
pointLight.intensity = 2;
scene.add(pointLight);

const lights = 
{

  'house1': createPointLight(getRandomWarmColor(), 0.2, 100, lightLocations[0]),
  'house2': createPointLight(getRandomWarmColor(), 0.2, 100, lightLocations[1]),
  'house3': createPointLight(getRandomWarmColor(), 0.2, 100, lightLocations[2]),
  'house4': createPointLight(getRandomWarmColor(), 0.2, 100, lightLocations[3], 5),
  'house5': createPointLight(getRandomWarmColor(), 0.2, 100, lightLocations[4], 2),
  'house6': createPointLight(getRandomWarmColor(), 0.2, 100, lightLocations[5], 2)
}

const ambientLight = new THREE.AmbientLight(0x202020, 0.3); // Dimmed ambient light
scene.add(pointLight, ambientLight);

// Replace your PointLight with a DirectionalLight
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
ambientLight.color.set(0x404040);
ambientLight.intensity = 0.5;
// Background

const spaceTexture = new THREE.TextureLoader().load('nightsky.png');
scene.background = spaceTexture;

const loader = new GLTFLoader();
const dLoader = new DRACOLoader();
dLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
dLoader.setDecoderConfig({type: 'js'});
loader.setDRACOLoader(dLoader);
let degrees = 20; 
//ForestPortfolioInvertedFinal.gltf
loader.load(
  'ForestPathPortfolioCompressed.glb', 
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

for(let i = 0; i < 50; i++){ // 50 fireflies
  const fireflyObject = createFirefly(scene);
  fireflies.push(fireflyObject);
}
  function moveCameraOnScroll() 
{
  const t = document.body.getBoundingClientRect().top;
  
  let targetZ = 10 - t * 0.005;
  
  // Check the limits
  if (targetZ < minScrollZ) targetZ = minScrollZ;
  if (targetZ > maxScrollZ) targetZ = maxScrollZ;
  
  if (cameraTargetZ === undefined && Math.abs(camera.position.z - targetZ) > 0.01) {
    camera.position.z += (targetZ - camera.position.z) * 0.05; // Adjust the 0.05 value to control the speed of the movement
  }
}



let cameraTargetZ;
let minScrollZ = 0;  // set the minimum distance here
let maxScrollZ = 75; // set the maximum distance here

// Select elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const leafBg = document.getElementById('leafBg');


navToggle.addEventListener('click', () => {
  navbar.classList.toggle('active');

  
});


document.body.onscroll = moveCameraOnScroll;

function moveCameraToTarget() {
  if (cameraTargetZ !== undefined && Math.abs(camera.position.z - cameraTargetZ) > 0.001) {  // Reduced the threshold
    camera.position.z += (cameraTargetZ - camera.position.z) * 0.05; // Adjust the 0.05 value to control the speed of the movement
  } else if (cameraTargetZ !== undefined && Math.abs(camera.position.z - cameraTargetZ) <= 0.001) {
    cameraTargetZ = undefined;
  }
}

function updateFireflies() {
  fireflies.forEach(({firefly, fireflyLight, velocity}) => {
    
      firefly.position.add(velocity);
      fireflyLight.position.copy(firefly.position);
      

      // Boundary checks
      if (firefly.position.x < -10 || firefly.position.x > 10) velocity.x = -velocity.x;
      if (firefly.position.y < -10 || firefly.position.y > 10) velocity.y = -velocity.y;
      if (firefly.position.z < -10 || firefly.position.z > 10) velocity.z = -velocity.z;

      // Flicker effect
      fireflyLight.intensity = 0.8 + Math.sin(Date.now() * 0.005) * 0.2;
  });
}
// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  updateFireflies();

console.log('Number of draw calls:', renderer.info.render.calls);
  renderer.render(scene, camera);

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

