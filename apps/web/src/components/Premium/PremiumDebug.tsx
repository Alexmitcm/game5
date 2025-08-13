import { useState } from "react";
import { Button, Card, H5 } from "@/components/Shared/UI";
import { hono } from "@/helpers/fetcher";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const PremiumDebug = () => {
  const { currentAccount } = useAccountStore();
  const [debugData, setDebugData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDebug = async () => {
    if (!currentAccount?.address) {
      setError("No wallet connected");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await hono.premium.debug(currentAccount.address);
      setDebugData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <H5>Premium Debug</H5>
      <div className="mt-4 space-y-4">
        <div>
          <p className="text-sm text-gray-600">
            Wallet: {currentAccount?.address || "Not connected"}
          </p>
        </div>
        
        <Button
          onClick={handleDebug}
          disabled={isLoading || !currentAccount?.address}
        >
          {isLoading ? "Debugging..." : "Debug Premium Status"}
        </Button>

        {error && (
          <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-800">Error: {error}</p>
          </div>
        )}

        {debugData && (
          <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
            <h6 className="mb-2 font-semibold">Debug Results:</h6>
            <pre className="overflow-auto text-xs">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PremiumDebug; 