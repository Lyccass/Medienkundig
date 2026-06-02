import { GlossarProvider } from "./glossar/GlossarContext";
import { GlossarModal } from "./glossar/GlossarModal";
import { AppShell } from "./components/AppShell";

export default function App() {
  return (
    <GlossarProvider>
      <AppShell />
      <GlossarModal />
    </GlossarProvider>
  );
}
