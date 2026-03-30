import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const IntroScreen = ({ onComplete }) => {
  const [animationStage, setAnimationStage] = useState("entering");

  useEffect(() => {


    // Lock scroll only
    document.body.style.overflow = "hidden";

    const timer1 = setTimeout(() => {
      setAnimationStage("visible");
    }, 500);

    const timer2 = setTimeout(() => {
      setAnimationStage("exiting");
    }, 2500);

    const timer3 = setTimeout(() => {
      document.body.style.overflow = "auto";
      onComplete?.(); // parent controls unmount
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      document.body.style.overflow = "auto";
    };
  }, [onComplete]);


  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0A0A0A",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom right, #0A0A0A, #0A0A0A, #0A0A0A)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "500px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(230, 194, 0, 0.05)",
              borderRadius: "9999px",
              filter: "blur(64px)",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(230, 194, 0, 0.1)",
              borderRadius: "9999px",
              filter: "blur(64px)",
              animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
              opacity: 0.2,
            }}
          />
        </div>

        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "4px",
              height: "4px",
              backgroundColor: "rgba(230, 194, 0, 0.3)",
              borderRadius: "9999px",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content - Fixed with proper width and padding */}
      <div 
        style={{ 
          position: "relative", 
          zIndex: 10, 
          textAlign: "center",
          width: "100%",
          padding: "0 40px", // Increased horizontal padding
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box" // Important for proper padding calculation
        }}
      >
        <div
          style={{
            transition: "all 1000ms",
            transform:
              animationStage === "entering"
                ? "scale(0.5)"
                : animationStage === "visible"
                ? "scale(1)"
                : "scale(1.5)",
            opacity:
              animationStage === "entering"
                ? 0
                : animationStage === "visible"
                ? 1
                : 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            overflow: "visible" // Ensure no clipping
          }}
        >
          <h1
            style={{
              fontFamily: "Caveat, cursive",
              fontSize: "clamp(4rem, 20vw, 16rem)",
              background:
                "linear-gradient(to right, #E6C200, #F5D742, #E6C200)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradient-x 3s ease infinite",
              whiteSpace: "nowrap",
              margin: 0,
              padding: "0 20px", // Add padding to text
              lineHeight: 1.2,
              letterSpacing: "2px",
              display: "inline-block", // Ensure text takes full width
              maxWidth: "100%",
              boxSizing: "border-box"
            }}
          >
            ORION
          </h1>
        </div>

        <div
          style={{
            marginTop: "1.5rem",
            transition: "all 1000ms 300ms",
            transform:
              animationStage === "entering"
                ? "translateY(40px)"
                : "translateY(0)",
            opacity: animationStage === "entering" ? 0 : 1,
            width: "100%",
            textAlign: "center"
          }}
        >
          <p style={{ 
            color: "#B3B3B3", 
            letterSpacing: "0.3em",
            fontSize: "clamp(0.75rem, 2vw, 1rem)",
            margin: 0,
            padding: "0 20px"
          }}>
            Where Conversations
          </p>
          <p style={{ 
            color: "#E6C200", 
            marginTop: "0.5rem",
            fontSize: "clamp(1rem, 3vw, 1.5rem)",
            fontWeight: 300,
            padding: "0 20px"
          }}>
            Come to Life
          </p>
        </div>

        {/* Sparkle icons */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            animation: "spin 20s linear infinite",
            opacity: 0.2,
          }}
        >
          <Sparkles size={30} color="#E6C200" />
        </div>
        
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            animation: "spin 20s linear infinite reverse",
            opacity: 0.2,
          }}
        >
          <Sparkles size={40} color="#E6C200" />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        @keyframes gradient-x {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default IntroScreen;