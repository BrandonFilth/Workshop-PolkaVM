![pallet-revive](/imagenes/Pallet-revive.png)
## 🌉 Pallet-Revive: Mecanismo de Compatibilidad EVM

La compatibilidad con Ethereum se logra a través del módulo: **Pallet-Revive**. Es esencialmente un *fork* modificado del módulo de contratos de Substrate, adaptado específicamente para **"hablar" RISC-V** con el motor PolkaVM.
Para asegurar la máxima compatibilidad con el *tooling* de Ethereum (MetaMask, Remix, Hardhat etc.), se utiliza un flujo basado en proxy:

![pallet-revive](/imagenes/JSON-Extrinsic-IA.jpg)
*Imagen generada con IA.*

**Decisión de Diseño:** Elegir esta arquitectura *proxy-first* prioriza la **Experiencia del Desarrollador** por encima de la simplicidad técnica, garantizando que todas las herramientas que los desarrolladores ya conocen **sigan funcionando sin problemas**.
---

### ⛔️ Consideraciones de Migración (Contratos EVM Complejos)

Como el código corre en el motor **RISC-V**, optimizado para la previsibilidad de recursos, hay algunas limitaciones importantes si traes contratos EVM muy complejos. Los desarrolladores deben ajustar su lógica para estos puntos:

* **Contratos de Fábrica (*Factory Contracts*) y Generación de Código en Runtime:**
    * **Limitación:** **No puedes generar código de contrato en *runtime***. La arquitectura RISC-V requiere que todo el código sea estático y conocido de antemano.
    * **Implicación Práctica:** Si un Contrato **A** crea dinámicamente un Contrato **B** (patrón muy común en Ethereum), el Contrato **B** **debe estar precargado en la cadena** antes de que A intente instanciarlo. La lógica de despliegue debe ser adaptada para cargar todas las dependencias antes de que se ejecute la lógica de la fábrica.

* **Funciones Incompatibles (*Opcodes*):**
    * **Razón:** Ciertas *opcodes* (instrucciones) EVM simplemente **no tienen un equivalente o sentido dentro del modelo optimizado de RISC-V** o de la arquitectura Polkadot.
    * **Las más notables que están deshabilitadas o no soportadas son:**
        * `selfdestruct` (Autodestrucción de contrato): Esta función está deshabilitada por motivos de seguridad y previsibilidad del estado.
        * `pc` (Program Counter): No es compatible, ya que la ejecución en PolkaVM se maneja de forma diferente al ciclo de vida de la pila EVM.
        * `blobhash` / `blobbasefee`: Estas funciones específicas de la actualización de Ethereum EIP-4844 (*Danksharding*) no están integradas en el modelo actual de PolkaVM.

---

## La Capa de Interoperabilidad: XCM Precompile

Uno de los puntos a destacar del Asset Hub es la **Interoperabilidad Programable**.

* **XCM Precompile:** Este mecanismo permite que un contrato de **Solidity desplegado en PolkaVM** pueda **iniciar transferencias y mensajes XCM** de forma nativa. Es decir, tu dApp Solidity puede enviar órdenes de comunicación y transferencia a cualquier otra Parachain de manera segura, sin intermediarios.
* **Liquidez compartida:** Esto crea un centro de liquidez programable. Cualquier dApp desplegada en el Asset Hub obtiene **acceso nativo e instantáneo a la liquidez de todo el ecosistema Polkadot** (todas las Parachains) sin necesidad de *bridges* centralizados y peligrosos. Este diseño es una base ideal y segura para aplicaciones de Finanzas Descentralizadas (DeFi) y la adopción de Activos del Mundo Real (RWA).

👉 [Capitulo 3](/contenido/PolkaVMvsEVM.md)
--- 