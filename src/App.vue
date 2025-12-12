<script setup>
import { ref, computed, onMounted } from 'vue';
import Papa from 'papaparse';
import logo from '@/assets/10de10 png .png';
import backgroundImageUrl from '@/assets/fondo-idolos.jpg';

// URL del Google Sheet publicado como CSV
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSzERRdV7V1KNNuAznk70gSInUUV-0mNSfoVDnmKbp-9wHY0SJUdG5NixiJ5y7CZTxImfHKPWo-0qwx/pub?gid=0&single=true&output=csv';

// Estados para manejar la carga y errores
const menuItems = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Hook que se ejecuta cuando el componente se monta
onMounted(() => {
  Papa.parse(GOOGLE_SHEET_URL, {
    download: true, // Descarga el archivo de la URL
    header: true,   // Usa la primera fila como cabeceras
    dynamicTyping: true, // Convierte números y booleanos automáticamente
    // Limpiamos los nombres de las cabeceras antes de procesar
    transformHeader: header => header.trim().toUpperCase(),
    complete: (results) => {
      console.log('Datos recibidos del CSV:', results.data);
      menuItems.value = results.data
        .filter(item => {
          // Si APAGAR no existe, es null, está vacío o no es 'si' (case-insensitive), mantener el ítem
          return !item.APAGAR || item.APAGAR.trim().toUpperCase() !== 'SI';
        }) // Filtrar ítems con APAGAR = 'SI' (case-insensitive)
        .map(item => ({
          order: item.SECCION,
          category: item.TITULO ? item.TITULO.trim() : '',
          icon: item.ICONO,
          name: item.PRODUCTO,
          description: item.SUBTITULO,
          price: item.PRECIO,
          priceSimple: item.PRECIO_SIMPLE,
          priceDouble: item.PRECIO_DOBLE,
          priceTriple: item.PRECIO_TRIPLE
        }))
        .filter(item => item.category && item.name); // Filtrar ítems sin categoría o nombre
      isLoading.value = false;
    },
    error: (err) => {
      console.error('Error al cargar o procesar el menú:', err);
      error.value = 'No se pudo cargar el menú. Intente de nuevo más tarde.';
      isLoading.value = false;
    }
  });
});

// Agrupa las secciones en 5 columnas específicas
const columnsData = computed(() => {
  // Inicializamos las 5 columnas vacías
  const columns = [[], [], [], [], []];
  
  // Mapa de asignación de categorías a columnas (basado en el diseño deseado)
  // Columna 1: Entradas, Picadas, Platos
  // Columna 2: Hamburguesas (Más ancha)
  // Columna 3: Parrilla, Vinos
  // Columna 4: Cerveza, Tragos
  // Columna 5: Bebidas, Postres, Cafeteria
  
  const sectionMap = {}; // Para acceso rápido a las secciones ya creadas

  menuItems.value.forEach(item => {
    if (!item.category) return;

    const categoryTitle = item.category;

    // Si es la primera vez que vemos esta categoría, la creamos
    if (!sectionMap[categoryTitle]) {
      const newSection = {
        title: categoryTitle,
        icon: item.icon,
        items: []
      };
      sectionMap[categoryTitle] = newSection;

      // Asignar a la columna correspondiente
      const titleUpper = categoryTitle.toUpperCase();
      let columnIndex = 0; // Default a col 1

      if (titleUpper.includes('HAMBURGUESA')) {
        columnIndex = 1; // Col 2
      } else if (titleUpper.includes('PARRILLA')) {
        columnIndex = 2; // Col 3
      } else if (titleUpper.includes('CERVEZA') || titleUpper.includes('TRAGO') || titleUpper.includes('VINO')) {
        columnIndex = 3; // Col 4
      } else if (titleUpper.includes('BEBIDA') || titleUpper.includes('POSTRE') || titleUpper.includes('CAFETER') || titleUpper.includes('MENU DEL DÍA') || titleUpper.includes('MENÚ DEL DÍA') || titleUpper.includes('MENU DEL DIA')) {
        columnIndex = 4; // Col 5
      } else {
        columnIndex = 0; // Col 1 (Entradas, Picadas, Platos, etc.)
      }
      
      columns[columnIndex].push(newSection);
    }

    // Agregamos el item a su sección correspondiente
    sectionMap[categoryTitle].items.push(item);
  });

  return columns;
});

// Función para formatear el precio
const formatPrice = (price) => {
  if (price === null || price === undefined) return '';
  return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0 }).format(price);
};

</script>

