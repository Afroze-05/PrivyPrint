import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function StarRating({
  value = 0,
  onChange,
  readonly = false,
  size = "w-8 h-8",
  showValue = true,
  className = ""
}) {
  const [hoverValue, setHoverValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStarClick = (rating) => {
    if (readonly) return;
    
    setIsAnimating(true);
    if (onChange) {
      onChange(rating);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleMouseEnter = (rating) => {
    if (readonly) return;
    setHoverValue(rating);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverValue(0);
  };

  const displayValue = hoverValue || value;
  const fullStars = Math.floor(displayValue);
  const hasHalfStar = displayValue % 1 !== 0;

  const getStarColor = (starIndex) => {
    const isActive = starIndex <= displayValue;
    const isHovering = starIndex <= hoverValue;
    
    if (readonly) {
      return isActive ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600';
    }
    
    if (isHovering && !readonly) {
      return 'text-yellow-300 fill-yellow-300';
    }
    
    return isActive ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600';
  };

  const getStarAnimation = (starIndex) => {
    if (isAnimating && starIndex <= value) {
      return {
        scale: [1, 1.2, 1],
        rotate: [0, 10, -10, 0],
        transition: { duration: 0.3 }
      };
    }
    
    if (starIndex <= hoverValue && !readonly) {
      return {
        scale: 1.1,
        transition: { duration: 0.2 }
      };
    }
    
    return {};
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className="flex items-center gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            className={`${size} transition-all duration-200 ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
            style={{
              filter: star <= hoverValue && !readonly ? 'brightness(1.2)' : 'brightness(1)',
            }}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            animate={getStarAnimation(star)}
          >
            <Star 
              className={`w-full h-full transition-colors duration-200 ${getStarColor(star)}`}
              strokeWidth={1.5}
            />
          </motion.button>
        ))}
      </div>
      
      {showValue && (
        <motion.span 
          className="text-sm font-medium text-gray-300 ml-2"
          animate={{ 
            scale: isAnimating ? [1, 1.1, 1] : 1,
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 0.3 }}
        >
          {value > 0 ? `${value.toFixed(1)} out of 5` : "Select a rating"}
        </motion.span>
      )}
    </div>
  );
}
