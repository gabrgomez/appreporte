Holis, esta es la explicación de la estructura de las carpetas.

primero que nada, estan las carpetas app, components, server, styles y trpc.
en components están componentes que se pueden reutilizar a traves de la app.
layout: Acá hay header, footer, sidebar, etc.
auth: loginform, logouth button, etc.
users: user table y cosas de la interfaz de administrador para dministrar usuarios
common: botones, inputs, loaders, etc.

en server, está lo que es el back end de la pagina.
auth es para la autenticación del usuario.

_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

En la carpeta de dashboards, en los archivos page, "powerbi" sale en rojo, pero es normal, no es un error. La variable se llena una vez se carga la pagina, dejenlo así, así funciona.

_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

RECORDAR
HAY DOS TIPOS DE USUARIO:
ADMIN
BASIC

_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

Hay que darles distintos privilegios a distintos usuarios
Podria ser por niveles, ej.:
Nivel 1 ----> Puede ver todos los dashboards
Nivel 2 ----> Puede ver solo algunos dashboards
Nivel 3 ----> Tiene acceso muy limitado

_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

Por el momento las rutas para ver las paginas son:
/login -----> Inicio de sesion
/admin/users ----> Crud
/admin/users (sin privilegios) -----> noprivileges page
/inicio ----> pagina antes de los dashboards
/dashboard/ventas ----> pagina del dashboard de ventas
/dashboard/productos ----> pagina del dashboard de productos
/dashboard/clientes ----> pagina del dashboard de clientes
