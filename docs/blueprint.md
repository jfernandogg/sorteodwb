# **App Name**: Rifa Solidaria Living Center

## Core Features:

- Formulario de Inscripción: Formulario de inscripción: Captura de datos personales (nombre, apellidos, email, teléfono) y selección de número de participaciones (1-9) mediante un selector visual.
- Cálculo del Total: Cálculo automático del total a pagar (participaciones × PRECIO_POR_TICKET).
- Integración de Pagos: Integración con Bold Payments: Redirección a Bold Payments mediante un endpoint PHP (crearLinkDePago) al pulsar el botón 'Pagar'.
- Subida de Comprobante: Subida de comprobante de pago: Permite al usuario subir el comprobante en formato PDF/JPG/PNG tras completar el pago.
- Validación de Duplicados: Validación de duplicados: Implementa una función que evita el registro de participaciones con el mismo email y comprobante ya subido.
- Email de Confirmación: Confirmación por correo electrónico: Envía un email de confirmación al usuario con el resumen de su compra y un enlace al comprobante.

## Style Guidelines:

- Primary color: Warm and inviting orange (#F47C35) to evoke a sense of generosity and support.
- Background color: Soft, desaturated orange (#F8D8C4) to create a calming and friendly atmosphere.
- Accent color: Complementary yellow-orange (#F4A635) for buttons and interactive elements, providing contrast and guidance.
- Body and headline font: 'PT Sans', a humanist sans-serif that is suitable for both headlines and body text. This typeface choice lends the app a modern yet accessible aesthetic.
- Utilize Material Icons for visual clarity and consistency throughout the app. Use the star icons from Material Icons for indicating the number of raffle entries.
- Maintain a clean, uncluttered layout that guides the user through each step. Employ clear visual hierarchy to highlight important information and calls to action.
- Implement subtle transitions and animations for user feedback.