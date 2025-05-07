export const mockBoard = {
  title: 'Kanban Board',
  columns: [
    {
      id: 'col-1',
      title: 'Historias',
      enabled: true,
      cards: [
        {
          id: 'card-1',
          title: 'Implementar autenticación',
          description: 'Agregar sistema de login y registro',
          order: 0
        },
        {
          id: 'card-2',
          title: 'Diseñar UI/UX',
          description: 'Crear mockups y prototipos',
          order: 1
        }
      ]
    },
    {
      id: 'col-2',
      title: 'En Progreso',
      enabled: true,
      cards: [
        {
          id: 'card-3',
          title: 'Configurar base de datos',
          description: 'Implementar conexión MongoDB',
          order: 0
        }
      ]
    },
    {
      id: 'col-3',
      title: 'Revisión',
      enabled: true,
      cards: [
        {
          id: 'card-4',
          title: 'Testing',
          description: 'Implementar pruebas unitarias',
          order: 0
        }
      ]
    },
    {
      id: 'col-4',
      title: 'Completado',
      enabled: true,
      cards: [
        {
          id: 'card-5',
          title: 'Setup inicial',
          description: 'Configurar proyecto NestJS',
          order: 0
        }
      ]
    }
  ]
}; 