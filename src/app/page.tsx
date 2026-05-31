"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md">
        <h1 className="text-2xl font-bold tracking-wide">
          VibeSpace
        </h1>

        <a
          href="/explore"
          className="px-5 py-2 rounded-full bg-white text-black font-medium hover:scale-105 transition"
        >
          Enter
        </a>
      </nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center text-center px-6 pt-32"
      >
        <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl top-20 left-10"></div>

        <div className="absolute w-72 h-72 bg-pink-500/20 rounded-full blur-3xl bottom-10 right-10"></div>

        <p className="uppercase tracking-[0.3em] text-sm text-white/50 mb-6">
          Anonymous • Emotional • Real
        </p>

        <h1 className="text-6xl md:text-8xl font-black leading-tight max-w-5xl">
          Share Your
          <span className="text-purple-400"> Vibes </span>
          Without Fear
        </h1>

        <p className="mt-8 text-white/60 max-w-2xl text-lg">
          A cinematic social space where emotions matter more than followers.
          Post thoughts, confessions, late-night feelings, and connect through vibes.
        </p>

        <div className="flex gap-5 mt-10">
          <a
            href="/post"
            className="px-8 py-4 rounded-full bg-purple-500 hover:bg-purple-400 transition font-semibold"
          >
            Start Posting
          </a>

          <a
            href="/explore"
            className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 transition"
          >
            Explore Vibes
          </a>
        </div>
      </motion.section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 px-8 py-24">

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
        >
          <h2 className="text-2xl font-bold mb-3">
            Mood Reactions
          </h2>

          <p className="text-white/60">
            React using emotions instead of boring likes.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
        >
          <h2 className="text-2xl font-bold mb-3">
            Anonymous Posting
          </h2>

          <p className="text-white/60">
            Express thoughts freely without social pressure.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
        >
          <h2 className="text-2xl font-bold mb-3">
            Late Night Vibes
          </h2>

          <p className="text-white/60">
            Discover real emotions from people around the world.
          </p>
        </motion.div>

      </section>

    </main>
  );
}