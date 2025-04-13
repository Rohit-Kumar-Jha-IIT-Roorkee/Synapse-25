import React, { useState } from "react";
console.log("✅ App.js is loading fresh");

function App() {
  const [prompt, setPrompt] = useState("");
  const [font, setFont] = useState("Roboto");
  const [image, setImage] = useState(null);
  const [htmlCode, setHtmlCode] = useState("");
  const [colors, setColors] = useState([]);
  const [format, setFormat] = useState("html");
  const [editedCode, setEditedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = () => {
    const type = format === "jsx" ? "text/javascript" : "text/html";
    const blob = new Blob([htmlCode], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = format === "jsx" ? "generated-ui.jsx" : "generated-ui.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    console.log("🔥 Generate button clicked");

    if (!image || !prompt || !font) {
      alert("Please fill all inputs.");
      return;
    }

    setIsGenerating(true);
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("font", font);
    formData.append("image", image);
    formData.append("format", format);

    try {
      const res = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("🧾 FULL backend response:", data);
      console.log("✅ HTML content inside data.code:", data.code);

      if (format === "jsx") {
        setHtmlCode(data.code?.jsx || "");
        setEditedCode(data.code?.jsx || "");
      } else {
        setHtmlCode(data.code?.html || "");
        setEditedCode(data.code?.html || "");
      }

      setColors(data.colors || []);
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-blue-700">
          🧠 Multimodal UI Generator
        </h1>

        {/* Prompt Input */}
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Prompt:</label>
          <input
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A clean product card with CTA"
          />
        </div>

        {/* Font Input */}
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Font:</label>
          <input
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            value={font}
            onChange={(e) => setFont(e.target.value)}
            placeholder="e.g. Roboto"
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col space-y-1">
          <label className="font-semibold">Product Image:</label>
          <input
            className="border rounded-lg p-2"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Generate Button */}
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:scale-110 hover:shadow-xl transform transition-all duration-[1200ms] ease-in-out disabled:opacity-50 flex items-center justify-center space-x-2"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 01-8 8z"
              ></path>
            </svg>
          )}
          <span>{isGenerating ? "Generating..." : "🚀 Generate UI"}</span>
        </button>

        {htmlCode && (
          <>
            {/* Brand Colors */}
            <div>
              <h2 className="text-xl font-semibold mb-2">🎨 Brand Colors:</h2>
              <div className="flex space-x-2">
                {colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-lg shadow-inner"
                    style={{ backgroundColor: color }}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>

            {/* Format Toggle */}
            <div className="flex items-center space-x-4 mt-6">
              <label className="font-semibold">Select Format:</label>
              <select
                className="border rounded px-3 py-1"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="html">HTML</option>
                <option value="jsx">JSX</option>
              </select>
            </div>

            {/* Generated Code */}
            <div>
              <h2 className="text-xl font-semibold mb-2">🧩 Generated Code:</h2>
              <p className="text-sm text-gray-500 mb-2 italic">
                Now showing: {format.toUpperCase()} format
              </p>
              <textarea
                className="w-full h-60 p-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-100 resize-y transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                value={editedCode}
                onChange={(e) => setEditedCode(e.target.value)}
              ></textarea>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setHtmlCode(editedCode)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  🎯 Apply Changes to Preview
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 hover:scale-110 hover:shadow-xl transform transition-all duration-[1200ms] ease-in-out"
                >
                  ⬇️ Download {format.toUpperCase()}
                </button>
                <button
                    onClick={() => {
                        const blob = new Blob([editedCode], { type: "text/javascript" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "generated-shopify.jsx";
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                    className="mt-4 bg-pink-600 text-white px-4 py-2 rounded shadow-md hover:bg-pink-700 hover:scale-110 hover:shadow-xl transform transition-all duration-[1200ms] ease-in-out"
                >
                    🛒 Download Shopify
                </button>

                    
              </div>
            </div>

            {/* Live Preview */}
            <div>
              <h2 className="text-xl font-semibold mb-2">🔍 Live Preview:</h2>
              <div
                className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg border bg-gray-100 p-2 transform transition-transform duration-[1200ms] hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: colors[0] || "#f0f0f0" }}
              >
                <iframe
                  title="preview"
                  className="w-full h-full rounded-md bg-white"
                  srcDoc={htmlCode}
                  style={{ border: "none" }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
