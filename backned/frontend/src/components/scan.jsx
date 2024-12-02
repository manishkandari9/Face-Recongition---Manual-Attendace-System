// import React, { useRef, useEffect, useState } from "react";
// import * as faceapi from "face-api.js";
// import axios from "axios";
// import "./Scan.css";

// const Scan = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [attendanceMarked, setAttendanceMarked] = useState(false);
//   const [registerMode, setRegisterMode] = useState(false);
//   const [studentId, setStudentId] = useState("");
//   const [name, setName] = useState("");
//   const [recognizedInfo, setRecognizedInfo] = useState(null);

//   const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         console.log("Loading face recognition models...");
//         const MODEL_URL = `${process.env.PUBLIC_URL}/models`;

//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//           faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//           faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
//         ]);
//         console.log("All models loaded successfully");
//         setLoading(false);
//         startVideo();
//       } catch (error) {
//         console.error("Error loading models:", error);
//         alert("Failed to load face recognition models. Please try again.");
//       }
//     };

//     loadModels();
//   }, []);

//   const startVideo = () => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true })
//       .then((stream) => {
//         videoRef.current.srcObject = stream;
//       })
//       .catch((err) => {
//         console.error("Error accessing webcam:", err);
//         alert("Unable to access webcam. Please check permissions.");
//       });
//   };

//   const handleScan = async () => {
//     try {
//       const detections = await faceapi
//         .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptors();

//       if (detections.length > 0) {
//         const descriptor = Array.from(detections[0].descriptor);

//         const response = await axios.post(`${BASE_URL}/attendance/mark`, {
//           faceDescriptor: descriptor,
//         });

//         if (response.data.success) {
//           const { name, studentId } = response.data.student;
//           setAttendanceMarked(true);
//           setRecognizedInfo({ name, studentId });

//           alert(`Attendance marked successfully for ${name} (${studentId})!`);
//         } else {
//           alert(response.data.message || "Face not recognized. Please try again.");
//         }
//       } else {
//         alert("No face detected. Please ensure proper lighting and try again.");
//       }
//     } catch (error) {
//       console.error("Error during attendance scanning:", error);
//       alert("An error occurred during attendance scanning. Please try again.");
//     }
//   };

//   const handleRegister = async () => {
//     if (!studentId || !name) {
//       alert("Please enter both student ID and name.");
//       return;
//     }

//     try {
//       const detection = await faceapi
//         .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptor();

//       if (detection) {
//         const descriptor = Array.from(detection.descriptor);

//         const response = await axios.post(`${BASE_URL}/students/register`, {
//           studentId,
//           name,
//           faceDescriptor: descriptor,
//         });

//         if (response.status === 201) {
//           alert(`Student ${name} (${studentId}) registered successfully!`);
//           setStudentId("");
//           setName("");
//         } else {
//           alert(response.data.message || "Failed to register student. Please try again.");
//         }
//       } else {
//         alert("No face detected. Please ensure proper lighting and try again.");
//       }
//     } catch (error) {
//       console.error("Error registering student:", error);
//       alert("An error occurred during student registration. Please try again.");
//     }
//   };

//   return (
//     <div className="containerr">
//       <h1 className="title">Face Recognition Attendance System</h1>

//       {loading ? (
//         <p>Loading face recognition models...</p>
//       ) : (
//         <div className="content">
//           <video ref={videoRef} autoPlay muted className="video" />
//           <canvas ref={canvasRef} className="overlay" />

//           <div className="controls">
//             {!registerMode ? (
//               <>
//                 <button onClick={handleScan} className="btn">
//                   Mark Attendance
//                 </button>
//                 {attendanceMarked && recognizedInfo && (
//                   <p className="status">
//                     Attendance marked for {recognizedInfo.name} ({recognizedInfo.studentId})
//                   </p>
//                 )}
//               </>
//             ) : (
//               <div className="register">
//                 <input
//                   type="text"
//                   value={studentId}
//                   onChange={(e) => setStudentId(e.target.value)}
//                   placeholder="Enter Student ID"
//                   className="input"
//                 />
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Enter Student Name"
//                   className="input"
//                 />
//                 <button onClick={handleRegister} className="btn">
//                   Register Student
//                 </button>
//               </div>
//             )}
//           </div>
//           <button
//             onClick={() => setRegisterMode(!registerMode)}
//             className="btn switch-mode-btn"
//           >
//             {registerMode ? "Switch to Attendance Mode" : "Switch to Register Mode"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Scan;
