<script setup>
import { ref, computed, onMounted } from 'vue';
import Papa from 'papaparse';
import logo from './assets/10de10 png .png';

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
      menuItems.value = results.data.map(item => ({
        order: item.SECCION,
        category: item.TITULO,
        icon: item.ICONO,
        name: item.PRODUCTO,
        description: item.SUBTITULO,
        price: item.PRECIO
      })).filter(item => item.category && item.name);
      isLoading.value = false;
    },
    error: (err) => {
      console.error('Error al cargar o procesar el menú:', err);
      error.value = 'No se pudo cargar el menú. Intente de nuevo más tarde.';
      isLoading.value = false;
    }
  });
});

// Agrupa y ordena las secciones según el número de SECCION
const orderedSections = computed(() => {
  const sections = {};
  // Agrupar items por categoría
  menuItems.value.forEach(item => {
    if (!item.category) return;
    if (!sections[item.category]) {
      sections[item.category] = {
        title: item.category,
        order: item.order,
        icon: item.icon,
        items: []
      };
    }
    sections[item.category].items.push(item);
  });

  // Convertir el objeto a un array y ordenarlo por el número de 'order'
  return Object.values(sections).sort((a, b) => a.order - b.order);
});

// Distribuye las secciones ordenadas en 3 columnas
const columns = computed(() => {
    const columnsData = [[], [], []];
    const sections = orderedSections.value;

    // Lógica de distribución mejorada para balancear las columnas
    const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0);
    const itemsPerColumn = Math.ceil(totalItems / 3);

    let currentColumn = 0;
    let currentColumnItems = 0;

    sections.forEach(section => {
        columnsData[currentColumn].push(section);
        currentColumnItems += section.items.length;

        if (currentColumn < 2 && currentColumnItems >= itemsPerColumn) {
            currentColumn++;
            currentColumnItems = 0;
        }
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
  <div class="bg-brand-dark text-white min-h-screen font-sans">
            <header class="relative flex flex-col items-center text-center py-8 bg-black bg-opacity-50 overflow-hidden">
      <h1 class="font-bebas text-7xl md:text-8xl text-brand-yellow tracking-wider flex items-center justify-center">
        <span class="-mr-2">10</span>
        <span class="text-4xl md:text-5xl mx-1">de</span>
        <span class="-ml-2">10</span>
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

      <p class="text-xl md:text-2xl text-gray-300">Cervecería & Parrilla</p>
    </header>

    <main class="container mx-auto py-8">
      <!-- Estado de Carga -->
      <div v-if="isLoading" class="text-center text-2xl text-gray-400">
        Cargando menú...
      </div>

      <!-- Estado de Error -->
      <div v-else-if="error" class="text-center text-2xl text-red-500">
        {{ error }}
      </div>

      <!-- Contenido del Menú -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8 px-4 sm:px-6 lg:px-8">
        <!-- Columnas del menú -->
        <div v-for="(column, colIndex) in columns" :key="colIndex" class="space-y-8">
          <!-- Secciones del menú -->
          <div v-for="section in column" :key="section.title">
                        <div :class="['section-title-wrapper', { 'bg-yellow-400 text-black rounded-lg p-2': section.title === 'MENÚ INFANTIL' }]">
                            <h2 :class="['font-bebas text-5xl tracking-wide flex items-center justify-center', { 'ribbon': section.title !== 'MENÚ INFANTIL' }]">
                <span v-if="section.icon && section.title !== 'MENÚ INFANTIL'" class="mr-4">{{ section.icon }}</span>
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
  padding: 0.5rem 1.5rem;
  width: 100%;
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
  bottom: 0;
  left: 50%;
  width: 100px;
  height: 100px;
  background: rgba(245, 158, 11, 0.15); /* Tono anaranjado, más intenso */
  border-radius: 50%;
  filter: blur(15px); /* Un poco menos borroso */
  animation: smoke-animation 6s linear infinite; /* Animación más rápida */
}

.smoke-particle-2 { animation-delay: -2s; left: 40%; transform: scale(0.8); }
.smoke-particle-3 { animation-delay: -4s; left: 60%; transform: scale(1.2); }
.smoke-particle-4 { animation-delay: -6s; left: 45%; transform: scale(0.9); }
.smoke-particle-5 { animation-delay: -8s; left: 55%; transform: scale(1.1); }
.smoke-particle-6 { animation-delay: -10s; left: 50%; transform: scale(1); }

@keyframes smoke-animation {
  0% {
    transform: translate(-50%, 0) scale(0.8);
    opacity: 0;
  }
  20% {
    opacity: 0.7;
  }
  100% {
    transform: translate(-50%, -250px) scale(2);
    opacity: 0;
  }
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
