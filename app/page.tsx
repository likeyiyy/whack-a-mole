"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { animals, textToFilename, type Animal } from "./data";

export default function Home() {
  const [activeMole, setActiveMole] = useState<Animal | null>(null);
  const [currentHint, setCurrentHint] = useState<Animal | null>(null);
  const [score, setScore] = useState(0);
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const soundTimer = useRef<NodeJS.Timeout | null>(null);
  const wrongKeyTimer = useRef<NodeJS.Timeout | null>(null);
  const currentAnimalRef = useRef<Animal | null>(null);
  const gameStartedRef = useRef(false);

  const playSound = (soundText: string) => {
    if (isPaused) return;
    const filename = textToFilename(soundText);
    const url = "/audio/" + filename + ".mp3";
    const audio = new Audio(url);
    audio.play().catch(console.error);
  };

  const startNewMole = useCallback(() => {
    if (isPaused) return;

    const availableAnimals = animals.filter(a => true);
    const animal = availableAnimals[Math.floor(Math.random() * availableAnimals.length)];

    currentAnimalRef.current = animal;
    setActiveMole(animal);
    setCurrentHint(animal);
    setWrongKey(null);

    // 只有在用户交互后才播放声音
    if (hasInteracted) {
      playSound(animal.name);

      // 每3秒循环播放声音
      if (soundTimer.current) {
        clearInterval(soundTimer.current);
      }
      soundTimer.current = setInterval(() => {
        playSound(animal.name);
      }, 3000);
    }
  }, [isPaused, hasInteracted]);

  // 暂停时清除定时器
  useEffect(() => {
    if (isPaused) {
      if (soundTimer.current) {
        clearInterval(soundTimer.current);
        soundTimer.current = null;
      }
    } else if (hasInteracted && currentAnimalRef.current) {
      // 恢复时重新开始播放声音
      playSound(currentAnimalRef.current.name);
      soundTimer.current = setInterval(() => {
        playSound(currentAnimalRef.current!.name);
      }, 3000);
    }
  }, [isPaused, hasInteracted]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const key = e.key;

    // 第一次按键时标记已交互
    if (!hasInteracted) {
      setHasInteracted(true);
      // 如果游戏还没开始，开始游戏
      if (!gameStartedRef.current) {
        gameStartedRef.current = true;
        if (!activeMole) {
          startNewMole();
        }
      }
    }

    // 空格键暂停/继续
    if (key === " ") {
      e.preventDefault();
      setIsPaused(p => !p);
      return;
    }

    const keyUpper = key.toUpperCase();

    if (!/^[A-Z]$/.test(keyUpper)) return;

    if (!activeMole || isPaused) return;

    if (activeMole.letter === keyUpper) {
      // 按对了
      if (soundTimer.current) {
        clearInterval(soundTimer.current);
        soundTimer.current = null;
      }
      if (wrongKeyTimer.current) {
        clearTimeout(wrongKeyTimer.current);
        wrongKeyTimer.current = null;
      }

      setActiveMole(null);
      setCurrentHint(null);
      setWrongKey(null);
      setScore(s => s + 1);

      setTimeout(() => {
        startNewMole();
      }, 500);
    } else {
      // 按错了
      setWrongKey(keyUpper);

      // 播放"按错了哦，要按X"声音
      const correctLetter = activeMole.letter;
      playSound("按错了哦，要按" + correctLetter);

      if (wrongKeyTimer.current) {
        clearTimeout(wrongKeyTimer.current);
      }
      wrongKeyTimer.current = setTimeout(() => {
        setWrongKey(null);
      }, 2000);
    }
  }, [activeMole, startNewMole, isPaused, hasInteracted]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"]
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-8 flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-2">
          打地鼠游戏
        </h1>
        <p className="text-lg text-green-600 dark:text-green-500 mb-4">
          看动物，按对应字母键！{isPaused && <span className="text-orange-500 font-bold">(已暂停 - 按空格继续)</span>}
        </p>
        <div className="text-2xl font-bold text-green-700 dark:text-green-400">
          得分: {score}
        </div>
        <div className="text-sm text-green-600 dark:text-green-500 mt-2">
          按空格键暂停/继续 | 按任意字母键开始游戏
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
        <div className="space-y-2">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {row.map((key) => {
                const animal = animals.find(a => a.letter === key);
                const isActive = activeMole && activeMole.letter === key;
                const isWrong = wrongKey === key;

                return (
                  <div
                    key={key}
                    className={"relative h-20 w-14 md:w-20 rounded-2xl border-4 flex items-center justify-center transition-all duration-200 "
                      + (isActive
                        ? "border-red-500 bg-red-50 dark:bg-red-900/30 ring-4 ring-red-500 scale-110"
                        : isWrong
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30 scale-105"
                          : "border-green-300 dark:border-green-700 bg-white dark:bg-gray-800 hover:scale-105")}
                  >
                    <span className={"text-2xl md:text-4xl font-bold transition-all "
                      + (isActive
                        ? "text-red-600 dark:text-red-400"
                        : isWrong
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-green-700 dark:text-green-400")}>
                      {key}
                    </span>

                    {isActive && animal && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-4xl md:text-5xl animate-bounce">{animal.emoji}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-green-600 dark:text-green-500">
          提示：你也可以直接按物理键盘上的 A-Z 字母键！
        </div>
      </main>

      <div className="h-24 flex items-center justify-center">
        {!hasInteracted ? (
          <div className="bg-blue-100 dark:bg-blue-900 px-6 py-4 rounded-2xl shadow-lg animate-pulse">
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-400">
              按任意字母键开始游戏
            </div>
          </div>
        ) : isPaused ? (
          <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
              已暂停 - 按空格键继续
            </div>
          </div>
        ) : wrongKey ? (
          <div className="bg-orange-100 dark:bg-orange-900 px-6 py-4 rounded-2xl shadow-lg animate-pulse">
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-400">
              按错了哦！要按 {activeMole?.letter}
            </div>
          </div>
        ) : currentHint && (
          <div className="bg-yellow-100 dark:bg-yellow-900 px-6 py-4 rounded-2xl shadow-lg animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{currentHint.emoji}</span>
              <div className="text-left">
                <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-400">
                  按 {currentHint.letter} 键
                </div>
                <div className="text-xl text-yellow-700 dark:text-yellow-600">
                  ({currentHint.name})
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
