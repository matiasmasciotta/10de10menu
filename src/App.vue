<script setup>
import { ref, computed } from 'vue';
import initialMenu from './menu.model.json';

// Hacemos reactiva la data del menú
const menuItems = ref(initialMenu);

// Usamos la API de HMR de Vite para escuchar cambios en el JSON
if (import.meta.hot) {
  import.meta.hot.accept('./menu.model.json', (newMenu) => {
    // Cuando el archivo cambia, actualizamos nuestra variable reactiva
    menuItems.value = newMenu.default;
  });
}

// Agrupa los items del JSON por categoría
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
    sections[item.category].items.push({
      name: item.name,
      description: item.description,
      price: item.price
    });
  });
  return sections;
});

// Define la estructura de las columnas usando las secciones agrupadas
const columns = computed(() => {
    const sections = menuSections.value;
    // Filtramos para evitar errores si una categoría no existe temporalmente
    const allSections = [
        sections['ENTRADAS'], 
        sections['MENÚ INFANTIL'],
        sections['PARRILLA'], 
        sections['HAMBURGUESAS'], 
        sections['BEBIDAS SIN ALCOHOL'],
        sections['CERVEZAS'], 
        sections['VINOS/TRAGOS'], 
        sections['POSTRES']
    ].filter(Boolean);

    // Re-distribuimos las secciones existentes en las columnas
    return [
        allSections.slice(0, 2),
        allSections.slice(2, 5),
        allSections.slice(5, 8)
    ];
});

// Función para formatear el precio
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0 }).format(price);
};

</script>

<template>
  <div class="bg-brand-dark min-h-screen text-white p-4 md:p-8 font-sans bg-cover bg-center" style="background-image: url('https://www.transparenttextures.com/patterns/black-marble.png');">
    <div class="max-w-7xl mx-auto">
      
      <header class="text-center mb-12">
        <h1 class="font-bebas text-8xl text-brand-yellow tracking-widest">MENU</h1>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">

        <!-- Genera cada columna dinámicamente -->
        <div v-for="(col, colIndex) in columns" :key="colIndex" class="space-y-8">
          
          <!-- Logo en la primera columna -->
          <div v-if="colIndex === 0">
            <h2 class="font-bebas text-7xl text-brand-yellow tracking-widest">10de10</h2>
          </div>

          <!-- Itera sobre las secciones de cada columna -->
          <section v-for="section in col" :key="section.title">
            <!-- Título de la sección -->
            <div v-if="section.title === 'MENÚ INFANTIL'" class="bg-brand-yellow p-4 text-brand-dark">
                <h2 class="font-bebas text-5xl tracking-wide">{{ section.title }}</h2>
            </div>
            <div v-else class="font-bebas text-5xl text-brand-yellow tracking-wide flex items-center gap-4">
              <span>{{ section.title }}</span>
              <span v-if="section.icon">{{ section.icon }}</span>
            </div>

            <!-- Items de la sección -->
            <div class="space-y-4 mt-4">
              <div v-for="item in section.items" :key="item.name">
                                <!-- Caso 1: Item con precio (y posiblemente opciones) -->
                <div v-if="item.price" class="menu-item">
                  <div class="flex-shrink-0">
                    <h3 class="text-xl">{{ item.name }}</h3>
                    <p v-if="item.description" class="text-sm text-gray-400">{{ item.description }}</p>
                  </div>
                  <span class="dots"></span>
                  <span class="menu-item-price">${{ formatPrice(item.price) }}</span>
                </div>

                <!-- Caso 2: Item sin precio (solo nombre/descripción) -->
                <div v-else>
                  <h3 class="text-xl">{{ item.name }}</h3>
                  <p v-if="item.description" class="text-sm text-gray-400">{{ item.description }}</p>
                </div>

                <!-- Caso 3: Item simple sin precio -->
                <div v-else>
                  <h3 class="text-xl">{{ item.name }}</h3>
                  <p v-if="item.description" class="text-sm text-gray-400">{{ item.description }}</p>
                </div>
              </div>
              <p v-if="section.optional" class="text-sm text-gray-400 mt-2">{{ section.optional }}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-item {
  display: flex;
  align-items: baseline;
}

.dots {
  flex-grow: 1; /* El corazón de la solución: los puntos crecen para llenar el espacio */
  border-bottom: 2px dotted white;
  margin: 0 0.75rem;
  transform: translateY(-4px); /* Ajuste vertical para alinear con el texto */
}

.menu-item-price {
  font-weight: bold;
  color: #F59E0B; /* Amarillo de la marca */
}
</style>
