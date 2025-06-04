"use client";

import { useState, useEffect } from 'react';


const TAKOYAKI_COUNT = 8;
const COOK_TIME = 5;
const BURN_DELAY = 2;

const generateInitialTakoyaki = () => {
  return Array.from({ length: TAKOYAKI_COUNT }, (_, i) => ({
    id: i,
    status: 'empty', // 'empty' | 'raw' | 'cooked' | 'burnt'
    timer: 0,
    createdAt: null,
  }));
};

export default function Home() {
  const [takoyakis, setTakoyakis] = useState(generateInitialTakoyaki());
  const [goodCount, setGoodCount] = useState(0);
  const [badCount, setBadCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const isWin = goodCount >= 30;

  // 倒數計時器
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameOver(true);
          setShowResultModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  // 更新章魚燒狀態
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setTakoyakis((prev) =>
        prev.map((t) => {
          if ((t.status === 'raw' || t.status === 'cooked') && t.createdAt) {
            const elapsed = (now - t.createdAt) / 1000;
            if (elapsed >= COOK_TIME + BURN_DELAY) {
              return { ...t, status: 'burnt' };
            } else if (elapsed >= COOK_TIME && t.status === 'raw') {
              return { ...t, status: 'cooked' };
            }
          }
          return t;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  // 點擊章魚燒
  const handleClick = (id) => {
    if (gameOver) return;
  
    const clicked = takoyakis.find((t) => t.id === id);
    if (!clicked) return;
  
    // 根據點擊的狀態處理邏輯
    if (clicked.status === 'empty') {
      // 放上生的章魚燒
      setTakoyakis((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: 'raw', createdAt: Date.now() } : t
        )
      );
    } else if (clicked.status === 'cooked') {
      setGoodCount((g) => g + 1);
      setTakoyakis((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: 'empty', createdAt: null } : t
        )
      );
    } else if (clicked.status === 'burnt') {
      setBadCount((b) => b + 1);
      setTakoyakis((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: 'empty', createdAt: null } : t
        )
      );
    }
  };
  

  const handleRestart = () => {
    setTakoyakis(generateInitialTakoyaki());
    setGoodCount(0);
    setBadCount(0);
    setTimeLeft(60);
    setGameOver(false);
    setShowResultModal(false);
  };

  return (
    <main className="flex h-screen bg-[#F5F0E4] p-4 gap-5 relative">
      {/* Sidebar */}
      <aside className="w-3/7 h-[500px] grid grid-cols-2 grid-rows-5 gap-4 rounded-2xl flex flex-col justify-center mt-35">
        <div className='bg-[#E36B5B] col-span-2 row-span-2 rounded-4xl text-white flex items-center justify-center gap-10'>
          <img
                src="/images/clock.png"
                alt="時鐘"
                className="w-25 h-25"
          />
          <p> <span className="text-6xl font-bold text-[#F5F0E4]">{timeLeft}s</span></p>
        </div>
        <div className='bg-[#505166] row-span-3 rounded-4xl text-white flex flex-col items-center justify-center gap-10'>
          <img
                src="/images/good taco.png"
                alt="好章魚燒"
                className="w-30 h-30"
          />
          <p> <span className="text-6xl text-[#F5F0E4] font-bold">{goodCount}</span></p>
        </div>
        <div className='bg-[#C5AC6B] row-span-3 rounded-4xl text-white flex flex-col items-center justify-center gap-10'>
          <img
                src="/images/bad taco.png"
                alt="壞章魚燒"
                className="w-30 h-30"
          />
          <p> <span className="text-6xl text-[#F5F0E4] font-bold">{badCount}</span></p>
        </div>
      </aside>

      {/* Game Grid */}
      <div className="relative w-full h-[500px] bg-[#505166] rounded-4xl flex justify-center items-center mt-35">
        {/* 四個角落圓點 */}
        <span className="absolute top-10 left-10 w-4 h-4 bg-[#F5F0E4] rounded-full"></span>
        <span className="absolute top-10 right-10 w-4 h-4 bg-[#F5F0E4] rounded-full"></span>
        <span className="absolute bottom-10 left-10 w-4 h-4 bg-[#F5F0E4] rounded-full"></span>
        <span className="absolute bottom-10 right-10 w-4 h-4 bg-[#F5F0E4] rounded-full"></span>
        <section className="grid grid-cols-4 gap-5 p-10">
          {takoyakis.map((t) => (
            <div
              key={t.id}
              onClick={() => handleClick(t.id)}
              className={`
                flex items-center justify-center w-[200px] h-[200px] rounded-full 
                cursor-pointer bg-[#F5F0E4] ml-6
                ${gameOver ? 'pointer-events-none' : ''}
              `}
            >
              {/* 空格顯示「+」 */}
              {t.status === 'empty' && (
                <span className="text-gray-500 text-6xl font-bold">+</span>
              )}

              {/* 生章魚燒 */}
              {t.status === 'raw' && (
                <img
                  src="/images/raw.png"
                  alt="生"
                  className="w-40 h-40 animate-pulse"
                />
              )}

              {/* 熟章魚燒 */}
              {t.status === 'cooked' && (
                <img
                  src="/images/cooked.png"
                  alt="可收"
                  className="w-40 h-40 hover:scale-110 transition-transform duration-300"
                />
              )}

              {/* 燒焦章魚燒 */}
              {t.status === 'burnt' && (
                <img
                  src="/images/burnt.png"
                  alt="燒焦"
                  className="w-40 h-40 hover:scale-110 transition-transform duration-300"
                />
              )}
            </div>
          ))}
        </section>
      </div>


      {/* Game Over Modal */}
      {showResultModal && (
        <div className="absolute inset-0 flex items-center justify-center z-50">

          {/* Modal 主體 */}
          <div className="bg-[#F5EFE1] rounded-3xl w-[520px] h-[380px] flex flex-col items-center justify-center shadow-2xl p-10 mx-4">
            <img
                src={isWin ? '/images/win.png' : '/images/fail.png'}
                alt={isWin ? '成功' : '失敗'}
                className="w-30 h-30 mb-2"
            />
            <h2 className={`text-5xl font-extrabold mb-12 ${isWin ? 'text-[#505166]' : 'text-[#505166]'}`}>
              {isWin ? '挑戰成功' : '挑戰失敗'}
            </h2>
            <div className="flex justify-center gap-8">
              <button
                className="w-[200px] h-[65px] bg-[#C5AC6B] hover:scale-105 transition-transform duration-300 text-white text-[22px] font-bold py-2 px-4 rounded-2xl"
                onClick={() => setShowResultModal(false)}
              >
                回到首頁
              </button>
              <button
                className="w-[200px] h-[65px] bg-[#E36B5B] hover:scale-105 transition-transform duration-300 text-white text-[22px] font-bold py-2 px-4 rounded-2xl"
                onClick={handleRestart}
              >
                再玩一次
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}