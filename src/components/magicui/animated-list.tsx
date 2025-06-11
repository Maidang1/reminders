import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedListItem {
  id: string | number;
  content: React.ReactNode;
}

interface AnimatedListProps {
  items: AnimatedListItem[];
  delay?: number;
  className?: string;
}

export default function AnimatedList({ items, delay = 1000, className }: AnimatedListProps) {
  const [visibleItems, setVisibleItems] = React.useState<AnimatedListItem[]>([]);

  React.useEffect(() => {
    setVisibleItems([]);
    const timeouts: NodeJS.Timeout[] = [];

    items.forEach((item, index) => {
      const timeout = setTimeout(() => {
        setVisibleItems((prev) => [...prev, item]);
      }, index * delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [items, delay]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {visibleItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
            delay: 0.1,
          }}
        >
          {item.content}
        </motion.div>
      ))}
    </div>
  );
}
