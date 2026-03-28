'use client';

import { useRouter } from 'next/navigation';

export default function VictoryScreen({ winnerName }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 text-center max-w-sm">
        <div className="text-5xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold mb-2">ПОБЕДА!</h2>
        <p className="text-xl mb-6">{winnerName} победил!</p>
        <button 
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          НОВАЯ ИГРА
        </button>
      </div>
    </div>
  );
}