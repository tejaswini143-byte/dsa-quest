'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PushPopStackGameProps {
  initialData: any;
  onSuccess: () => void;
  onMove: (isCorrect: boolean, feedback: string) => void;
}

export const PushPopStackGame: React.FC<PushPopStackGameProps> = ({
  initialData,
  onSuccess,
  onMove,
}) => {
  // If array of temperatures or string of brackets
  const isTempArray = Array.isArray(initialData);
  const items: any[] = isTempArray ? initialData : String(initialData).split('');

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [stack, setStack] = useState<any[]>([]);
  const [resolvedMap, setResolvedMap] = useState<Record<number, number>>({});

  const currentItem = currentIndex < items.length ? items[currentIndex] : null;

  const handlePop = () => {
    if (stack.length === 0) {
      onMove(false, 'Stack is empty! Nothing to pop.');
      return;
    }

    if (isTempArray) {
      const topIdx = stack[stack.length - 1];
      const topTemp = items[topIdx];
      if (currentItem !== null && currentItem > topTemp) {
        const newStack = [...stack];
        newStack.pop();
        setStack(newStack);
        const days = currentIndex - topIdx;
        setResolvedMap((prev) => ({ ...prev, [topIdx]: days }));
        onMove(
          true,
          `Popped day ${topIdx} (${topTemp}°F). Today (${currentItem}°F) is warmer! Waited ${days} day(s).`
        );
      } else {
        onMove(
          false,
          `Cannot pop! Today (${currentItem}°F) is not warmer than stack top (${topTemp}°F).`
        );
      }
    } else {
      // Bracket string
      const topChar = stack[stack.length - 1];
      const matchPairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
      if (currentItem && matchPairs[currentItem] === topChar) {
        const newStack = [...stack];
        newStack.pop();
        setStack(newStack);
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        onMove(true, `Matched '${topChar}' with '${currentItem}'! Stack top popped.`);
        if (nextIdx >= items.length && newStack.length === 0) {
          onSuccess();
        }
      } else {
        onMove(false, `Mismatch: Cannot match '${topChar}' with '${currentItem}'.`);
      }
    }
  };

  const handlePush = () => {
    if (currentIndex >= items.length) {
      onMove(false, 'All items already scanned!');
      return;
    }

    if (isTempArray) {
      // Verify if currentItem > stack top; if so, learner should have popped first
      if (stack.length > 0) {
        const topIdx = stack[stack.length - 1];
        const topTemp = items[topIdx];
        if (currentItem > topTemp) {
          onMove(
            false,
            `Wait! Today (${currentItem}°F) is warmer than stack top day ${topIdx} (${topTemp}°F). Pop the colder day first!`
          );
          return;
        }
      }

      const newStack = [...stack, currentIndex];
      setStack(newStack);
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      onMove(true, `Pushed day ${currentIndex} (${currentItem}°F) to stack.`);

      if (nextIdx >= items.length) {
        onSuccess();
      }
    } else {
      // Bracket string
      const newStack = [...stack, currentItem];
      setStack(newStack);
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      onMove(true, `Pushed opening '${currentItem}' to stack.`);
      if (nextIdx >= items.length && newStack.length === 0) {
        onSuccess();
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full max-w-xl">
      {/* HUD Bar */}
      <div className="flex items-center justify-between w-full bg-rose-950/30 border border-rose-500/30 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isTempArray ? '🌡️' : '🗿'}</span>
          <div>
            <div className="text-xs text-rose-300 uppercase font-mono tracking-wider">Current Reading</div>
            <div className="text-xl font-bold text-amber-300 font-mono">
              {currentIndex < items.length
                ? isTempArray
                  ? `Day ${currentIndex} : ${currentItem}°F`
                  : `Rune '${currentItem}' at [${currentIndex}]`
                : 'All Scanned!'}
            </div>
          </div>
        </div>
        <div className="text-right font-mono text-xs text-gray-400">
          Progress: {currentIndex} / {items.length}
        </div>
      </div>

      {/* Stack & Action Arena */}
      <div className="grid grid-cols-2 gap-6 w-full items-center">
        {/* Visual Stack */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-mono text-gray-400 mb-1">Active Stack Chamber</div>
          <div className="w-36 h-48 border-b-4 border-l-4 border-r-4 border-rose-500/60 rounded-b-xl bg-gray-950/80 p-2 flex flex-col-reverse gap-1.5 overflow-y-auto shadow-inner">
            {stack.length === 0 ? (
              <span className="m-auto text-gray-600 text-xs font-mono italic">[ Empty ]</span>
            ) : (
              <AnimatePresence>
                {stack.map((val, idx) => (
                  <motion.div
                    key={`${idx}-${val}`}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="w-full py-1.5 px-2 bg-rose-900/40 border border-rose-500/50 rounded text-center text-xs font-mono font-bold text-amber-300 shadow"
                  >
                    {isTempArray ? `Day ${val} (${items[val]}°)` : String(val)}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Game Decision Buttons */}
        <div className="flex flex-col gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePop}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
          >
            <span>⬆️ POP TOP</span>
            <span className="text-xs opacity-80">(If warmer / matched)</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePush}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <span>⬇️ PUSH ITEM</span>
            <span className="text-xs opacity-80">(Store to stack)</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
