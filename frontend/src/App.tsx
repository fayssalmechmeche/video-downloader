import "./App.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { downloadSchema } from "./schemas/download.schema";
import { type DownloadFormValues } from "./schemas/download.schema";
function App() {
  const platforms = [
    "TikTok",
    "Twitter/X",
    "Instagram",
    "Snapchat",
    "Facebook",
    "Vimeo",
  ];

  const [quality, setQuality] = useState("best");
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (data: DownloadFormValues) => {
    setIsDownloading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/download/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: data.url, quality }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 429) {
          setError("Trop de téléchargements, attendez une minute.");
        } else {
          setError(data.message ?? "Une erreur est survenue, réessayez.");
        }
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "video.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      setError("Une erreur réseau est survenue, réessayez.");
    } finally {
      setIsDownloading(false);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DownloadFormValues>({
    resolver: zodResolver(downloadSchema),
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-black mb-2">SocialMediaDL</h1>
        <p className="text-gray-600 text-sm">
          Téléchargez vos vidéos en un clic
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-8">
        {/* Input Section */}
        <form onSubmit={handleSubmit(handleDownload)}>
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex gap-2">
              <input
                type="text"
                {...register("url")}
                placeholder="Collez l'URL de votre vidéo"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0 text-sm"
              />

              <button
                className="px-4 py-3 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
                type="button"
                onClick={() => {
                  navigator.clipboard.readText().then((text) => {
                    setValue("url", text);
                  });
                }}
              >
                Coller
              </button>
            </div>
            {errors.url && (
              <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>
            )}
          </div>

          {/* Quality Selection */}
          <div className="max-w-2xl mx-auto mb-10">
            <p className="text-sm text-gray-600 mb-3 font-medium">Qualité</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Meilleure qualité", value: "best" },
                { label: "1080p", value: "1080" },
                { label: "720p", value: "720" },
                { label: "480p", value: "480" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setQuality(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    quality === option.value
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <div className="max-w-2xl mx-auto mb-12">
            <button
              className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
                isDownloading
                  ? "bg-gray-600 text-white cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <div className="flex items-center justify-center gap-2">
                  <div style={{ animation: "spin 1s linear infinite" }}>⏳</div>
                  <span>Téléchargement en cours...</span>
                </div>
              ) : (
                "Télécharger"
              )}
            </button>
          </div>
          {error && (
            <div className="max-w-2xl mx-auto mt-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}
        </form>

        {/* Marquee - Supported Platforms */}
        <div className="mb-12">
          <p className="text-sm text-gray-600 mb-4 text-center font-medium">
            Plateformes supportées
          </p>
          <div className="marquee-container">
            <div className="marquee-content">
              {/* Duplicate platforms for seamless loop */}
              {[...platforms, ...platforms].map((platform, index) => (
                <div key={index} className="marquee-item">
                  {platform}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 text-center border-t border-gray-200">
        <p className="text-xs text-gray-400">
          Aucune vidéo est conservée sur nos serveurs. Elles sont
          automatiquement supprimées après le téléchargement.
        </p>
      </footer>
    </div>
  );
}

export default App;
