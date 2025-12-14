Informe del Proyecto - App de Tareas ENLACE CON VIDEO DE PRUEBA: "https://ipciisa-my.sharepoint.com/:v:/g/personal/carlos_galaz_roman_estudiante_ipss_cl/IQBkNExVs8koTLvTFk4h5z2OAXluubeCQ-9-ooMQpLGjpOE?e=qJfsgv&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D"

Que hace la app: Ahora es una app más completa para gestionar tareas. Sigues teniendo el login, pero ahora cuando entras puedes ver una lista de tus tareas pendientes. Puedes marcar tareas como completas, borrarlas y lo más importante: crear nuevas tareas.

Al crear una tarea puedes ponerle título, pero además puedes usar la cámara del celular para adjuntar una foto y el GPS para guardar la ubicación exacta de donde estabas. Todo esto se guarda en el teléfono, así que si cierras la app y vuelves a entrar, tus tareas siguen ahí.

Como organice el codigo: se ajusto el codigo para que deje de almacenar la informacion y trabaje directamente con la API("https://todo-list.dobleb.cl/docs")

app/: Aquí están todas las pantallas. app/login.tsx: La pantalla de inicio de sesión. app/(tabs)/index.tsx: La lista de tareas (Home). app/create.tsx: La pantalla para crear nueva tarea (donde uso la cámara y el mapa). services/auth.ts: Aquí se maneja la logica para ingresar a la app con el usuario validando en el Backend. Explicacion de cada archivo app/login.tsx: Sigue parecido, valida el usuario, en caso de ser un usuario invalido indica el error en pantalla, en caso de ser correcta ingresa al Home mostrando la lista de tarea correspondientes al usuario.

app/(tabs)/index.tsx: Es la pantalla principal. Muestra la lista con las tareas. Uso useFocusEffect para recargar la lista cada vez que entras a la pantalla. Aquí puedes marcar tareas como listas o borrarlas.

app/create.tsx: Esta es la parte interesante. Uso Expo Camera para tomar fotos directamente en la app. Uso Expo Location para obtener las coordenadas GPS. Cuando guardas, se crea un objeto con los datos de la tarea y se guarda mediante la API del Backend.

Tecnologias que usamos: React Native & Expo TypeScript Expo Router (para la navegación, mucho mejor que lo anterior) AsyncStorage (para persistencia de datos) Expo Camera (para las fotos) Expo Location (para el GPS) SafeAreaView (para que se vea bien en todos los celulares), incorporamos la API para trabajar los datos de usuarios y tareas a traves de un Backend.

Para las fotos y ubicación, usamos las librerias nativas de Expo porque son las que mejor funcionan y son fáciles de integrar.

Problemas que tuvimos: Al principio nos costó configurar los permisos de la cámara y ubicación en el archivo app.json, a veces la app se cerraba si no los pedía bien. También tuvimos que pelear un poco con el layout de la cámara para que se viera bien y no tapara los botones. La navegación con Expo Router es genial pero tuvimos que aprender cómo pasar parámetros y cómo proteger rutas (el login).

Ayuda de IA:

Sigo usando Copilot y herramientas de IA para generar código repetitivo y ayudarme con los estilos, que siguen sin ser mi fuerte. Adicionalmente usamos la IA para encontrar errores que teniamos en el codigo para agilizar las soluciones.