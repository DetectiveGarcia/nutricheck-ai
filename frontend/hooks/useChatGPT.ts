import { useAuth } from "@/context/AuthProvider";
import { Nutrient } from "@/types/nutrition";
import { useCallback, useState } from "react";
export function useChatGPT() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useAuth();

  const sendRequest = useCallback(
    async (
      form: Nutrient[],
      productTitle: string,
      totalWeight: string,
      nutriInfoPerGram: string,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(
          `${process.env.EXPO_PUBLIC_API_URL}/api/askChatGPT`,
          {
            method: "POST",
            body: JSON.stringify({
              form,
              productTitle,
              totalWeight,
              nutriInfoPerGram,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Kunde inte hämta svar från servern.");
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        console.log("sendRequest error: " + error);
        setError("Något gick fel: " + error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  return { sendRequest, loading, error };
}
