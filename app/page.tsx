import GitHubStats from '../components/GitHubStats';

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">GitHub Stats Generator</h1>
      <GitHubStats />
      <div className="mt-8">
      </div>
    </main>
  );
}