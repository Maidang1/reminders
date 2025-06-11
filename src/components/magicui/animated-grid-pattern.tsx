import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedGridPatternProps {
  className?: string;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

export default function AnimatedGridPattern({
  className,
  numSquares = 30,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
}: AnimatedGridPatternProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5">
        <svg width="100%" height="100%" className="h-full w-full">
          <defs>
            <pattern
              id="grid-pattern"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
              x="50%"
              y="50%"
            >
              <path
                d="M0 32V.5H32"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
      
      {Array.from({ length: numSquares }, (_, i) => (
        <motion.div
          key={i}
          className="absolute h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, maxOpacity, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration,
            repeat: Infinity,
            repeatDelay,
            delay: Math.random() * duration,
          }}
        />
      ))}
    </div>
  );
}
