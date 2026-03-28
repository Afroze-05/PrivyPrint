import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, ShieldCheck, ArrowRight } from "lucide-react";

export default function LoginSelection() {
  // Animation variants for a staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };
  console.log(motion);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full"
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            variants={itemVariants}
            className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full"
          >
            Secure Document Gateway
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Welcome to <span className="text-blue-600">PrivyPrint</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg text-slate-600 max-w-lg mx-auto"
          >
            Select your portal to access secure, AI-monitored document handling
            and print services.
          </motion.p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Login Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group"
          >
            <Link
              to="/login"
              className="flex flex-col h-full bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <User size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Customer Portal
              </h3>
              <p className="text-slate-500 mb-8 leading-relaxed flex-grow">
                Log in to upload sensitive documents, generate secure print
                tokens, and view your printing history.
              </p>
              <div className="flex items-center text-blue-600 font-bold uppercase text-xs tracking-widest pt-4">
                Enter Portal{" "}
                <ArrowRight
                  size={16}
                  className="ml-2 group-hover:translate-x-2 transition-transform"
                />
              </div>
            </Link>
          </motion.div>

          {/* Admin Login Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group"
          >
            <Link
              to="/admin/login"
              className="flex flex-col h-full bg-slate-900 p-8 rounded-3xl shadow-sm border-2 border-slate-800 hover:border-blue-400 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-slate-800 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Admin Control
              </h3>
              <p className="text-slate-400 mb-8 leading-relaxed flex-grow">
                Access the secure dashboard to manage print logs, monitor trust
                scores, and oversee hardware alerts.
              </p>
              <div className="flex items-center text-blue-400 font-bold uppercase text-xs tracking-widest pt-4">
                System Access{" "}
                <ArrowRight
                  size={16}
                  className="ml-2 group-hover:translate-x-2 transition-transform"
                />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Signup Prompt */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-slate-500 font-medium">
            New to PrivyPrint?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-bold hover:underline ml-1"
            >
              Create an account
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
