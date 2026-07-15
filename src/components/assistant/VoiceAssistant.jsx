import { useEffect, useRef, useState } from "react";

export default function VoiceAssistant({ onResult }) {
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      onResult(text);
    };

    recognitionRef.current = recognition;
  }, [onResult]);

  function startListening() {
    if (!recognitionRef.current) {
      alert("Speech Recognition is not supported in your browser.");

      return;
    }

    recognitionRef.current.start();
  }

  return (
    <button
      onClick={startListening}
      className="primary-btn"
    >
      {listening ? "🎤 Listening..." : "🎙 Speak"}
    </button>
  );
}