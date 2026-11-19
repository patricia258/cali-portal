// Limita a espera inclusive ao ler a resposta, sem repetir envios automaticamente.
export async function requestJson(url, options = {}, timeoutMs = 45000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const result = await response.json().catch((error) => {
      if (controller.signal.aborted) throw error;
      return {};
    });
    if (!response.ok) throw new Error(result.error || "Não foi possível concluir agora.");
    return result;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("O serviço demorou para responder. Confira o painel ou seu e-mail antes de repetir o envio.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
