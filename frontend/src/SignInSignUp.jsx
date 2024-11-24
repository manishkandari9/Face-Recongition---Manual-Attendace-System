import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography } from '@mui/material';
import axios from 'axios';
import './SignInSignUp.css';
import * as THREE from 'three';
import { Lock, Unlock, User, Mail, Key } from 'lucide-react'; // Imported icons

function SignInSignUp() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const handleToggle = () => {
    setIsSignIn(!isSignIn);
    setError('');
    setIdentifier('');
    setPassword('');
  };

  const validateIdentifier = () => {
    if (!identifier) {
      setError('Please enter your email or roll number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateIdentifier()) {
      return; // Stop if validation fails
    }

    const endpoint = isSignIn ? 'signin' : 'signup';
    const data = { identifier, password };
    try {
      console.log("Sending request to authenticate...");
      const response = await axios.post(`http://localhost:3000/api/auth/${endpoint}`, data);
    
      console.log("Response received:", response);
    
      if (response.status === 200 || response.status === 201) {
        const token = response.data.token;
        console.log("Authentication successful. Token received:", token);
    
        // Store the token in localStorage
        localStorage.setItem('token', token);
    
        // Navigate to dashboard
        console.log("Navigating to dashboard...");
        navigate('/dashboard');
      } else {
        console.log("Authentication failed. Status code:", response.status);
        setError('Failed to authenticate. Please check your credentials.');
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      setError(error.response?.data?.message || 'Invalid credentials. Please try again.');
    }
    
  };

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    const particles = [];

    for (let i = 0; i < 100; i++) {
      const geometry = new THREE.PlaneGeometry(0.2, 0.2);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: Math.random() * 0.5 + 0.1,
        side: THREE.DoubleSide,
      });
      const particle = new THREE.Mesh(geometry, material);

      particle.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
      particle.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);

      scene.add(particle);
      particles.push(particle);
    }

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      particles.forEach((particle) => {
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
        particle.position.y += Math.sin(Date.now() * 0.001 + particle.position.x) * 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId); // Stop the animation loop
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800">
      {/* Animated Icons */}
      <div className="absolute inset-0 pointer-events-none">
  {[Lock, Unlock, User, Mail, Key].map((Icon, index) => (
    <Icon
      key={index}
      className="absolute text-white/30 animate-float"
      size={48}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 10 + 5}s`,
        animationDelay: `${Math.random() * 5}s`,
      }}
    />
  ))}
</div>

      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Gradient Overlay for Bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Form Container */}
      <Container
        maxWidth="xs"
        className="form-container"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly darker background for contrast
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.6)', // Strong shadow for depth
        }}
      >
        <Typography variant="h4" gutterBottom color="white" style={{ fontWeight: 'bold', letterSpacing: '1px' }}>
          {isSignIn ? 'Sign in' : 'Sign up'}
        </Typography>
        {error && (
          <Typography color="error" align="center" style={{ marginBottom: '20px' }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label htmlFor="identifier" className="input-label" style={{ color: 'white' }}>
              {isSignIn ? 'Email or Roll Number' : 'Enter Email or Roll Number'}
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              className="custom-input"
              placeholder={isSignIn ? 'Email or Roll Number' : 'Enter Email or Roll Number'}
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label htmlFor="password" className="input-label" style={{ color: 'white' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="custom-input"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            variant="contained"
            fullWidth
            type="submit"
            className="submit-btn"
            style={{
              marginTop: '10px',
              backgroundColor: '#ff9800', // Bright orange button color
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '25px',
              padding: '12px 0', // Button padding
              boxShadow: '0 6px 18px rgba(255, 152, 0, 0.6)',
            }}
          >
            {isSignIn ? 'Sign in' : 'Sign up'}
          </Button>
        </form>

        <Typography variant="body1" align="center" style={{ marginTop: '15px', color: 'white' }}>
          {isSignIn ? "Don't have an account?" : 'Already have an account?'}
          <span
            onClick={handleToggle}
            style={{
              cursor: 'pointer',
              marginLeft: '20px',
              color: '#ff9900',
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
          >
            {isSignIn ? 'Sign up' : 'Sign in'}
          </span>
        </Typography>
      </Container>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(20deg); }
        }

        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.3); }
          50% { text-shadow: 0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.5); }
        }

        .animate-float {
          animation: float 15s infinite ease-in-out;
        }

        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite alternate;
        }

        .animate-pulse {
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default SignInSignUp;

