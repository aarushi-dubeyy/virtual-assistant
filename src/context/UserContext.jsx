import React, { createContext, useState, useEffect } from 'react';
import run from '../gemini';

export const datacontext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("Click mic to start listening...");
  const [response, setResponse] = useState(false);

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }

  async function aiResponse(prompt) {
    const text = await run(prompt);
    const newText = text.replaceAll("google", "Aarushi Dubey").replaceAll("Google", "Aarushi Dubey");
    setPrompt(newText);
    speak(newText);
    setResponse(true);
    setTimeout(() => {
      setSpeaking(false);
    }, duration);
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (e) => {
  let currentIndex = e.resultIndex;
  let transcript = e.results[currentIndex][0].transcript;

  setPrompt(transcript);
  takeCommand(transcript.toLowerCase());
};


  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    setPrompt("Sorry, I couldn't hear you. Please try again.");
    setSpeaking(false);
  };

  function takeCommand(command) {
    if (command.includes("open") && command.includes("youtube")) {
      window.open("https://www.youtube.com/", "_blank");
      speak("Opening YouTube");
      setResponse(true);
      setPrompt("Opening YouTube");
      setTimeout(()=>{ setSpeaking(false) }, 5000)
    } else if (command.includes("open") && command.includes("google")) {
      window.open("https://www.google.com/", "_blank");
      speak("Opening Google");
      setResponse(true);
      setPrompt("Opening Google");
    } else if (command.includes("time")) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      speak(time);
      setResponse(true);
      setPrompt(time);
    } else if (command.includes("date")) {
      const date = new Date().toLocaleDateString([], { day: 'numeric', month: 'long' });
      speak(date);
      setResponse(true);
      setPrompt(date);
    } else {
      aiResponse(command);
    }

    setTimeout(() => setSpeaking(false), 5000);
  }

  const value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse,
    speak,
  };

  return (
    <datacontext.Provider value={value}>
      {children}
    </datacontext.Provider>
  );
}

export default UserContext;