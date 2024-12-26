// app/page.tsx
import { Header } from './components/Header';
import { TokenDashboard } from './components/TokenDashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <TokenDashboard />
    </main>
  );
}
