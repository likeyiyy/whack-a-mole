"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { animals, textToFilename, type Animal } from "./data";

export default function Home() {
  const [activeMoles, setActiveMoles] = useState<Set<string>>(new Set());
  const [currentHint, setCurrentHint] = useState<Animal | null>(null);
  const [score, setScore] = useState(0);

  // 随机选择一个动物冒出来
  const spawnMole = useCallback(() => {
    const availableAnimals = animals.filter(a => !activeMoles.has(a.letter));
    if (availableAnimals.length === 0) return;

    const animal = availableAnimals[Math.floor(Math.random() * availableAnimals.length)];
    setActiveMoles(prev => new Set([...prev, animal.letter]));

    // 播放声音提示
    const filename = textToFilename(animal.sound);
    const url = `/audio/${filename}.mp3`;
    const audio = new Audio(url);
    audio.play().catch(console.error);

    // 设置提示
    setCurrentHint(animal);

    // 5秒后自动收回
    setTimeout(() => {
      setActiveMoles(prev => {
        const newSet = new Set(prev);
        newSet.delete(animal.letter);
        return newSet;
      });
      setCurrentHint(null);
    }, 5000);
  }, [activeMoles]);

  // 处理按键
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const key = e.key.toUpperCase();

    // 只处理 A-Z
    if (!/^[A-Z]$/.test(key)) return;

    // 如果这个字母有冒出来的老鼠
    if (activeMoles.has(key)) {
      setActiveMoles(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
      setCurrentHint(null);
      setScore(s => s + 1);

      // 播放成功音效
      const filename = textToFilename("叮");
      const url = `/audio/${filename}.mp3`;
      const audio = new Audio(url);
      audio.play().catch(console.error);
    }
  }, [activeMoles]);

  // 键盘监听
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // 游戏开始后自动冒出第一个
  useEffect(() => {
    const timer = setTimeout(() => {
      spawnMole();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // QWERTY 键盘布局
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/']
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-8">
      {/* 头部 */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-2">
          🐹 打地鼠游戏 🐹
        </h1>
        <p className="text-lg text-green-600 dark:text-green-500 mb-4">
          找到对应的字母按键，让老鼠回洞里去！
        </p>
        {currentHint && (
          <div className="inline-flex items-center gap-3 bg-yellow-100 dark:bg-yellow-900 px-6 py-3 rounded-2xl">
            <span className="text-4xl">{currentHint.emoji}</span>
            <span className="text-xl text-yellow-800 dark:text-yellow-400">
              按 <span className="font-bold text-3xl text-red-600 dark:text-red-400">{currentHint.letter}</span> 键！
              <span className="ml-2 text-sm">({currentHint.sound})</span>
            </span>
          </div>
        )}
        <div className="text-2xl font-bold text-green-700 dark:text-green-400">
          得分: {score}
        </div>
      </header>

      {/* 键盘布局 - QWERTY */}
      <main className="max-w-4xl mx-auto">
        <div className="space-y-2">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {row.map((key) => {
                const animal = animals.find(a => a.letter === key);
                const isActive = activeMoles.has(key);

                return (
                  <div
                    key={key}
                    className={`
                      relative h-20 w-14 md:w-20 rounded-2xl border-4 border-green-300 dark:border-green-700
                      bg-white dark:bg-gray-800
                      flex items-center justify-center
                      transition-all duration-200
                      ${isActive ? 'ring-4 ring-red-500 scale-110' : 'hover:scale-105'}
                    `}
                  >
                    {/* 字母 */}
                    <span className={`text-2xl md:text-4xl font-bold transition-all ${
                      isActive ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400'
                    }`}>
                      {key}
                    </span>

                    {/* 老鼠冒头动画 */}
                    {isActive && animal && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-3xl md:text-5xl animate-bounce">{animal.emoji}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 提示 */}
        <div className="mt-8 text-center text-sm text-green-600 dark:text-green-500">
          💡 提示：你也可以直接按物理键盘上的 A-Z 字母键！
        </div>
      </main>
    </div>
  );
}
