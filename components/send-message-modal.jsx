// "use client";
// import { useState } from "react";
// import { Modal, Box, IconButton, CircularProgress } from "@mui/material";
// import { Close, Send, Person, ErrorOutline } from "@mui/icons-material";

// export default function SendMessageModal({ tutor, isOpen, onClose }) {
//   const [message, setMessage] = useState("");
//   const [status, setStatus] = useState("idle");
//   const [errorMessage, setErrorMessage] = useState("");

//   const fullName = `${tutor.first_name} ${tutor.last_name}`;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus("loading");
//     setErrorMessage("");

//     try {
//       const response = await fetch("/api/messages", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           tutorId: tutor.id,
//           message: message,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to send message. Please try again later.");
//       }

//       // Success Logic
//       alert("Success! Your message has been sent to " + tutor.first_name);
//       setMessage("");
//       setStatus("idle");
//       onClose(); // Close modal immediately after alert
      
//     } catch (err) {
//       const msg = err.message || "Something went wrong.";
//       setStatus("error");
//       setErrorMessage(msg);
//       alert("Error: " + msg); // Alert the user of the failure
//     }
//   };

//   const handleClose = () => {
//     if (status === "loading") return;
//     setStatus("idle");
//     setErrorMessage("");
//     onClose();
//   };

//   return (
//     <Modal open={isOpen} onClose={handleClose}>
//       <Box className="flex items-center justify-center min-h-screen p-4">
//         <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
          
//           {/* Header */}
//           <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-100 flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">Message Tutor</h2>
//               <p className="text-gray-600 mt-1">with {fullName}</p>
//             </div>
//             <IconButton 
//               onClick={handleClose} 
//               disabled={status === "loading"}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <Close className="w-6 h-6 text-gray-500" />
//             </IconButton>
//           </div>

//           <div className="p-6">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
//                 <Person className="text-gray-400" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Recipient</p>
//                 <p className="font-bold text-gray-800">{fullName}</p>
//               </div>
//             </div>

//             {status === "error" && (
//               <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-700 text-sm">
//                 <ErrorOutline className="w-4 h-4" />
//                 {errorMessage}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Your Message
//                 </label>
//                 <textarea
//                   required
//                   disabled={status === "loading"}
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Ask about availability, teaching style, or materials..."
//                   className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-800 focus:border-transparent resize-none outline-none transition-all disabled:bg-gray-50"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={status === "loading"}
//                 className="w-full bg-red-800 hover:bg-red-900 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400 shadow-lg shadow-red-900/10"
//               >
//                 {status === "loading" ? (
//                   <CircularProgress size={20} color="inherit" />
//                 ) : (
//                   <>
//                     <Send className="w-4 h-4" />
//                     Send Message
//                   </>
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       </Box>
//     </Modal>
//   );
// }