import React, { useRef, useState, useEffect } from 'react';

const segmentsCount = 70;
const colors = Array.from({ length: segmentsCount }, (_, i) => `hsl(${(i * 360) / segmentsCount}, 85%, 60%)`);
const segments = Array.from({ length: segmentsCount }, (_, i) => (i + 1).toString());

function Wheel({ assignedNumber, onSpinComplete }) {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);

  // Draw the wheel
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const radius = width / 2;
    const anglePerSegment = (2 * Math.PI) / segmentsCount;

    ctx.clearRect(0, 0, width, width);

    for (let i = 0; i < segmentsCount; i++) {
      const startAngle = i * anglePerSegment;
      const endAngle = (i + 1) * anglePerSegment;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, startAngle, endAngle);
      ctx.fillStyle = colors[i];
      ctx.fill();
      ctx.strokeStyle = '#ffffffff';
      ctx.stroke();

      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#040303ff';
      ctx.font = `${Math.max(10, Math.floor(width * 0.03))}px Arial`;
      ctx.fillText(i + 1, radius - 10, 7);
      ctx.restore();
    }
  };

  useEffect(drawWheel, [angle]);

  useEffect(() => {
    if (!assignedNumber) return;
    setIsSpinning(true);
    setResult(null);

    // Math for TOP pointer (12 o’clock, correction = 270)
    const anglePerSegment = 360 / segmentsCount;
    const pointerCorrection = 270;
    const spins = 7;
    const targetIndex = assignedNumber - 1;
    const targetAngle =
      spins * 360 +
      ((segmentsCount - targetIndex) * anglePerSegment) -
      anglePerSegment / 2 +
      pointerCorrection;

    let animationFrame;
    const duration = 4000;
    const start = performance.now();

    function easeOut(t, b, c, d) {
      t /= d;
      t--;
      return c * (t * t * t + 1) + b;
    }

    function animate(now) {
      const elapsed = now - start;
      if (elapsed < duration) {
        const eased = easeOut(elapsed, 0, targetAngle, duration);
        setAngle(eased % 360);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setAngle(targetAngle % 360);
        setIsSpinning(false);
        setResult(assignedNumber);
        if (typeof onSpinComplete === 'function') onSpinComplete();
      }
    }

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [assignedNumber]);

  return (
    <div
      style={{
        position: 'relative',
        width: '95vw',
        maxWidth: 400,
        margin: 'auto',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -28,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 28,
          color: 'black',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        ▼
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{
          width: '100%',
          height: 'auto',
          transform: `rotate(${angle}deg)`,
          transformOrigin: '50% 50%',
          transition: isSpinning ? 'none' : 'transform 0.3s ease-out',
          border: '2px solid #ccc',
          background: 'white',
          borderRadius: '50%',
        }}
      />
      {result && (
        <div
          style={{
            marginTop: 12,
            color: 'green',
            fontWeight: 'bold',
            fontSize: 30,
          }}
        >
          You won: {result}
        </div>
      )}
    </div>
  );
}

export default Wheel;
