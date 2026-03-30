import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock3, CircleHelp, Gift, Target, Play, RotateCcw } from "lucide-react";

const QUESTIONS = [
  {
    question: "Quel est le maillot principal de l’équipe de France de rugby ?",
    options: ["Bleu", "Rouge", "Vert", "Noir"],
    answer: 0,
  },
  {
    question: "Comment s’appelle le championnat principal de rugby en France ?",
    options: ["Pro League", "Top 14", "Rugby Cup", "Elite 12"],
    answer: 1,
  },
  {
    question: "Dans quel stade joue le Stade Français ?",
    options: ["Stade de France", "Stade Jean Bouin", "Parc des Princes", "Matmut Atlantique"],
    answer: 1,
  },
  {
    question: "Combien de points vaut un essai ?",
    options: ["3", "5", "7", "2"],
    answer: 1,
  },
  {
    question: "Quel animal est le symbole de l’équipe de France de rugby ?",
    options: ["Le lion", "Le coq", "Le taureau", "L’aigle"],
    answer: 1,
  },
];

const FINAL_VIDEO_URL = "/finale-anniversaire.mp4"; // Remplace par ton fichier vidéo final
const GAME_TITLE = "Défi Rugby Surprise";
const PLAYER_NAME = "Marley";

function getQuestionCountFromScore(score) {
  if (score >= 8) return 1;
  if (score >= 6) return 2;
  if (score >= 4) return 3;
  if (score >= 2) return 4;
  return 5;
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function RugbyBall({ small = false }) {
  return (
    <div
      className={`${small ? "w-14 h-10" : "w-20 h-14"} relative rounded-full border-2 border-amber-900 bg-gradient-to-br from-amber-600 to-amber-800 shadow-lg`}
      style={{ borderRadius: "55% 55% 55% 55% / 65% 65% 65% 65%" }}
    >
      <div className="absolute inset-y-1 left-1/2 w-[2px] -translate-x-1/2 bg-amber-100/70" />
      <div className="absolute left-1/2 top-1/2 h-[2px] w-8 -translate-x-1/2 -translate-y-1/2 bg-amber-100/80" />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-[3px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="h-3 w-[2px] rounded-full bg-amber-100/80" />
        ))}
      </div>
    </div>
  );
}

function RugbyPosts() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center">
      <div className="relative h-56 w-52">
        <div className="absolute bottom-0 left-1/2 h-44 w-2 -translate-x-1/2 rounded-full bg-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.35)]" />
        <div className="absolute bottom-40 left-1/2 h-2 w-28 -translate-x-1/2 rounded-full bg-yellow-300" />
        <div className="absolute bottom-40 left-[calc(50%-56px)] h-28 w-2 rounded-full bg-yellow-300" />
        <div className="absolute bottom-40 left-[calc(50%+54px)] h-28 w-2 rounded-full bg-yellow-300" />
      </div>
    </div>
  );
}

function ConfettiBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
          animate={{
            opacity: 0,
            x: (i - 8) * 20,
            y: 80 + (i % 4) * 18,
            rotate: i * 25,
            scale: 1.2,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute left-1/2 top-1/3 h-3 w-2 rounded-sm bg-white"
        />
      ))}
    </div>
  );
}

