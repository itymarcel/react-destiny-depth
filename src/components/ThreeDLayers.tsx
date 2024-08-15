import React, { useEffect, useRef } from 'react';

// Utility function to generate a random warm color
const getRandomWarmColor = (): string => {
  const warmColors = [
    '#FF6347', // Tomato
    '#FF4500', // OrangeRed
    '#FF8C00', // DarkOrange
    '#FFA500', // Orange
    '#FFD700', // Gold
    '#FF1493', // DeepPink
    '#FF69B4', // HotPink
    '#FFB6C1', // LightPink
  ];
  return warmColors[Math.floor(Math.random() * warmColors.length)];
};

// Type for component props
interface ThreeDLayersProps {
  numLayers: number;
}

const ThreeDLayers: React.FC<ThreeDLayersProps> = ({ numLayers }) => {
  const layersRef = useRef<HTMLDivElement[]>([]);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const directionFactors = useRef<number[]>([]);

  // Initialize direction factors and random positions for circles
  useEffect(() => {
    directionFactors.current = Array.from({ length: numLayers }, () =>
      Math.random() < 0.5 ? 1 : -1
    );

    layersRef.current.forEach((layer) => {
      const circle = layer.querySelector('.circle') as HTMLDivElement;
      if (circle) {
        const randomX = (Math.random() - 0.5) * 500;
        const randomY = (Math.random() - 0.5) * 500;
        circle.style.transform = `translate(${randomX}px, ${randomY}px)`;
      }
    });
  }, [numLayers]);

  // Mouse movement event listener
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) - 0.5;
      const mouseY = (event.clientY / window.innerHeight) - 0.5;

      targetX.current = mouseX * 0.4;
      targetY.current = mouseY * 0.4;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  function easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  // Animation loop for moving layers
  useEffect(() => {
    const animate = () => {
      const easingFactor = 0.1;
    
      currentX.current += (targetX.current - currentX.current) * easeInOutQuad(easingFactor)
      currentY.current += (targetY.current - currentY.current) * easeInOutQuad(easingFactor)
    
      layersRef.current.forEach((layer, index) => {
        const depthMultiplier: number = 100
        const depth = -index * depthMultiplier + depthMultiplier * layersRef.current.length / 2
        const directionFactor = directionFactors.current[index];
    
        const moveX = currentX.current * depth * 2 * directionFactor;
        const moveY = currentY.current * depth * 2 * directionFactor;
    
        // Calculate rotation based on currentX and currentY
        const rotateX = currentY.current * 90; // Rotation around the X-axis
        const rotateY = currentX.current * 90; // Rotation around the Y-axis

        console.log(rotateX)
    
        // Apply the transform with translation, rotation, and depth
        layer.style.transform = `translateZ(${depth}px) translate(${moveX}px, ${moveY}px) rotateY(${rotateX}deg) rotateZ(${rotateY}deg)`;
    
        const blurAmount = Math.abs(depth) / 50;
        layer.style.filter = `blur(${blurAmount}px)`;
    
        layer.style.zIndex = `${layersRef.current.length - index}`;
      });
    
      requestAnimationFrame(animate);
    };
    

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative w-full h-full max-h-full max-w-full overflow-hidden flex justify-center items-center perspective-[1500px] bg-gradient-to-r from-red-500/10" 
      style={{perspective: '1000px'}}>
      {Array.from({ length: numLayers }).map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) layersRef.current[index] = el;
          }}
          className="absolute w-full h-full flex justify-center items-center"
        >
          <div
            className="circle w-[100px] h-[100px] rounded-full border-4 bg-black"
            style={{
              borderColor: getRandomWarmColor(),
              boxShadow: `0px 0px 30px ${getRandomWarmColor()}`,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default ThreeDLayers;
