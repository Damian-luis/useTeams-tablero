Tablero kanbam colaborativo

Este es una app de tablero de tareas colavorativo kamba para el manejo de tickets

Incluye las siguientes funcionalidades:

- Manejo de tickets con drag and drop
- Actualizaciones en tiempo real utilizanod websockets
- Integracion con Mongo db para la persistencia de datos
- Desplegue con Docker para faciidad de levantamiento


Tecnologias utilizadas

- Frontend:
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Socket.io Client
  - @hello-pangea/dnd 

- Backend:
  - NestJS
  - TypeScript
  - MongoDB con Mongoose
  - Socket.io 


Pre-requisitos

- Docker and Docker Compose
- Node.js 18+ (para entorno local)

Con Docker

1- Clonar el repositorio
2- Correr la aplicacion, ejecutar:

   docker-compose up --build
 
3- La aplicacion se ejecutara en http://localhost:3007


Entorno local

1. Arrancar el servicio MongoDB:
 
   Inicializar mono


2. Arrancar el backend:

   cd api
   npm install
   npm run start:dev


3. Start the frontend:

   cd client
   npm install
   npm run dev


4. La aplicacion se iniciarà en: http://localhost:3007

Variables de entorno

Frontend (.env.local)

NEXT_PUBLIC_API_URL=http://localhost:3001


Backend (.env)

MONGODB_URI=mongodb://localhost:27017/kanban
PORT=3000


El archivo compose debera estar ubicado en el directorio padre del cliente y del servidor

```text
.
├── api/                
│   ├── src/
│   │   ├── schemas/    
│   │   ├── services/    
│   └── ...
├── client/             
│   ├── src/
│   │   ├── app/        
│   │   ├── components/ 
│   │   ├── context/    
│   │   └── types/     
│   └── ...
└── docker-compose.yml  