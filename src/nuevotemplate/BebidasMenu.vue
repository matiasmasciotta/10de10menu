<script setup>
import { computed, onMounted } from 'vue';
import { useMenuData } from './useMenuData';
import fondo from '@/assets/fondo_bebidas_2.png';

const { orderedSections, isLoading, error, fetchMenuData } = useMenuData();

const col1Categories = [
  'CERVEZA ARTESANAL',
  'VINOS',
  'BEBIDAS SIN ALCOHOL',
  'TRAGOS'
];

const col2Categories = [
  'JARRAS LOCAS',
  'JARRAS FAMILIARES',
  'POSTRES',
  'CAFETERÍA'
];

onMounted(() => {
  if (orderedSections.value.length === 0) {
    fetchMenuData();
  }
});

const col1Sections = computed(() => {
  return orderedSections.value.filter(section => 
    col1Categories.includes(section.title.toUpperCase())
  );
});

const col2Sections = computed(() => {
  return orderedSections.value.filter(section => 
    col2Categories.includes(section.title.toUpperCase())
  );
});

const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(price) || price === 0) return '';
  return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0 }).format(price);
};
</script>

<template>
  <div class="menu-viewport">
    <div v-if="isLoading" class="text-center text-white text-2xl py-20 absolute inset-0 flex items-center justify-center">
      Cargando menú de bebidas...
    </div>
    
    <div v-else-if="error" class="text-center text-red-500 text-2xl py-20 absolute inset-0 flex items-center justify-center">
      {{ error }}
    </div>

    <!-- Contenedor A4 Fluido -->
    <div v-else class="a4-menu" :style="{ backgroundImage: `url(${fondo})` }">
      <!-- Espacio del Header (logo, titulo) -->
      <div class="header-space"></div>

      <div class="menu-columns">
        <!-- Columna 1 -->
        <div class="menu-col col-left">
          <div v-for="section in col1Sections" :key="section.title" class="menu-section">
            <h2 class="section-title">
              {{ section.title }}
            </h2>
            <div class="items-container">
              <div v-for="item in section.items" :key="item.name" class="menu-item-row">
                <div class="item-info">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <p v-if="item.description" class="item-desc">{{ item.description }}</p>
                </div>
                <span class="dots"></span>
                <span class="item-price" v-if="formatPrice(item.price)">
                  ${{ formatPrice(item.price) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna 2 -->
        <div class="menu-col col-right">
          <div v-for="section in col2Sections" :key="section.title" class="menu-section">
            <h2 class="section-title">
              {{ section.title }}
            </h2>
            <div class="items-container">
              <div v-for="item in section.items" :key="item.name" class="menu-item-row">
                <div class="item-info">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <p v-if="item.description" class="item-desc">{{ item.description }}</p>
                </div>
                <span class="dots"></span>
                <span class="item-price" v-if="formatPrice(item.price)">
                  ${{ formatPrice(item.price) }}
                </span>
              </div>
            </div>
          </div>
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
  /* Caja con aspect-ratio fluido que se ajusta a la ventana pero escala como imagen */
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

/* Fallback para cuando la altura no es el limitante (ej: pantallas muy angostas) */
@media (max-aspect-ratio: 1240/1754) {
  .a4-menu {
    max-width: 100vw;
    height: auto;
    aspect-ratio: 1240 / 1754;
  }
}

.header-space {
  height: 33cqw; /* Espacio para el logo aumentado para bajar el menú de bebidas 1cm */
  width: 100%;
}

.menu-columns {
  display: flex;
  width: 100%;
  height: calc(100% - 33cqw);
}

.menu-col {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.col-left {
  padding-left: 5cqw;
  padding-right: 2cqw;
}

.col-right {
  padding-left: 2cqw;
  padding-right: 5cqw;
}

.menu-section {
  margin-bottom: 1.6cqw; /* Acerca un poco más las secciones */
}

.section-title {
  font-family: 'Permanent Marker', cursive;
  font-size: 2.5cqw;
  color: #ff4500;
  letter-spacing: 0.1cqw;
  transform: rotate(-2deg);
  margin-bottom: 0.8cqw;
  /* Quitamos el fondo y borde para que se integre con los brochazos de la imagen */
  display: inline-block;
  line-height: 1;
}

.items-container {
  display: flex;
  flex-direction: column;
  gap: 0.4cqw; /* Menos espacio entre ítems (ayuda a los que no tienen subtítulo) */
}

.menu-item-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  width: 100%;
}

.item-info {
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

.item-name {
  font-size: 1.3cqw; /* Volvemos a achicar un poco el producto */
  font-weight: bold;
  letter-spacing: 0.05cqw;
  line-height: 1.1;
  font-family: sans-serif;
}

.item-desc {
  font-size: 1.05cqw; /* Agrandamos el subtítulo para legibilidad */
  color: #d1d5db; /* gray-300 */
  line-height: 1.1;
  margin-top: 0.2cqw;
  font-family: sans-serif;
  font-style: italic;
}

.dots {
  flex-grow: 1;
  border-bottom: 0.2cqw dotted rgba(255, 255, 255, 0.4);
  margin-bottom: 0.4cqw;
  min-width: 1cqw;
  margin-left: 0.5cqw;
}

.item-price {
  font-size: 1.5cqw;
  font-weight: bold;
  color: #ff4500;
  margin-left: 0.5cqw;
  font-family: sans-serif;
}
</style>