export default function JeuAnniversaireRugbyMobile() {
  const [screen, setScreen] = useState("home");
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [shotActive, setShotActive] = useState(false);
  const [ballX, setBallX] = useState(50);
  const [aimDirection, setAimDirection] = useState(1);
  const [showGoalFlash, setShowGoalFlash] = useState(false);
  const [questionsPool, setQuestionsPool] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [goodAnswers, setGoodAnswers] = useState(0);
  const [selectedBall, setSelectedBall] = useState(null);
  const [videoUnlocked, setVideoUnlocked] = useState(false);
  const aimRef = useRef(null);

  const questionCount = useMemo(() => getQuestionCountFromScore(score), [score]);

  useEffect(() => {
    if (screen !== "game") return;
    if (timeLeft <= 0) {
      const chosen = shuffleArray(QUESTIONS).slice(0, getQuestionCountFromScore(score));
      setQuestionsPool(chosen);
      setScreen("quiz");
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [screen, timeLeft, score]);

  useEffect(() => {
    if (screen !== "game" || shotActive) return;
    const interval = setInterval(() => {
      setBallX((current) => {
        const next = current + aimDirection * 2.5;
        if (next >= 82) {
          setAimDirection(-1);
          return 82;
        }
        if (next <= 18) {
          setAimDirection(1);
          return 18;
        }
        return next;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [screen, aimDirection, shotActive]);

  const resetAll = () => {
    setScreen("home");
    setTimeLeft(10);
    setScore(0);
    setShots(0);
    setShotActive(false);
    setBallX(50);
    setAimDirection(1);
    setShowGoalFlash(false);
    setQuestionsPool([]);
    setQuestionIndex(0);
    setGoodAnswers(0);
    setSelectedBall(null);
    setVideoUnlocked(false);
  };

  const startGame = () => {
    setTimeLeft(10);
    setScore(0);
    setShots(0);
    setShotActive(false);
    setBallX(50);
    setShowGoalFlash(false);
    setQuestionIndex(0);
    setGoodAnswers(0);
    setSelectedBall(null);
    setVideoUnlocked(false);
    setScreen("game");
  };

  const shoot = () => {
    if (screen !== "game" || shotActive || timeLeft <= 0) return;
    setShotActive(true);
    setShots((s) => s + 1);
    const currentX = ballX;
    const isGoal = currentX >= 38 && currentX <= 62;

    setTimeout(() => {
      if (isGoal) {
        setScore((s) => s + 2);
        setShowGoalFlash(true);
        setTimeout(() => setShowGoalFlash(false), 900);
      }
      setShotActive(false);
    }, 850);
  };

  const answerQuestion = (optionIndex) => {
    const current = questionsPool[questionIndex];
    if (!current) return;

    if (optionIndex === current.answer) {
      setGoodAnswers((n) => n + 1);
    }

    if (questionIndex + 1 >= questionsPool.length) {
      setScreen("choose");
    } else {
      setQuestionIndex((i) => i + 1);
    }
  };

  const chooseWinningBall = (index) => {
    setSelectedBall(index);
    setTimeout(() => {
      setVideoUnlocked(true);
      setScreen("final");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-950 via-blue-900 to-emerald-900 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-5">
        <AnimatePresence mode="wait">
          {screen === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-1 flex-col justify-center gap-4"
            >
              <div className="text-center">
                <p className="mb-2 text-sm uppercase tracking-[0.35em] text-blue-200">Anniversaire</p>
                <h1 className="text-4xl font-black leading-tight">{GAME_TITLE}</h1>
                <p className="mt-3 text-base text-blue-100">
                  {PLAYER_NAME}, relève les 3 épreuves pour découvrir ta surprise finale.
                </p>
              </div>

              <Card className="rounded-3xl border-white/10 bg-white/10 backdrop-blur">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-yellow-300" />
                    <p className="text-sm">Épreuve 1 : marque un maximum de points en 10 secondes.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CircleHelp className="h-5 w-5 text-yellow-300" />
                    <p className="text-sm">Épreuve 2 : plus tu marques, moins tu as de questions.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Gift className="h-5 w-5 text-yellow-300" />
                    <p className="text-sm">Épreuve 3 : choisis un ballon pour révéler ton cadeau.</p>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={startGame} className="h-14 rounded-2xl bg-yellow-400 text-base font-bold text-slate-950 hover:bg-yellow-300">
                <Play className="mr-2 h-5 w-5" />
                Commencer le défi
              </Button>
            </motion.div>
          )}

          {screen === "game" && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col gap-4"
            >
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-blue-200">Épreuve 1</p>
                  <p className="text-lg font-bold">Tirs entre les poteaux</p>
                </div>
                <div className="text-right">
                  <p className="flex items-center justify-end gap-1 text-sm text-yellow-200"><Clock3 className="h-4 w-4" /> {timeLeft}s</p>
                  <p className="text-2xl font-black">{score} pts</p>
                </div>
              </div>

              <div className="relative flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-500 shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-28 bg-white/20" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-emerald-700/70" />
                <div className="absolute inset-x-0 bottom-24 h-[2px] bg-white/40" />
                <RugbyPosts />

                <div ref={aimRef} className="absolute inset-x-0 bottom-12 h-24">
                  {!shotActive ? (
                    <motion.div
                      animate={{ x: `calc(${ballX}% - 40px)` }}
                      transition={{ type: "tween", duration: 0.03, ease: "linear" }}
                      className="absolute bottom-0"
                    >
                      <RugbyBall />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ x: `calc(${ballX}% - 40px)`, y: 0, scale: 1 }}
                      animate={{ x: `calc(${ballX}% - 40px)`, y: -360, scale: 0.45 }}
                      transition={{ duration: 0.85, ease: "easeOut" }}
                      className="absolute bottom-0"
                    >
                      <RugbyBall />
                    </motion.div>
                  )}
                </div>

                <div className="absolute inset-x-0 bottom-3 px-3">
                  <div className="rounded-2xl bg-slate-950/25 p-3 text-center text-sm font-medium backdrop-blur-sm">
                    Appuie quand le ballon est bien aligné pour tirer.
                  </div>
                </div>

                {showGoalFlash && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="rounded-3xl bg-yellow-300 px-6 py-3 text-3xl font-black text-slate-950 shadow-2xl">
                        +2 POINTS !
                      </div>
                    </motion.div>
                    <ConfettiBurst />
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Card className="rounded-3xl border-white/10 bg-white/10 backdrop-blur">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.25em] text-blue-200">Tirs</p>
                    <p className="mt-1 text-2xl font-black">{shots}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-white/10 bg-white/10 backdrop-blur">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.25em] text-blue-200">Questions prévues</p>
                    <p className="mt-1 text-2xl font-black">{questionCount}</p>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={shoot} disabled={shotActive} className="h-14 rounded-2xl bg-yellow-400 text-base font-bold text-slate-950 hover:bg-yellow-300 disabled:opacity-70">
                Tirer
              </Button>
            </motion.div>
          )}

          {screen === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-1 flex-col justify-center gap-4"
            >
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-blue-200">Épreuve 2</p>
                <h2 className="text-3xl font-black">Quiz rugby</h2>
                <p className="mt-2 text-sm text-blue-100">
                  Tu as marqué <span className="font-bold text-yellow-300">{score} points</span>, donc tu n'as que <span className="font-bold text-yellow-300">{questionsPool.length}</span> question{questionsPool.length > 1 ? "s" : ""}.
                </p>
              </div>

              <Progress value={((questionIndex + 1) / Math.max(questionsPool.length, 1)) * 100} className="h-3 bg-white/15" />

              {questionsPool[questionIndex] && (
                <Card className="rounded-3xl border-white/10 bg-white/10 backdrop-blur">
                  <CardContent className="p-5">
                    <p className="mb-4 text-sm text-blue-200">
                      Question {questionIndex + 1} / {questionsPool.length}
                    </p>
                    <h3 className="text-xl font-bold leading-snug">{questionsPool[questionIndex].question}</h3>
                    <div className="mt-5 grid gap-3">
                      {questionsPool[questionIndex].options.map((option, idx) => (
                        <Button
                          key={idx}
                          onClick={() => answerQuestion(idx)}
                          variant="outline"
                          className="h-auto min-h-14 justify-start whitespace-normal rounded-2xl border-white/20 bg-slate-950/20 px-4 py-3 text-left text-white hover:bg-white/15"
                        >
                          <span className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {screen === "choose" && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-1 flex-col justify-center gap-5"
            >
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-blue-200">Épreuve 3</p>
                <h2 className="text-3xl font-black">Choisis ton ballon</h2>
                <p className="mt-2 text-sm text-blue-100">
                  Score au tir : <span className="font-bold text-yellow-300">{score} pts</span> · Bonnes réponses : <span className="font-bold text-yellow-300">{goodAnswers}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((ball) => (
                  <motion.button
                    key={ball}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => chooseWinningBall(ball)}
                    disabled={selectedBall !== null}
                    className={`rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur transition ${selectedBall === ball ? "ring-4 ring-yellow-300" : ""}`}
                  >
                    <div className="mx-auto mb-3 w-fit">
                      <RugbyBall small={false} />
                    </div>
                    <p className="text-center text-sm font-semibold">Ballon {ball}</p>
                  </motion.button>
                ))}
              </div>

              <p className="text-center text-xs text-blue-200">Un seul choix possible...</p>
            </motion.div>
          )}

          {screen === "final" && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col justify-center gap-4"
            >
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-blue-200">Surprise finale</p>
                <h2 className="text-3xl font-black">Bravo !</h2>
                <p className="mt-2 text-sm text-blue-100">
                  Ton ballon {selectedBall} révèle maintenant la vidéo du cadeau.
                </p>
              </div>

              <Card className="overflow-hidden rounded-3xl border-white/10 bg-black/30 backdrop-blur">
                <CardContent className="p-0">
                  {videoUnlocked ? (
                    <video
                      src={FINAL_VIDEO_URL}
                      controls
                      playsInline
                      autoPlay
                      className="aspect-[9/16] w-full bg-black object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[9/16] items-center justify-center bg-slate-950 text-white">
                      Chargement de la surprise...
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card className="rounded-3xl border-white/10 bg-white/10 backdrop-blur">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.25em] text-blue-200">Score</p>
                    <p className="mt-1 text-2xl font-black">{score} pts</p>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-white/10 bg-white/10 backdrop-blur">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.25em] text-blue-200">Quiz</p>
                    <p className="mt-1 text-2xl font-black">{goodAnswers}/{questionsPool.length}</p>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={resetAll} variant="outline" className="h-14 rounded-2xl border-white/20 bg-white/10 text-white hover:bg-white/15">
                <RotateCcw className="mr-2 h-5 w-5" />
                Rejouer
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
