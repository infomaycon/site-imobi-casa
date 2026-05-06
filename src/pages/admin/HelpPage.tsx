import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
type Message = { role: "user" | "assistant"; content: string };

const HelpPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // TODO: call new backend AI chat
      const data = { reply: "Backend não configurado." };
      const error = null;

      if (error) throw error;
      const reply = data?.reply || "Desculpe, não consegui processar sua mensagem.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Ocorreu um erro. Tente novamente em instantes." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: "calc(100vh - 7rem)" }}>
      <div className="mb-4">
        <h1 className="text-2xl font-display font-bold text-foreground">Ajuda</h1>
        <p className="text-muted-foreground text-sm font-body mt-1">Tire dúvidas sobre o painel e seu site</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-auto bg-card rounded-xl shadow-soft p-4 space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-12">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground text-lg">Como posso ajudar?</h3>
            <p className="text-muted-foreground text-sm font-body max-w-sm">
              Pergunte sobre como usar o painel, personalizar seu site, gerenciar imóveis e muito mais.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {["Como adiciono um imóvel?", "Como mudo as cores do site?", "Como funciona os leads?"].map((q) => (
                <button key={q} onClick={() => { setInput(q); }} className="px-3 py-1.5 rounded-full bg-muted text-sm font-body text-foreground hover:bg-muted/80 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm font-body leading-relaxed ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-muted text-foreground rounded-bl-md"
            }`}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Digite sua dúvida..."
          className="flex-1 h-12 px-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
        <Button onClick={send} disabled={loading || !input.trim()} className="h-12 w-12 p-0 shrink-0">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default HelpPage;
