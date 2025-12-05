'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import HauntedLayout from '@/src/components/HauntedLayout';

export default function NotFound() {
  return (
    <HauntedLayout glowIntensity="medium">
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-9xl mb-8"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💀
          </motion.div>
          
          <h1 className="text-6xl font-creepster text-toxic-green mb-4" style={{ textShadow: '0 0 20px #0f0' }}>
            404
          </h1>
          
          <h2 className="text-3xl font-creepster text-toxic-green mb-6">
            Lost in the Crypt
          </h2>
          
          <p className="text-lg font-mono text-dark-green mb-8 max-w-md mx-auto">
            The spirits have led you astray... This ancient page has been buried forever.
          </p>
          
          <Link href="/">
            <motion.button
              className="px-8 py-4 bg-toxic-green text-black font-mono font-bold uppercase tracking-widest rounded border-2 border-toxic-green"
              style={{ boxShadow: '0 0 30px #0f0' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚡ Return to the Laboratory ⚡
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </HauntedLayout>
  );
}
