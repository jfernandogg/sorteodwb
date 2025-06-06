# Rifa Solidaria Living Center Medellín

Esta es una aplicación Next.js para la "Rifa Solidaria Estadía Living Center Medellín". Permite a los usuarios comprar participaciones para una rifa.

## Primeros Pasos

Para ejecutar la aplicación en modo de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:9002](http://localhost:9002) (o el puerto que hayas configurado) en tu navegador para ver la aplicación.

## Configuración

Algunas configuraciones importantes para la aplicación se encuentran en `src/config.ts`:

-   `PRECIO_POR_TICKET`: El precio de cada participación en la rifa (por defecto es 10 COP).
 -   `PAYMENT_ENDPOINT_BASE_URL`: La URL base del endpoint que genera el enlace de pago con Bold Payments. Por defecto apunta a `/api/crearLinkDePago` incluido en este proyecto. Puede configurarse mediante la variable de entorno `NEXT_PUBLIC_PAYMENT_ENDPOINT_BASE_URL`.

### Variables de Entorno del Backend

Para el funcionamiento completo del sistema (Cloud Functions o el endpoint de pago), se requieren las siguientes variables de entorno (configuradas en sus respectivos servicios):

-   `PRECIO_POR_TICKET`: (Para Cloud Functions si necesita este valor) El precio de cada participación.
-   `BOLD_API_KEY`: La clave API para interactuar con Bold Payments (usada por el endpoint `/api/crearLinkDePago`).
-   `FIREBASE_SERVICE_ACCOUNT_KEY`: Credenciales JSON del servicio utilizado para Firestore y Google Drive.
-   `GOOGLE_DRIVE_FOLDER_ID`: ID de la carpeta en Drive donde se guardarán los comprobantes.
-   Otras variables necesarias para Gmail API u otros servicios.

## Flujo de la Aplicación

1.  El usuario completa el formulario con sus datos personales (Nombre, Apellidos, Email, Teléfono).
2.  Selecciona cuántas participaciones desea comprar (entre 1 y 9) usando un selector de estrellas.
3.  El total en COP se calcula y muestra automáticamente (participaciones × `PRECIO_POR_TICKET`).
4.  El usuario pulsa el botón "Pagar".
    -   Se validan los campos del formulario.
    -   Se abre una nueva pestaña que llama al endpoint (`PAYMENT_ENDPOINT_BASE_URL`) con el monto y la descripción.
    -   El endpoint genera el enlace de Bold Payments y redirige al usuario al proveedor de pagos.
5.  Después de completar el pago, el usuario descarga su comprobante (PDF/JPG/PNG).
6.  El usuario vuelve manualmente al formulario de la rifa y sube su comprobante de pago.
7.  Pulsa el botón "Enviar Participación y Comprobante".
    -   Se envían los datos del formulario y el comprobante al backend (a través de una Server Action que llamaría a una Cloud Function).
    -   El backend valida los datos, verifica duplicados, sube el comprobante a Google Drive, guarda la información en Firestore y envía un email de confirmación.
8.  Se muestra un mensaje de agradecimiento al usuario.

## Funcionalidades Principales (Público)

-   Formulario de inscripción para la rifa.
-   Cálculo automático del total a pagar.
-   Redirección a la pasarela de pagos (Bold Payments vía endpoint integrado).
-   Subida de comprobante de pago.

## App de Administración

Existe una aplicación de administración separada (no incluida en este repositorio Next.js) para que los organizadores gestionen las participaciones. Esta app típicamente incluiría:
-   Autenticación con Google Sign-in.
-   Vista de las participaciones en formato de tabla/grid.
-   Filtros por rango de fechas, correo electrónico, número de participaciones.
-   Exportación de datos a CSV.
-   Acceso a los comprobantes de pago.

## Tecnologías Involucradas (Proyecto Completo)

-   **Frontend Público**: Next.js (este repositorio), Firebase Hosting.
 -   **API de Pago**: Endpoint de Next.js (incluido en este repositorio) o servidor externo.
-   **Backend Serverless**: Cloud Functions for Firebase.
-   **Base de Datos**: Cloud Firestore (modo nativo).
-   **Almacenamiento de Archivos**: Google Drive (vía Drive API).
-   **Envío de Correos**: Gmail API (vía Cloud Functions).
-   **App de Administración**: Google Apps Script, Firebase Studio Grid, u otra solución web con autenticación.
