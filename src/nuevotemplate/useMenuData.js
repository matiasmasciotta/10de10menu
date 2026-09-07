import { ref, computed } from 'vue';
import Papa from 'papaparse';

// URL del Google Sheet NUEVO
const GOOGLE_SHEET_URL_NUEVO = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuHkI8AOW2u7FvRUDXWleaRgR_2p_IIKbmQHzp_fJtWyornsA1izT5UrhcCvoqGQdKCsiFLUgPsWEH/pub?output=csv';

export function useMenuData() {
  const menuItems = ref([]);
  const isLoading = ref(true);
  const error = ref(null);

  const fetchMenuData = () => {
    isLoading.value = true;
    error.value = null;

    Papa.parse(GOOGLE_SHEET_URL_NUEVO, {
      download: true,
      header: true,
      dynamicTyping: true,
      transformHeader: header => header.trim().toUpperCase(),
      complete: (results) => {
        console.log('Datos recibidos del CSV NUEVO:', results.data);
        menuItems.value = results.data
          .filter(item => {
            // Si APAGAR no existe, es null, está vacío o no es 'si' (case-insensitive), mantener el ítem
            return !item.APAGAR || String(item.APAGAR).trim().toUpperCase() !== 'SI';
          })
          .map(item => ({
            order: item.SECCION,
            category: item.TITULO ? String(item.TITULO).trim() : '',
            icon: item.ICONO,
            name: item.PRODUCTO,
            description: item.SUBTITULO,
            price: item.PRECIO
          }))
          .filter(item => item.category && item.name); // Filtrar ítems sin categoría o nombre
        isLoading.value = false;
      },
      error: (err) => {
        console.error('Error al cargar o procesar el menú nuevo:', err);
        error.value = 'No se pudo cargar el menú. Intente de nuevo más tarde.';
        isLoading.value = false;
      }
    });
  };

  // Agrupa las secciones respetando el orden de aparición en el CSV
  const orderedSections = computed(() => {
    const sectionsInOrder = [];
    const sectionMap = {};

    menuItems.value.forEach(item => {
      if (!item.category) return;

      const categoryTitle = item.category;

      if (!sectionMap[categoryTitle]) {
        const newSection = {
          title: categoryTitle,
          icon: item.icon,
          items: []
        };
        sectionMap[categoryTitle] = newSection;
        sectionsInOrder.push(newSection);
      }

      sectionMap[categoryTitle].items.push(item);
    });

    return sectionsInOrder;
  });

  return {
    menuItems,
    isLoading,
    error,
    orderedSections,
    fetchMenuData
  };
}
