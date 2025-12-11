import React, { useState, useCallback } from 'react';
import TextArea from './components/TextArea';
import Button from './components/Button';
import { roastCode } from './services/geminiService';
import { RoastResponse } from './types';

const App: React.FC = () => {
  const [codeInput, setCodeInput] = useState<string>('');
  const [roastOutput, setRoastOutput] = useState<string | null>(null);
  const [fixedCodeOutput, setFixedCodeOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRoast = useCallback(async () => {
    if (!codeInput.trim()) {
      alert("Please paste some code to roast!");
      return;
    }

    setIsLoading(true);
    setRoastOutput(null);
    setFixedCodeOutput(null);

    try {
      const response: RoastResponse = await roastCode(codeInput);
      setRoastOutput(response.roast);
      setFixedCodeOutput(response.fixedCode);
    } catch (error) {
      alert(`Error roasting code: ${error instanceof Error ? error.message : String(error)}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [codeInput]); // Depend on codeInput

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-gray-900 text-green-400">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-green-500 tracking-wider">
        The Code Roaster Bot 9000
      </h1>

      <div className="w-full max-w-4xl mb-8">
        <TextArea
          id="codeInput"
          placeholder="Paste your code here and prepare to be roasted..."
          value={codeInput}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCodeInput(e.target.value)}
          rows={10}
          className="text-lg"
        />
      </div>

      <div className="w-full max-w-4xl mb-12 sticky bottom-4 z-10 bg-gray-900 md:relative md:bottom-0 md:bg-transparent p-2 md:p-0 rounded-lg">
        <Button onClick={handleRoast} loading={isLoading} className="text-xl">
          ROAST ME
        </Button>
      </div>

      {(roastOutput || fixedCodeOutput) && (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {roastOutput && (
            <div className="bg-gray-800 p-6 rounded-lg border-2 border-red-500 shadow-lg animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4 text-red-400">The Roast 🔥</h2>
              <p className="text-green-300 whitespace-pre-wrap">{roastOutput}</p>
            </div>
          )}

          {fixedCodeOutput && (
            <div className="bg-gray-800 p-6 rounded-lg border-2 border-green-500 shadow-lg animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">The Fix ✅</h2>
              <pre className="whitespace-pre-wrap break-words p-2 bg-gray-900 text-green-200 rounded text-sm overflow-x-auto">
                <code>{fixedCodeOutput}</code>
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tailwind animations for fade-in effect */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