<template>
  <div 
    class="bg-brand-dark text-white min-h-screen font-sans background-container overflow-x-hidden"
    :style="{ '--background-image-url': `url(${backgroundImageUrl})` }"
  >
            <header class="relative py-4 overflow-hidden">
      <!-- Layout Mobile: centrado vertical -->
      <div class="lg:hidden flex flex-col items-center text-center">
        <h1 class="font-bebas text-6xl md:text-7xl text-brand-yellow tracking-wider flex items-center justify-center">
          <span class="-mr-2">MENÚ</span>
        </h1>
        <div class="relative my-2">
          <img :src="logo" alt="Logo 10 de 10" class="h-48 w-auto" />
          <div class="smoke-container">
            <span class="smoke-particle-1"></span>
            <span class="smoke-particle-2"></span>
            <span class="smoke-particle-3"></span>
            <span class="smoke-particle-4"></span>
            <span class="smoke-particle-5"></span>
            <span class="smoke-particle-6"></span>
          </div>
        </div>
      </div>

      <!-- Layout Desktop: fila superior con MENU y logo centrados -->
      <div class="hidden lg:flex items-center justify-center py-4 px-2 sm:px-4 lg:px-6 border-b border-gray-600 gap-6">
        <h1 class="font-bebas text-8xl text-brand-yellow tracking-wider">
          <span>MENÚ</span>
        </h1>
        <div class="relative flex justify-center">
          <img :src="logo" alt="Logo 10 de 10" class="h-40 w-auto" />
          <div class="smoke-container">
            <span class="smoke-particle-1"></span>
            <span class="smoke-particle-2"></span>
            <span class="smoke-particle-3"></span>
            <span class="smoke-particle-4"></span>
            <span class="smoke-particle-5"></span>
            <span class="smoke-particle-6"></span>
          </div>
        </div>
      </div>

    </header>

    <main class="w-full max-w-[95%] mx-auto py-1">
      <!-- Estado de Carga -->
      <div v-if="isLoading" class="text-center text-2xl text-gray-400">
        Cargando menú...
      </div>

      <!-- Estado de Error -->
      <div v-else-if="error" class="text-center text-2xl text-red-500">
        {{ error }}
      </div>

      <!-- Contenido del Menú -->
      <!-- Contenido del Menú con Columnas Dinámicas -->
      <!-- Contenido del Menú con Grid Layout -->
      <div v-else class="grid gap-8 lg:gap-10 w-full items-start custom-grid">
        <!-- Iteramos sobre las 5 columnas -->
        <div 
          v-for="(column, index) in columnsData" 
          :key="index" 
          class="flex flex-col gap-8"
        >
          <div v-for="section in column" :key="section.title" class="w-full">
            <div :class="['section-title-wrapper w-full', { 'bg-yellow-400 text-black rounded-lg p-2': section.title === 'MENÚ INFANTIL' }]">
              <h2 :class="['font-bebas text-2xl lg:text-3xl tracking-wide flex items-center justify-center w-full', { 'ribbon': section.title !== 'MENÚ INFANTIL' }]">
                <span v-if="section.icon && section.title !== 'MENÚ INFANTIL'" class="mr-4 whitespace-pre">{{ section.icon }}</span>
                <span class="title-text">{{ section.title }}</span>
              </h2>
            </div>
            
            <!-- Items de la sección -->
            <div class="space-y-4 mt-4">
              <!-- Header de Precios para Hamburguesas (Solo Desktop) -->
              <div v-if="section.title.toUpperCase().includes('HAMBURGUESA')" class="hidden lg:flex justify-end text-xs text-brand-yellow font-bold italic mb-2">
                <span class="w-20 text-center">SIMPLE</span>
                <span class="w-20 text-center">DOBLE</span>
                <span class="w-20 text-center">TRIPLE</span>
              </div>

              <div v-for="item in section.items" :key="item.name">
                
                <!-- Item de Variantes (SOLO HAMBURGUESAS) -->
                <div v-if="(item.priceSimple || item.priceDouble || item.priceTriple) && section.title.toUpperCase().includes('HAMBURGUESA')" class="menu-item-variant">
                  <!-- Mobile View -->
                  <div class="lg:hidden">
                    <div class="flex justify-between items-baseline mb-1">
                      <h3 class="text-xl">{{ item.name }}</h3>
                    </div>
                    <p v-if="item.description" class="text-sm text-gray-400 italic mb-2">{{ item.description }}</p>
                    
                    <!-- Price Cards Container (Full Width) -->
                    <div class="flex w-full gap-2 mt-1">
                      <div v-if="item.priceSimple" class="flex-1 flex flex-col items-center bg-gray-800 rounded p-1">
                        <span class="text-[10px] text-brand-yellow italic">SIMPLE</span>
                        <span class="font-bold text-sm">${{ formatPrice(item.priceSimple) }}</span>
                      </div>
                      <div v-if="item.priceDouble" class="flex-1 flex flex-col items-center bg-gray-800 rounded p-1">
                        <span class="text-[10px] text-brand-yellow italic">DOBLE</span>
                        <span class="font-bold text-sm">${{ formatPrice(item.priceDouble) }}</span>
                      </div>
                      <div v-if="item.priceTriple" class="flex-1 flex flex-col items-center bg-gray-800 rounded p-1">
                        <span class="text-[10px] text-brand-yellow italic">TRIPLE</span>
                        <span class="font-bold text-sm">${{ formatPrice(item.priceTriple) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Desktop View -->
                  <div class="hidden lg:flex justify-between items-baseline">
                    <div class="flex-grow pr-4">
                      <h3 class="text-xl">{{ item.name }}</h3>
                      <p v-if="item.description" class="text-sm text-gray-400 italic">{{ item.description }}</p>
                    </div>
                    <div class="flex gap-0">
                      <div class="w-20 text-center font-bold">
                        {{ item.priceSimple ? '$' + formatPrice(item.priceSimple) : '-' }}
                      </div>
                      <div class="w-20 text-center font-bold">
                        {{ item.priceDouble ? '$' + formatPrice(item.priceDouble) : '-' }}
                      </div>
                      <div class="w-20 text-center font-bold">
                        {{ item.priceTriple ? '$' + formatPrice(item.priceTriple) : '-' }}
                      </div>
                    </div>
                  </div>
                  <div class="hidden lg:block border-b border-gray-700 mt-2"></div>
                </div>

                <!-- Item Normal con precio -->
                <div v-else-if="item.price !== null && item.price !== undefined" class="menu-item">
                  <div class="flex-shrink-0 max-w-[70%]">
                    <h3 class="text-xl">{{ item.name }}</h3>
                    <p v-if="item.description" class="text-sm text-gray-400 italic">{{ item.description }}</p>
                  </div>
                  <span class="dots"></span>
                  <span class="menu-item-price">${{ formatPrice(item.price) }}</span>
                </div>

                <!-- Item sin precio -->
                <div v-else class="menu-item-no-price">
                  <h3 class="text-xl">{{ item.name }}</h3>
                  <p v-if="item.description" class="text-sm text-gray-400 italic">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
.ribbon {
  position: relative;
  background-color: #F59E0B; /* brand-yellow */
  color: #121212; /* brand-dark */
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  width: calc(100% + 15px);
  box-sizing: border-box;
  overflow: visible;
  display: block;
  margin: 0;
  margin-right: -15px;
}

@media (max-width: 767px) {
  .ribbon {
    width: 100vw; /* Ancho total de la pantalla */
    margin-left: 50%;
    transform: translateX(-50%);
    border-radius: 0;
    box-sizing: border-box; /* Asegura que el padding se incluya en el ancho */
  }

  .ribbon::before {
    /* Ocultamos el triángulo en la vista de ancho completo para un look de banda */
    content: none;
  }
}

.smoke-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Para que no interfiera con los clics */
}

[class^="smoke-particle-"] {
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 85px;
  height: 85px;
  background: rgba(245, 158, 11, 0.25); /* Intensidad media */
  border-radius: 50%;
  filter: blur(12px); /* Desenfoque intermedio */
  box-shadow: 0 0 15px 8px rgba(239, 68, 68, 0.15); /* Brillo más sutil */
  animation: flame-animation 5s ease-in-out infinite; /* Velocidad intermedia */
}

.smoke-particle-2 { animation-delay: -1s; left: 40%; transform: scale(0.8); }
.smoke-particle-3 { animation-delay: -2s; left: 60%; transform: scale(1.2); }
.smoke-particle-4 { animation-delay: -3s; left: 45%; transform: scale(0.9); }
.smoke-particle-5 { animation-delay: -4s; left: 55%; transform: scale(1.1); }
.smoke-particle-6 { animation-delay: -5s; left: 50%; transform: scale(1); }

.background-container {
  position: relative;
  z-index: 1;
}

.background-container::before {
  content: '';
  position: fixed !important; /* Clave para el efecto parallax */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: var(--background-image-url) !important;
  background-repeat: repeat !important;
  background-size: 350px !important; /* Tamaño optimizado para desktop y mobile */
  opacity: 0.3 !important; /* Opacidad más visible para desktop */
  z-index: -1 !important;
}

@keyframes flame-animation {
  0% {
    transform: translate(-50%, 0) scale(0.6);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -200px) scale(1.8);
    opacity: 0.75;
  }
  100% {
    transform: translate(-50%, -400px) scale(2.8);
    opacity: 0;
  }
}

.ribbon::before {
  content: none;
}

/* Triángulo derecho eliminado */

.ribbon .title-text {
  position: relative;
  z-index: 1;
}

/* Estilos para el menú infantil, para que no tome los del ribbon */
.bg-yellow-400.text-black.rounded-lg.p-2 .ribbon {
  background-color: transparent;
  color: inherit;
  padding: 0;
  margin-left: 0;
}
.bg-yellow-400.text-black.rounded-lg.p-2 .ribbon::before {
  content: none;
}

</style>

<style scoped>
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}

.dots {
  flex-grow: 1;
  border-bottom: 2px dotted #4A5568; /* gray-600 */
  margin-bottom: 0.25rem;
}

.menu-item-price {
  white-space: nowrap;
  font-weight: bold;
}

.section-title-wrapper {
  display: inline-block;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .font-bebas.text-8xl {
    font-size: 4rem; /* 64px */
  }
  .font-bebas.text-5xl {
    font-size: 2.5rem; /* 40px */
  }
  .text-xl {
    font-size: 1.125rem; /* 18px */
  }
}
</style>
