"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { animals, textToFilename, type Animal } from "./data";

export default function Home() {
  const [activeMole, setActiveMole] = useState<Animal | null>(null);
  const [currentHint, setCurrentHint] = useState<Animal | null>(null);
  const [score, setScore] = useState(0);
  const moleTimer = useRef<NodeJS.Timeout | null>(null);

  // 开始出题：显示一个动物让小孩按
  const startNewMole = useCallback(() => {
    if (activeMole) return; // 已有老鼠，先打中

    const availableAnimals = animals.filter(a => true);
    const animal = availableAnimals[Math.floor(Math.random() * availableAnimals.length)];

    setActiveMole(animal);
    playSound(animal.sound);

    // 设置提示
    setCurrentHint(animal);

    // 老鼠一直冒头，直到被打中或超时（10秒自动换下一个）
    const timer = setTimeout(() => {
      if (activeMole) { // 如果还没被打中，自动换下一个
        startNewMole();
      }
    }, 10000);
    moleTimer.current = timer;
  }, [activeMole, score]);

  const playSound = (soundText: string) => {
    const filename = textToFilename(soundText);
    const url = `/audio/${filename}.mp3`;
    const audio = new Audio(url);
    audio.play().catch(console.error);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const key = e.key.toUpperCase();

    if (!/^[A-Z]$/.test(key)) return;

    // 如果当前有老鼠，检查按键是否匹配
    if (activeMole && activeMole.letter === key) {
      // 打中了！
      clearTimeout(moleTimer.current as NodeJS.Timeout); // 清除超时定时器
      setActiveMole(null);
      setCurrentHint(null);
      setScore(s => s + 1);

      // 打中后出下一个题
      setTimeout(() => {
        startNewMole();
      }, 500);
    }
  }, [activeMole]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, activeMole, score]);

  // 游戏开始后自动出第一只老鼠
  useEffect(() => {
    startNewMole();
  }, []);

  // QWERTY 键盘布局
  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"]
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-8 flex flex-col">
      <header className="text-center mb-4 z-10">
        <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-2">
          打地鼠游戏
        </h1>
        <div className="text-2xl font-bold text-green-700 dark:text-green-400">
          得分: {score}
        </div>
      </header>

      {/* 提示区域 - 固定在键盘下方 */}
      <div className="flex-1 justify-center">
        {currentHint && (
          <div className="bg-yellow-100 dark:bg-yellow-900 px-6 py-4 rounded-2xl shadow-lg animate-pulse">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{currentHint.emoji}</span>
              <div className="text-left">
                <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-400">
                  按 <span className="text-4xl text-red-600 dark:text-red-400">{currentHint.letter}</span> 键！
                </div>
                <div className="text-xl text-yellow-700 dark:text-yellow-600">
                  ({currentHint.sound})
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 键盘布局 */}
      <main className="flex-1 max-w-5xl mx-auto">
        <div className="space-y-2">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {row.map((key) => {
                const animal = animals.find(a => a.letter === key);
                const isActive = activeMole && activeMole.letter === key;

                return (
                  <div
                    key={key}
                    className={`relative h-20 w-14 md:w-20 rounded-2xl border-4 border-green-300 dark:border-green-700 bg-white dark:bg-gray-800 flex items-center justify-center transition-all duration-200 ${isActive ? "ring-4 ring-red-500 scale-110" : "hover:scale-105"}`}
                  >
                    <span className={`text-2xl md:text-4xl font-bold transition-all ${isActive ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
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
      </main>
    </div>
  );
}
