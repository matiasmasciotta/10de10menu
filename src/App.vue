<script setup>
import { ref } from 'vue';

const menuData = ref({
  entradas: {
    title: 'ENTRADAS',
    icon: '🍟',
    items: [
      { name: 'Bastones de Mozzarella', price: '5.600' },
      { name: 'Tequeños de queso', price: '5.200' },
      { name: 'Papas fritas solas', price: '4.800' },
      { name: 'Papas fritas con cheddar & Panceta', price: '6.500' },
      { name: 'Papas fritas 10de10', price: '7.000', description: '(Cheddar,Panceta,salchichas alemanas)' },
    ]
  },
  infantil: {
    title: 'MENÚ INFANTIL',
    items: [
      { name: 'Nuggets de pollo crispy con papas', price: '6.200' },
      { name: 'Milanesa con puré', price: '6.500' },
      { name: 'Salchipapas', price: '5.800' },
      { name: 'Pasta con salsa rosa', price: '6.000' },
    ]
  },
  parrilla: {
    title: 'PARRILLA',
    icon: '🔥',
    items: [
      { name: 'Chorizo', price: '3.500' },
      { name: 'Morcilla', price: '3.500' },
      { name: 'Provoleta', price: '5.800' },
      { name: 'Asado', price: '9.000' },
      { name: 'Bondiola', price: '8.500' },
      { name: 'Pechuga de pollo', price: '7.500' },
      { name: 'Pata Muslo', price: '7.000' },
    ]
  },
  hamburguesas: {
    title: 'HAMBURGUESAS',
    icon: '🍔',
    items: [
      { name: 'Pappo Napolitano', price: '7.800', options: 'Simple/Doble/Triple' },
      { name: 'La Escaloneta', price: '8.200', options: 'Simple/Doble/Triple' },
      { name: 'D10S', price: '8.500', options: 'Simple/Doble/Triple' },
      { name: 'Messirve', price: '8.000', options: 'Simple/Doble/Triple' },
      { name: '10de10', price: '9.500', options: 'Simple/Doble/Triple' },
    ],
    optional: '*Opcional Medallón: Carne/Pollo Crispy/ VEGGIE'
  },
  bebidas: {
      title: 'BEBIDAS SIN ALCOHOL',
      icon: '🥤',
      items: [
          { name: 'Agua mineral', price: '1.500' },
          { name: 'Agua saborizada', price: '1.800' },
          { name: 'Limonada', price: '2.500' },
          { name: 'Gaseosa', price: '2.000' },
      ]
  },
  vinos: {
      title: 'VINOS/TRAGOS',
      icon: '🍷',
      items: [
        { name: 'Vino Cosecha tardía', price: '4.500' },
        { name: 'Vino Malbec', price: '4.800' },
        { name: 'Fernet', price: '3.800' },
        { name: 'Campari', price: '4.200' },
        { name: 'Gin Tonic', price: '5.000' },
      ]
  },
  cervezas: {
    title: 'CERVEZAS',
    icon: '🍺',
    items: [
      { name: 'IPA', price: '2.800' },
      { name: 'BLONDE ALE', price: '2.500' },
      { name: 'PORTER', price: '2.700' },
      { name: 'HONEY', price: '2.600' },
      { name: '10de10', price: '3.000' },
    ]
  },
  postres: {
    title: 'POSTRES',
    icon: '🍰',
    items: [
      { name: 'FLAN', price: '3.200' },
      { name: 'HELADO', price: '3.000' },
      { name: 'BROWNIE', price: '4.000' },
      { name: 'ICE POPS', price: '2.500' },
    ]
  }
});

const columns = ref([
  [menuData.value.entradas, menuData.value.infantil],
  [menuData.value.parrilla, menuData.value.hamburguesas, menuData.value.bebidas],
  [menuData.value.cervezas, menuData.value.vinos, menuData.value.postres]
]);

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
                    <p v-if="item.options" class="text-base text-gray-300">{{ item.options }}</p>
                  </div>
                  <span class="dots"></span>
                  <span class="menu-item-price">${{ item.price }}</span>
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
