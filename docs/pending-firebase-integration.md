# Integrar variables de entorno de Firebase Functions
Actualizar el código backend para que use `functions.config()` en vez de `process.env` para las variables sensibles (SMTP, Drive, Bold, etc.) cuando se despliegue en Firebase.

---

# Adaptar el deploy de Next.js a Firebase Hosting + Cloud Functions
Configurar el proyecto para que el frontend y las server actions/API funcionen correctamente en Firebase Hosting y Cloud Functions, siguiendo la guía oficial de Firebase para Next.js.

---

# Documentar el proceso de despliegue en Firebase
Agregar una sección al README con los pasos para desplegar en Firebase, incluyendo cómo definir variables de entorno y comandos de deploy.

---

# Probar y ajustar el envío de correos en producción
Verificar que el envío de correos con nodemailer funciona correctamente en el entorno de Firebase Functions, usando las variables de entorno configuradas.

---

# Revisar y adaptar scripts de inicialización para entorno Firebase
Ajustar los scripts de inicialización (`init-raffleTickets.js`, etc.) para que puedan ejecutarse o migrarse a Cloud Functions si es necesario.

---

# (Opcional) Automatizar el deploy con GitHub Actions
Configurar un workflow de GitHub Actions para desplegar automáticamente a Firebase Hosting y Functions al hacer push a la rama principal.
