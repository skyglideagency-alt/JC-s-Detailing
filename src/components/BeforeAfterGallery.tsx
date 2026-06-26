import React from "react";
import { motion } from "motion/react";

interface GalleryItem {
  id: string;
  category: string;
  title: string;
  imgUrl: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "project-1",
    category: "Signature Detailing",
    title: "Stage-3 Paint Correction & Ceramic Seal",
    imgUrl: "https://lh3.googleusercontent.com/d/1qyzdiU0U9XOfN-9EsxjqM_UqqVjPSOlc",
  },
  {
    id: "project-2",
    category: "Optimum Restoration",
    title: "Precision Multi-Stage Rejuvenation",
    imgUrl: "https://lh3.googleusercontent.com/d/1n9Kwllkn_yRg8VKmhe-zmo1E1YDeGSPz",
  },
  {
    id: "project-3",
    category: "Premium Protective Finish",
    title: "Bespoke Ceramic Coating & Protection",
    imgUrl: "https://lh3.googleusercontent.com/d/1H532PDJuOS_mIeNa5wAx2LTjBfX-7oyt",
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.95, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      mass: 1.1
    }
  }
};

export default function BeforeAfterGallery() {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
    >
      {GALLERY_ITEMS.map((item) => (
        <motion.div
          key={item.id}
          variants={cardVariant}
          whileHover={{ 
            y: -8, 
            scale: 1.02, 
            boxShadow: "0 20px 40px rgba(212,175,55,0.1)",
            transition: { type: "spring", stiffness: 400, damping: 20 }
          }}
          id={`gallery-card-${item.id}`}
          className="bg-[#0b0f19]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-[#d4af37]/30 transition-colors duration-500 group flex flex-col shadow-2xl cursor-pointer"
        >
          {/* Image Section */}
          <div className="relative overflow-hidden aspect-[4/3] bg-black/40">
            <img
              src={item.imgUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Minimal details: Just Category and Treatment Title */}
          <div className="p-5 flex-1 flex flex-col justify-center bg-black/20">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#d4af37]">
              {item.category}
            </span>
            <h3 className="text-xs font-bold text-white uppercase tracking-tight mt-2 leading-snug group-hover:text-[#d4af37] transition-colors duration-300">
              {item.title}
            </h3>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
