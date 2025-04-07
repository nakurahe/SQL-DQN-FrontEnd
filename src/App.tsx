import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { MainUI } from './components/MainUI';
import { SetupModal } from './components/SetupModal';
import { Queries, ThemeTables, ThemeType } from './utils/constants';
import { getGeneratedQuery } from './utils/llmService';

type GameState = 'loading' | 'welcome' | 'main';

function App() {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [systemOutput, setSystemOutput] = useState('');
  const [theme, setTheme] = useState('cyberpunk' as ThemeType);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [actionNumber, setActionNumber] = useState(0);
  const [schema, setSchema] = useState(ThemeTables[theme]);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setGameState('welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Handle setup form completion
  // since we used a fetch request to the server,
  // we've already passed theme and concepts to the backend
  // and received the action number in response.
  const handleSetupComplete = async ({ theme: chosenTheme, concepts, action }: { theme: 'cyberpunk' | 'fantasy' | 'real-world'; concepts: string[]; action: string }) => {
    setTheme(chosenTheme);
    setConcepts(concepts);
    setSchema(ThemeTables[chosenTheme]);

    const actionNumber = parseInt(action, 10);
    setActionNumber(actionNumber);

    const randomChoice = Math.floor(Math.random() * Queries[chosenTheme][actionNumber].numOptions);
    const chosenConcept = Queries[chosenTheme][actionNumber].concept;
    const chosenInput = Queries[chosenTheme][actionNumber].input[randomChoice];
    const chosenExpected = Queries[chosenTheme][actionNumber].expected[randomChoice];
    const narrative = await getGeneratedQuery(
      chosenTheme,
      chosenConcept,
      chosenInput,
      chosenExpected
    );
    setSystemOutput(`${narrative}`);
    setIsSetupModalOpen(false);
    setGameState('main');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {gameState === 'loading' && <LoadingScreen />}

      {gameState === 'welcome' && (
        <WelcomeScreen
          onCustomSetup={() => setIsSetupModalOpen(true)}
        />
      )}

      {gameState === 'main' && theme && (
        <MainUI
          initialOutput={systemOutput}
          initialSchemas={schema}
          theme={theme}
          concepts={concepts}
          actionNumber={actionNumber}
        />
      )}

      <SetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onComplete={handleSetupComplete}
      />
    </div>
  );
}

export default App;