<script setup>
import { ref, computed, onMounted } from 'vue';
import Papa from 'papaparse';

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
    complete: (results) => {
      // Mapeamos los datos del CSV a la estructura que necesita nuestro componente
      menuItems.value = results.data.map(item => ({
        category: item.TITULO,
        icon: item.ICONO,
        name: item.PRODUCTO,
        description: item.SUBTITULO,
        price: item.PRECIO
      })).filter(item => item.category && item.name); // Filtramos filas vacías
      isLoading.value = false;
    },
    error: (err) => {
      console.error('Error al cargar o procesar el menú:', err);
      error.value = 'No se pudo cargar el menú. Intente de nuevo más tarde.';
      isLoading.value = false;
    }
  });
});

// Agrupa los items por categoría
const menuSections = computed(() => {
  const sections = {};
  menuItems.value.forEach(item => {
    if (!sections[item.category]) {
      sections[item.category] = {
        title: item.category,
        icon: item.icon,
        items: []
      };
    }
    sections[item.category].items.push(item);
  });
  return sections;
});

// Define la estructura de las columnas de forma dinámica
const columns = computed(() => {
    const sections = menuSections.value;
    
    // Lista de categorías para mantener un orden preferido
    const preferredOrder = [
      'ENTRADAS', 'MODO BAJON', 'MENÚ INFANTIL', 'PARRILLA', 'HAMBURGUESAS', 
      'BEBIDAS SIN ALCOHOL', 'CERVEZAS', 'VINOS/TRAGOS', 'POSTRES'
    ];

    // Obtener todos los títulos de las secciones disponibles
    const availableTitles = Object.keys(sections);

    // Ordenar los títulos: primero los del orden preferido, y los nuevos al final
    const orderedTitles = availableTitles.sort((a, b) => {
        const indexA = preferredOrder.indexOf(a.toUpperCase());
        const indexB = preferredOrder.indexOf(b.toUpperCase());

        if (indexA !== -1 && indexB !== -1) return indexA - indexB; // Ambos en la lista, usar orden
        if (indexA !== -1) return -1; // Solo A está en la lista, A va primero
        if (indexB !== -1) return 1;  // Solo B está en la lista, B va primero
        return a.localeCompare(b); // Ninguno está en la lista, ordenar alfabéticamente
    });

    const orderedSections = orderedTitles.map(title => sections[title]);

    // Ahora, distribuimos las secciones dinámicamente en 3 columnas
    const columnsData = [[], [], []];
    let colIndex = 0;
    orderedSections.forEach(section => {
        columnsData[colIndex].push(section);
        // Lógica de distribución simple para un layout balanceado
        if (section.title === 'MENÚ INFANTIL' || section.title === 'HAMBURGUESAS') {
            colIndex++;
        } else if (columnsData[colIndex].length >= 2 && colIndex < 2) {
            colIndex++;
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
    <header class="text-center py-8 bg-black bg-opacity-50">
      <h1 class="font-bebas text-7xl md:text-8xl text-brand-yellow tracking-wider">10 DE 10</h1>
      <p class="text-xl md:text-2xl text-gray-300">Bar & Grill</p>
    </header>

    <main class="container mx-auto px-4 py-8">
      <!-- Estado de Carga -->
      <div v-if="isLoading" class="text-center text-2xl text-gray-400">
        Cargando menú...
      </div>

      <!-- Estado de Error -->
      <div v-else-if="error" class="text-center text-2xl text-red-500">
        {{ error }}
      </div>

      <!-- Contenido del Menú -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
        <!-- Columnas del menú -->
        <div v-for="(column, colIndex) in columns" :key="colIndex" class="space-y-8">
          <!-- Secciones del menú -->
          <div v-for="section in column" :key="section.title">
            <div :class="['section-title-wrapper', { 'bg-yellow-400 text-black rounded-lg p-2': section.title === 'MENÚ INFANTIL' }]">
              <h2 class="font-bebas text-5xl tracking-wide flex items-center">
                <span v-if="section.icon && section.title !== 'MENÚ INFANTIL'" class="mr-4">{{ section.icon }}</span>
                {{ section.title }}
              </h2>
            </div>
            
            <!-- Items de la sección -->
            <div class="space-y-4 mt-4">
              <div v-for="item in section.items" :key="item.name">
                <div v-if="item.price !== null && item.price !== undefined" class="menu-item">
                  <div class="flex-shrink-0">
                    <h3 class="text-xl">{{ item.name }}</h3>
                    <p v-if="item.description" class="text-sm text-gray-400">{{ item.description }}</p>
                  </div>
                  <span class="dots"></span>
                  <span class="menu-item-price">${{ formatPrice(item.price) }}</span>
                </div>

                <div v-else class="menu-item-no-price">
                  <h3 class="text-xl">{{ item.name }}</h3>
                  <p v-if="item.description" class="text-sm text-gray-400">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

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
