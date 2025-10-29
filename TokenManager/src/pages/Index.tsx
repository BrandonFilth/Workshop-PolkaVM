import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Check, X } from "lucide-react";
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { ERC20_ABI } from "@/lib/abi";
import memeCoins from "@/assets/Meme_coins.png";
import connectivity from "@/assets/Connectivity.png";
import tokensAssets from "@/assets/TokensAssets.png";
import polkadotLogo from "@/assets/Polkadot_Logo_Pink-Black.png";
import trading from "@/assets/Trading.png";

// Declare custom web component for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

const Index = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [tempTokenAddress, setTempTokenAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isContractVerified, setIsContractVerified] = useState(false);
  const [isVerifyingContract, setIsVerifyingContract] = useState(false);

  const { isConnected, address } = useAccount();

  const { data: contractOwner } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'owner',
    query: {
      enabled: !!tokenAddress && isContractVerified,
    },
  });

  const { data: tokenName, isLoading: isLoadingName, error: nameError } = useReadContract({
    address: tempTokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'name',
    query: {
      enabled: !!tempTokenAddress && /^0x[a-fA-F0-9]{40}$/.test(tempTokenAddress),
    },
  });

  const { data: tokenDecimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress && isContractVerified,
    },
  });

  const { data: tokenSymbol, error: symbolError } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: {
      enabled: !!tokenAddress && isContractVerified,
    },
  });

  const { data: tokenTotalSupply, error: supplyError } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!tokenAddress && isContractVerified,
    },
  });

  const { data: tokenNameInfo, error: nameInfoError } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'name',
    query: {
      enabled: !!tokenAddress && isContractVerified,
    },
  });

  const { writeContract, data: mintTxHash, isPending: isMinting } = useWriteContract();
  const { writeContract: writeBurnContract, data: burnTxHash, isPending: isBurning } = useWriteContract();
  const { writeContract: writeTransferContract, data: transferTxHash, isPending: isTransferring } = useWriteContract();

  const { isSuccess: mintTxConfirmed } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  });

  const { isSuccess: burnTxConfirmed } = useWaitForTransactionReceipt({
    hash: burnTxHash,
  });

  const { isSuccess: transferTxConfirmed } = useWaitForTransactionReceipt({
    hash: transferTxHash,
  });

  console.log('Connection state:', { isConnected, address });

  useEffect(() => {
    if (mintTxConfirmed) {
      toast({
        title: "Éxito",
        description: "Tokens minteados exitosamente",
      });
    }
  }, [mintTxConfirmed]);

  useEffect(() => {
    if (burnTxConfirmed) {
      toast({
        title: "Éxito",
        description: "Tokens quemados exitosamente",
      });
    }
  }, [burnTxConfirmed]);

  useEffect(() => {
    if (transferTxConfirmed) {
      toast({
        title: "Éxito",
        description: "Tokens transferidos exitosamente",
      });
    }
  }, [transferTxConfirmed]);

  useEffect(() => {
    if (tempTokenAddress && /^0x[a-fA-F0-9]{40}$/.test(tempTokenAddress)) {
      setIsVerifyingContract(true);
    } else {
      setIsVerifyingContract(false);
    }
  }, [tempTokenAddress]);

  const handleAcceptContract = () => {
    if (!tempTokenAddress || !tokenName) {
      toast({
        title: "Error",
        description: "Contrato inválido o no encontrado",
        variant: "destructive",
      });
      return;
    }

    setTokenAddress(tempTokenAddress);
    setTempTokenAddress("");
    setIsContractVerified(true);

    toast({
      title: "Contrato aceptado",
      description: `Token: ${tokenName}`,
    });
  };

  const handleRemoveContract = () => {
    setTokenAddress("");
    setIsContractVerified(false);
    setMintAmount("");
    setBurnAmount("");
    setTransferTo("");
    setTransferAmount("");
    toast({
      title: "Contrato eliminado",
      description: "Puedes ingresar una nueva dirección de contrato",
    });
  };

  const handleTransfer = async () => {
    if (!tokenAddress) {
      toast({
        title: "Error",
        description: "Por favor configura primero la dirección del token",
        variant: "destructive",
      });
      return;
    }

    if (!transferTo || !transferAmount || parseFloat(transferAmount) <= 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos correctamente",
        variant: "destructive",
      });
      return;
    }

    // Validar formato de dirección
    if (!/^0x[a-fA-F0-9]{40}$/.test(transferTo)) {
      toast({
        title: "Error",
        description: "Dirección inválida",
        variant: "destructive",
      });
      return;
    }

    try {
      await writeTransferContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [transferTo as `0x${string}`, parseEther(transferAmount)],
      });

      toast({
        title: "Transacción enviada",
        description: `Transfiriendo ${transferAmount} tokens...`,
      });

      setTransferTo("");
      setTransferAmount("");
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        title: "Error",
        description: "Error al transferir tokens. Verifica que tengas suficientes tokens.",
        variant: "destructive",
      });
    }
  };

  const handleMint = async () => {
    if (!tokenAddress) {
      toast({
        title: "Error",
        description: "Por favor configura primero la dirección del token",
        variant: "destructive",
      });
      return;
    }

    if (!mintAmount || parseFloat(mintAmount) <= 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa una cantidad válida para mintear",
        variant: "destructive",
      });
      return;
    }

    // Verificar que el usuario sea el owner
    if (contractOwner && contractOwner.toLowerCase() !== address?.toLowerCase()) {
      toast({
        title: "Error",
        description: "Solo el owner del contrato puede mintear tokens",
        variant: "destructive",
      });
      return;
    }

    try {
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'mint',
        args: [address, parseEther(mintAmount)],
      });

      toast({
        title: "Transacción enviada",
        description: `Minteando ${mintAmount} tokens...`,
      });

      setMintAmount("");
    } catch (error) {
      console.error('Mint error:', error);
      toast({
        title: "Error",
        description: "Error al mintear tokens. Verifica que seas el owner del contrato.",
        variant: "destructive",
      });
    }
  };

  const handleBurn = async () => {
    if (!tokenAddress) {
      toast({
        title: "Error",
        description: "Por favor configura primero la dirección del token",
        variant: "destructive",
      });
      return;
    }

    if (!burnAmount || parseFloat(burnAmount) <= 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa una cantidad válida para quemar",
        variant: "destructive",
      });
      return;
    }

    try {
      await writeBurnContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'burn',
        args: [parseEther(burnAmount)],
      });

      toast({
        title: "Transacción enviada",
        description: `Quemando ${burnAmount} tokens...`,
      });

      setBurnAmount("");
    } catch (error) {
      console.error('Burn error:', error);
      toast({
        title: "Error",
        description: "Error al quemar tokens. Verifica que tengas suficientes tokens.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-white via-30% to-cyan-200 pointer-events-none" />

      <div className="absolute top-6 left-6 z-20">
        <img src={polkadotLogo} alt="Polkadot" className="h-12" />
      </div>

      <div className="absolute top-6 right-6 z-20">
        <appkit-button />
      </div>

      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src={tokensAssets}
          alt=""
          className="absolute top-1/3 right-10 w-48 h-48 float-animation"
        />
        <img
          src={connectivity}
          alt=""
          className="absolute bottom-32 left-10 w-40 h-40 float-animation-delayed"
        />
        <img
          src={memeCoins}
          alt=""
          className="absolute top-1/3 left-20 w-32 h-32 float-animation-delayed-2"
        />
        <img
          src={trading}
          alt=""
          className="absolute bottom-20 right-20 w-56 h-56 float-animation"
        />
      </div>

      <div className="w-full max-w-4xl space-y-8 relative z-10">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold gradient-text">Token Manager</h1>
          <p className="text-gray-600 text-lg">
            Gestiona tus tokens en Passet Hub
          </p>
          {!address && (
            <p className="text-sm text-gray-500">
              Conecta tu wallet para comenzar
            </p>
          )}
        </div>

        {address ? (
          <Card className="glass-card animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                Dirección del Token
                {isContractVerified && <Check className="w-5 h-5 text-green-500" />}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isContractVerified
                  ? `Contrato: ${tokenAddress.slice(0, 6)}...${tokenAddress.slice(-4)}`
                  : "Ingresa la dirección del contrato deployado en Passet Hub"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isContractVerified ? (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium">Contrato verificado ✓</p>
                    <p className="text-xs text-green-600 mt-1">
                      Owner: {contractOwner?.toLowerCase() === address?.toLowerCase() ? "Tú" : "Otro usuario"}
                    </p>
                  </div>
                  <Button
                    onClick={handleRemoveContract}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cambiar Contrato
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="token-address" className="text-gray-900">Token Address</Label>
                    <Input
                      id="token-address"
                      placeholder="0x..."
                      value={tempTokenAddress}
                      onChange={(e) => setTempTokenAddress(e.target.value)}
                      className="glass-input font-mono"
                    />
                  </div>
                  {tempTokenAddress && /^0x[a-fA-F0-9]{40}$/.test(tempTokenAddress) && (
                    <div className="space-y-2">
                      {isLoadingName ? (
                        <p className="text-sm text-gray-500">Verificando contrato...</p>
                      ) : tokenName ? (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800 font-medium">Token encontrado: {tokenName}</p>
                          <Button
                            onClick={handleAcceptContract}
                            size="sm"
                            className="mt-2 w-full"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Aceptar Contrato
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-red-600">Contrato no válido o no encontrado</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-card animate-scale-in opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                Dirección del Token
              </CardTitle>
              <CardDescription className="text-gray-600">
                Conecta tu wallet para gestionar tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="token-address" className="text-gray-900">Token Address</Label>
                <Input
                  id="token-address"
                  placeholder="0x..."
                  disabled
                  className="glass-input font-mono"
                  value=""
                />
              </div>
            </CardContent>
          </Card>
        )}

        {address ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mint Card */}
            <Card className="glass-card transition-all duration-300 animate-slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  Mint Tokens
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Crea nuevos tokens en el contrato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mint-amount" className="text-gray-900">Cantidad</Label>
                  <Input
                    id="mint-amount"
                    type="number"
                    placeholder="0.00"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    className="glass-input"
                    min="0"
                    step="any"
                  />
                </div>
                <Button
                  onClick={handleMint}
                  disabled={isMinting}
                  className="w-full bg-polkadot-pink hover:bg-polkadot-pink/90 transition-all text-white border-0"
                  size="lg"
                >
                  {isMinting ? "Minteando..." : "Mintear Tokens"}
                </Button>
              </CardContent>
            </Card>

            {/* Burn Card */}
            <Card className="glass-card transition-all duration-300 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  Burn Tokens
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Quema tokens existentes del contrato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="burn-amount" className="text-gray-900">Cantidad</Label>
                  <Input
                    id="burn-amount"
                    type="number"
                    placeholder="0.00"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    className="glass-input"
                    min="0"
                    step="any"
                  />
                </div>
                <Button
                  onClick={handleBurn}
                  disabled={isBurning}
                  className="w-full bg-gradient-destructive hover:opacity-90 transition-opacity text-white border-0"
                  size="lg"
                >
                  {isBurning ? "Quemando..." : "Quemar Tokens"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mint Card - Disabled */}
            <Card className="glass-card transition-all duration-300 animate-slide-in-right opacity-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  Mint Tokens
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Conecta tu wallet para mintear tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mint-amount" className="text-gray-900">Cantidad</Label>
                  <Input
                    id="mint-amount"
                    type="number"
                    placeholder="0.00"
                    disabled
                    className="glass-input"
                    min="0"
                    step="any"
                    value=""
                  />
                </div>
                <Button
                  disabled
                  className="w-full bg-polkadot-pink hover:bg-polkadot-pink/90 transition-all text-white border-0"
                  size="lg"
                >
                  Mintear Tokens
                </Button>
              </CardContent>
            </Card>

            {/* Burn Card - Disabled */}
            <Card className="glass-card transition-all duration-300 animate-slide-in-right opacity-50" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  Burn Tokens
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Conecta tu wallet para quemar tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="burn-amount" className="text-gray-900">Cantidad</Label>
                  <Input
                    id="burn-amount"
                    type="number"
                    placeholder="0.00"
                    disabled
                    className="glass-input"
                    min="0"
                    step="any"
                    value=""
                  />
                </div>
                <Button
                  disabled
                  className="w-full bg-gradient-destructive hover:opacity-90 transition-opacity text-white border-0"
                  size="lg"
                >
                  Quemar Tokens
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {address ? (
          <Card className="glass-card transition-all duration-300 animate-slide-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-polkadot-violet">
                Transfer Tokens
              </CardTitle>
              <CardDescription className="text-gray-600">
                Transfiere tokens entre direcciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transfer-to" className="text-gray-900">Para (To)</Label>
                  <Input
                    id="transfer-to"
                    placeholder="0x..."
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    className="glass-input font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transfer-amount" className="text-gray-900">Cantidad</Label>
                  <Input
                    id="transfer-amount"
                    type="number"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="glass-input"
                    min="0"
                    step="any"
                  />
                </div>
              </div>
              <Button
                onClick={handleTransfer}
                disabled={isTransferring}
                className="w-full bg-polkadot-cyan hover:bg-polkadot-cyan/90 transition-all text-black border-0"
                size="lg"
              >
                {isTransferring ? "Transfiriendo..." : "Transferir Tokens"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-card transition-all duration-300 animate-slide-in-up opacity-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-polkadot-violet">
                Transfer Tokens
              </CardTitle>
              <CardDescription className="text-gray-600">
                Conecta tu wallet para transferir tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transfer-to" className="text-gray-900">Para (To)</Label>
                  <Input
                    id="transfer-to"
                    placeholder="0x..."
                    disabled
                    className="glass-input font-mono"
                    value=""
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transfer-amount" className="text-gray-900">Cantidad</Label>
                  <Input
                    id="transfer-amount"
                    type="number"
                    placeholder="0.00"
                    disabled
                    className="glass-input"
                    min="0"
                    step="any"
                    value=""
                  />
                </div>
              </div>
              <Button
                disabled
                className="w-full bg-polkadot-cyan hover:bg-polkadot-cyan/90 transition-all text-black border-0"
                size="lg"
              >
                Transferir Tokens
              </Button>
            </CardContent>
          </Card>
        )}

        {address && isContractVerified && (
          <Card className="glass-card transition-all duration-300 animate-slide-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                Información del Token
              </CardTitle>
              <CardDescription className="text-gray-600">
                Detalles del contrato ERC20 configurado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-white/30 rounded-lg border border-white/20">
                  <p className="text-sm font-medium text-gray-700">Nombre</p>
                  <p className="text-lg font-bold text-gray-900">{tokenNameInfo || "Cargando..."}</p>
                </div>
                <div className="p-4 bg-white/30 rounded-lg border border-white/20">
                  <p className="text-sm font-medium text-gray-700">Símbolo</p>
                  <p className="text-lg font-bold text-gray-900">{tokenSymbol || "Cargando..."}</p>
                </div>
                <div className="p-4 bg-white/30 rounded-lg border border-white/20">
                  <p className="text-sm font-medium text-gray-700">Decimales</p>
                  <p className="text-lg font-bold text-gray-900">{tokenDecimals !== undefined ? tokenDecimals : "Cargando..."}</p>
                </div>
                <div className="p-4 bg-white/30 rounded-lg border border-white/20">
                  <p className="text-sm font-medium text-gray-700">Owner</p>
                  <p className="text-sm font-mono text-gray-900">
                    {contractOwner ? `${contractOwner.slice(0, 6)}...${contractOwner.slice(-4)}` : "Cargando..."}
                  </p>
                </div>
                <div className="p-4 bg-white/30 rounded-lg border border-white/20 md:col-span-2 lg:col-span-1">
                  <p className="text-sm font-medium text-gray-700">Supply Total</p>
                  <p className="text-lg font-bold text-gray-900">
                    {tokenTotalSupply ? `${Number(tokenTotalSupply) / 10 ** (tokenDecimals || 18)} ${tokenSymbol || ""}` : "Cargando..."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
