![metamask](/imagenes/ethereum-vs-polkadot.jpg)

# PolkaVM vs EVM

PolkaVM se diferencia fundamentalmente de la EVM en su arquitectura base.

## 💻 Arquitectura

| Característica | PolkaVM | EVM (Ethereum Virtual Machine) |
| :--- | :--- | :--- |
| **Diseño** | Arquitectura **basada en registros RISC-V**. | Arquitectura **basada en pila (stack-based)**. |
| **Funcionamiento** | Emula directamente el funcionamiento del hardware moderno (similitud con la ejecución nativa de CPU), lo que permite una **traducción casi directa al código máquina**. | Utiliza palabras de 256 bits, lo que requiere constantes operaciones de empuje y extracción de datos. |
| **Eficiencia** | Ejecución **más rápida y eficiente**. | Ejecución **más lenta y menos eficiente** debido a su naturaleza de pila. |

---

## 💾 Gestión de Memoria y Recursos

PolkaVM ofrece una gestión de recursos **más estricta y predecible**.

* **PolkaVM:** Aplica límites de memoria **duros y fijos** por contrato, actualmente establecidos en **64KB por instancia**.
    * Cualquier intento de acceso a memoria que exceda el límite de 64KB resultará en un **trap inmediato** del contrato.
    * Esta **previsibilidad** es fundamental para la seguridad y el rendimiento optimizado de Polkadot.
* **EVM:** Impone límites de memoria **blandos** a través de **costos de gas prohibitivos**.

---

## 💰 Modelo de Costos: Medición Multidimensional

El modelo de costos de PolkaVM aborda las deficiencias del sistema de gas unidimensional de EVM, introduciendo un modelo de medición **tridimensional** para los recursos, separando las preocupaciones y logrando una
**eficiencia de precios superior** y un costo más **predecible**.

Este sistema garantiza que los usuarios paguen de manera precisa por el consumo real de recursos (cómputo, I/O y almacenamiento), a diferencia de la curva de gas creciente y la métrica única de EVM.

### 📏 Las Tres Dimensiones de la Medición de PolkaVM:

1.  **ref\_time (Tiempo de Referencia):**
    * Mide el **tiempo computacional real** consumido por la ejecución del código (**costo de la CPU**).
2.  **proof\_size (Tamaño de Prueba):**
    * Mide el **impacto en el estado de la cadena** y el tamaño de la prueba de estado requerida.
    * Esta métrica es vital para el rendimiento de la Relay Chain y el Coretime.
3.  **storage\_deposit (Depósito de Almacenamiento):**
    * Un **depósito reembolsable** requerido por el estado de la cadena que el contrato ocupa a largo plazo.

👉 [Capitulo 4](/contenido/Token-Deploy.md)
--- 