# Configuración e Interacción con TokenManager
---

## Paso 1: Crea un Nuevo Codespace

Inicia el proceso creando un nuevo Codespace.
![codespace](/imagenes/codespace-codespace.png)

---

## Paso 2: Instalación de Dependencias

Una vez en el Codespace, navega al la terminal del proyecto e instala las dependencias.

1.  Abre la terminal.
2.  Ejecuta: `cd TokenManager/`
3.  Ejecuta: `npm install`
   
![codespace](/imagenes/codespace-npm-install.png)


---

## Paso 3: Ejecuta la dApp

Inicia la aplicación en modo de desarrollo.

* Ejecuta: `npm run dev`
  
![codespace](/imagenes/codespace-npm-run-dev.png)


---

## Paso 4: Abre la Aplicación en el Navegador

Accede a la interfaz de usuario de la aplicación.

1.  Dirígete al apartado de **"Puertos"** (Ports) en tu Codespace.
2.  Da clic derecho en la **URL** del puerto activo (generalmente el puerto de la aplicación de desarrollo).
3.  Selecciona la opción **"Abrir en el navegador"** (Open in Browser).

![codespace](/imagenes/codespace-puertos.png)


---

## Paso 5: Conecta la Wallet y el Contrato

Prepara la aplicación para interactuar con tu token.

1.  **Conecta tu wallet** (por ejemplo, Metamask) a la aplicación web.
2.  **Pega la dirección del contrato** que desplegaste previamente en Remix.

![codespace](/imagenes/TokenManager1.png)


---

## Paso 6: Interactúa con las Funciones del Token

* **Mintea (Mint):** Crea nuevos tokens.
* **Quema (Burn):** Destruye tokens existentes.
* **Transfiere (Transfer):** Envía tokens a otra dirección.
