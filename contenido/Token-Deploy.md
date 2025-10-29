![metamask](/imagenes/polkadotAsset.png)

# Despliegue de Token ERC-20 en Polkadot (Passet Hub TestNet)

Como ya vimos anteriormente, Polkadot ahora es capaz de soportar contratos hechos en **Solidity**. Para probarlo, vamos a montar una mini dApp para interactuar con un token ERC-20 usando la TestNet de Passet Hub. Primero que nada vamos a necesitar una wallet, si no tienes una instala la extensión de MetaMask en tu navegador: [Metamask](https://metamask.io/es/download)

---


## **Paso 1:** Abre MetaMask y haz clic en el menú desplegable de las redes.

![metamask](/imagenes/wallets-1.png)
        
## **Paso 2:** Selecciona **Add a custom network**.

![metamask](/imagenes/wallets-2.png)
        

## **Paso 3:** Completa los campos con los siguientes datos:

| Campo | Valor |
| :--- | :--- |
| **Network name** | `Polkadot Hub TestNet` |
| **RPC URL** | `https://testnet-passet-hub-eth-rpc.polkadot.io` |
| **Chain ID** | `420420422` |
| **Currency symbol** | `PAS` |
| **Block explorer URL** | `https://blockscout-passet-hub.parity-testnet.parity.io/` |
![metamask](/imagenes/wallets-3.png)

### Solicitar Tokens de Prueba (PAS)
Solicita tokens para hacer el deploy e interactuar con la red en el faucet oficial: [Faucet](https://faucet.polkadot.io/?parachain=1111)

![Remix](/imagenes/faucet.png)

---

# 🚀 Despliegue del Token en Remix

Ahora que ya tenemos la red y tokens en nuestra billetera, vamos a la versión de Remix para Polkadot:
[https://remix.polkadot.io/](https://remix.polkadot.io/)


## 1. Crea un nuevo archivo llamado `Token.sol` en la carpeta `contracts/`.
![Remix](/imagenes/solididy-Contracts-folder.png)


2.  Pega el siguiente código:

    ``` solidity
    // SPDX-License-Identifier: MIT
    // Compatible with OpenZeppelin Contracts ^5.4.0
    pragma solidity ^0.8.27;

    import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
    import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
    import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

    contract Token is ERC20, ERC20Burnable, Ownable {
        constructor(address initialOwner)
            ERC20("Aradia", "ARA")
            Ownable(initialOwner)
        {
            // Opcional: mintear un suministro inicial de 1 token al propietario.
            // _mint(initialOwner, 1 * 10 ** decimals()); 
        }

        function mint(address to, uint256 amount) public onlyOwner {
            _mint(to, amount);
        }
    }
        ```
*En caso de que quieras cambiar el nombre y símbolo de tu Token, puedes modificarlo en la línea: `ERC20("Aradia", "ARA")`.*

## 2. Navega al apartado **Solidity Compiler** y compila tu contrato (`Token.sol`).

![Remix](/imagenes/solidity-compilacion.png)

## 3. Navega al apartado **Deploy & run transactions** y conecta tu wallet (selecciona **Injected Provider - MetaMask**).

![Remix](/imagenes/solidity-walletConnect.png)

## 4. Pega la dirección de tu billetera en el campo para el argumento `initialOwner` del constructor y haz click en **Deploy**.

![Remix](/imagenes/solidity-owner.png)

## 5. Confirma la transacción en MetaMask.

![Remix](/imagenes/solidity-deploy.png)


## 6. Una vez que la transacción se confirme, verás el contrato desplegado, la transacción y el bloque en el cual fue incluida.

![Remix](/imagenes/solidity-contrato-creado.png)

👉 [Capitulo 5](/contenido/Deploy-dApp.md)
---
