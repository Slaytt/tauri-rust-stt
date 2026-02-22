import { useState } from 'react';
import { UploadCloud, Shield, FileAudio } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';

function App() {
  // Cet état (state) va gérer quel moteur on utilise
  const [isLocalMode, setIsLocalMode] = useState(false);

  const handleFileSelect = async () => {
    try {
      // 1. Ouvre la fenêtre de sélection de fichiers native du Mac
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Audio',
          extensions: ['mp3', 'wav', 'm4a']
        }]
      });

      if (selected) {
        console.log("Chemin du fichier sélectionné :", selected);

        // 2. On envoie ce chemin à notre backend Rust
        const rustResponse = await invoke('process_audio', { filePath: selected });

        // 3. On affiche la réponse de Rust
        alert(rustResponse);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection :", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center font-sans text-slate-900">

      {/* --- HEADER --- */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Voxtral Transcribe</h1>
          <p className="text-sm text-slate-500">Pour les professionnels</p>
        </div>

        {/* Le sélecteur de Mode (Cloud / Local) */}
        <div className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
          <UploadCloud className={`w-5 h-5 transition-colors ${!isLocalMode ? 'text-blue-500' : 'text-slate-300'}`} />

          <div className="flex items-center space-x-2">
            <Switch
              id="mode-toggle"
              checked={isLocalMode}
              onCheckedChange={setIsLocalMode}
            />
            <Label htmlFor="mode-toggle" className="font-medium cursor-pointer w-44 text-center">
              {isLocalMode ? 'Mode Local (Sécurisé)' : 'Mode Cloud (Rapide)'}
            </Label>
          </div>

          <Shield className={`w-5 h-5 transition-colors ${isLocalMode ? 'text-emerald-500' : 'text-slate-300'}`} />
        </div>
      </div>

      {/* --- ZONE DE DRAG & DROP --- */}
      <Card className="w-full max-w-3xl border-dashed border-2 border-slate-300 hover:border-slate-400 transition-colors bg-white/50 hover:bg-white cursor-pointer group">
        <CardContent className="flex flex-col items-center justify-center py-24">

          <div className="h-20 w-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
            <FileAudio className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-semibold mb-2 text-slate-700">
            Glissez votre fichier audio ici
          </h3>
          <p className="text-slate-500 mb-8 text-sm">
            MP3, WAV, M4A supportés
          </p>

          <Button size="lg" className="shadow-md" onClick={handleFileSelect}>
            Parcourir les fichiers
          </Button>

        </CardContent>
      </Card>

      {/* --- MESSAGE INFORMATIF --- */}
      <div className="mt-8 text-sm text-slate-400 text-center max-w-xl">
        {isLocalMode
          ? "🔒 En mode local, l'audio ne quitte jamais votre ordinateur. Le modèle Mistral s'exécute directement sur votre Mac."
          : "⚡️ En mode cloud, l'audio est envoyé de manière sécurisée à l'API Mistral pour une transcription ultra-rapide."
        }
      </div>

    </div>
  );
}

export default App;