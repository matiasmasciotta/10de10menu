<script setup>
import fondo from '@/assets/fondo_solo.png';
import qrImage from '@/assets/qr_resen.png';
</script>

<template>
  <div class="menu-viewport">
    <!-- Contenedor A4 Fluido -->
    <div class="a4-menu" :style="{ backgroundImage: `url(${fondo})` }">
      
      <div class="review-content">
        <h2 class="section-title text-center">
          ¡Dejanos tu reseña!
        </h2>
        
        <div class="qr-container">
          <img :src="qrImage" alt="QR para reseña" class="qr-image" />
        </div>
        
        <div class="link-container">
          <p class="text-white font-sans italic">o directamente tocando aquí</p>
          <a 
            href="https://search.google.com/local/writereview?placeid=ChIJYVRalubJvJURdNHMMdkfa5I&utm_source=chatgpt.com" 
            target="_blank" 
            class="review-button"
          >
            Escribir Reseña
          </a>
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');

.menu-viewport {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #050505;
}

.a4-menu {
  width: 100%;
  max-width: calc(100vh * (1240 / 1754));
  aspect-ratio: 1240 / 1754;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  container-type: inline-size;
  color: white;
  margin: 0 auto;
}

@media (max-aspect-ratio: 1240/1754) {
  .a4-menu {
    max-width: 100vw;
    height: auto;
    aspect-ratio: 1240 / 1754;
  }
}

.review-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 5cqw;
}

.section-title {
  font-family: 'Permanent Marker', cursive;
  font-size: 8cqw;
  color: #ff4500;
  letter-spacing: 0.2cqw;
  transform: rotate(-3deg);
  margin-bottom: 2cqw;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

.qr-container {
  padding: 2.5cqw;
  background-color: white;
  border-radius: 3cqw;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5), 0 0 20px rgba(255, 69, 0, 0.4);
  transform: rotate(2deg);
  transition: transform 0.3s ease;
}

.qr-container:hover {
  transform: scale(1.05) rotate(0deg);
}

.qr-image {
  width: 45cqw;
  height: auto;
  border-radius: 1.5cqw;
  display: block;
}

.link-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2cqw;
}

.link-container p {
  font-size: 2.5cqw;
  color: #d1d5db;
  margin-bottom: 2cqw;
}

.review-button {
  background-color: #ff4500;
  color: white;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 3cqw;
  padding: 2cqw 6cqw;
  border-radius: 4cqw;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(255, 69, 0, 0.4);
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.review-button:hover {
  background-color: #e63e00;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 69, 0, 0.6);
}
</style>
