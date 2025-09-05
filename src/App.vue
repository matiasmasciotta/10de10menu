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
          price: item.PRECIO
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

// Agrupa las secciones respetando el orden de aparición en el CSV
const orderedSections = computed(() => {
  const sectionsInOrder = [];
  const sectionMap = {}; // Para acceso rápido a las secciones ya creadas

  menuItems.value.forEach(item => {
    if (!item.category) return;

    const categoryTitle = item.category;

    // Si es la primera vez que vemos esta categoría, la creamos y la guardamos
    if (!sectionMap[categoryTitle]) {
      const newSection = {
        title: categoryTitle,
        icon: item.icon, // Usamos el ícono del primer item que la define
        items: []
      };
      sectionMap[categoryTitle] = newSection;
      sectionsInOrder.push(newSection);
    }

    // Agregamos el item a su sección correspondiente
    sectionMap[categoryTitle].items.push(item);
  });

  return sectionsInOrder;
});

// Distribuye las secciones en exactamente 4 columnas para A4 horizontal
const columns = computed(() => {
    const columnsData = [[], [], [], [], []]; // Exactamente 5 columnas fijas
    const sections = orderedSections.value;
    let currentColumn = 0;
    let currentColumnHeight = 0;
    
    // Altura máxima por columna para A4 horizontal (21cm alto)
    const maxColumnHeight = 15; // Ajustado para 21cm de altura
    
    sections.forEach((section) => {
        // Calcular altura estimada de esta sección (título + ítems)
        const sectionHeight = 2 + section.items.length;
        
        // Si agregar esta sección excede la altura máxima, pasar a siguiente columna
        if (currentColumnHeight + sectionHeight > maxColumnHeight && currentColumnHeight > 0) {
            currentColumn++;
            // Si llegamos al final de las 5 columnas, seguir llenando la última
            if (currentColumn >= 5) {
                currentColumn = 4;
            } else {
                currentColumnHeight = 0;
            }
        }
        
        // Agregar la sección a la columna actual
        columnsData[currentColumn].push(section);
        currentColumnHeight += sectionHeight;
    });

    return columnsData;
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
            <header class="relative py-6 overflow-hidden">
      <!-- Layout Mobile: centrado vertical -->
      <div class="lg:hidden flex flex-col items-center text-center">
        <h1 class="font-bebas text-7xl md:text-8xl text-brand-yellow tracking-wider flex items-center justify-center">
          <span class="-mr-2">MENU</span>
        </h1>
        <div class="relative my-4">
          <img :src="logo" alt="Logo 10 de 10" class="h-56 w-auto" />
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

      <!-- Layout Desktop: fila superior con MENU y logo -->
      <div class="hidden lg:flex items-center justify-between py-6 px-2 sm:px-4 lg:px-6 border-b border-gray-600">
        <h1 class="font-bebas text-6xl text-brand-yellow tracking-wider">
          <span>MENU</span>
        </h1>
        <div class="relative">
          <img :src="logo" alt="Logo 10 de 10" class="h-32 w-auto" />
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

    <main class="container mx-auto py-4">
      <!-- Estado de Carga -->
      <div v-if="isLoading" class="text-center text-2xl text-gray-400">
        Cargando menú...
      </div>

      <!-- Estado de Error -->
      <div v-else-if="error" class="text-center text-2xl text-red-500">
        {{ error }}
      </div>

      <!-- Contenido del Menú -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-4 md:gap-x-8 lg:gap-x-16 gap-y-6 px-1 sm:px-2 lg:px-4 pt-6">
        <!-- Columnas del menú -->
        <div v-for="(column, colIndex) in columns" :key="colIndex" class="space-y-6">
          <!-- Secciones del menú -->
          <div v-for="section in column" :key="section.title" class="w-full">
                        <div :class="['section-title-wrapper w-full', { 'bg-yellow-400 text-black rounded-lg p-2': section.title === 'MENÚ INFANTIL' }]">
                            <h2 :class="['font-bebas text-2xl lg:text-3xl tracking-wide flex items-center justify-center w-full', { 'ribbon': section.title !== 'MENÚ INFANTIL' }]">
                <span v-if="section.icon && section.title !== 'MENÚ INFANTIL'" class="mr-4 whitespace-pre">{{ section.icon }}</span>
                <span class="title-text">{{ section.title }}</span>
              </h2>
            </div>
            
            <!-- Items de la sección -->
            <div class="space-y-4 mt-4">
              <div v-for="item in section.items" :key="item.name">
                                <!-- Item con precio -->
                <div v-if="item.price !== null && item.price !== undefined" class="menu-item">
                  <div class="flex-shrink-0 max-w-[70%]">
                    <h3 class="text-xl">{{ item.name }}</h3>
                    <p v-if="item.description" class="text-sm text-gray-400 italic">{{ item.description }}</p>
                  </div>
                  <span class="dots"></span>
                  <span class="menu-item-price">${{ formatPrice(item.price) }}</span>
                </div>

                <!-- Item sin precio (ej. un subtítulo de sección) -->
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
  padding: 0.5rem 1rem;
  width: 100%;
  box-sizing: border-box;
  overflow: visible;
  display: block;
  margin: 0;
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
  content: '';
  position: absolute;
  top: 0;
  left: -15px; /* Ancho del triángulo */
  border-width: 28px 15px 28px 0; /* Ajusta la altura del triángulo (28px*2 = 56px) */
  border-style: solid;
  border-color: transparent #F59E0B transparent transparent;
}

/* Triángulo derecho solo en desktop */
@media (min-width: 1024px) {
  .ribbon::after {
    content: '';
    position: absolute;
    top: 0;
    right: -15px; /* Ancho del triángulo */
    border-width: 28px 0 28px 15px; /* Triángulo invertido */
    border-style: solid;
    border-color: transparent transparent transparent #F59E0B;
  }
}

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
