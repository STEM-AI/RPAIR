// import { useEffect, useState } from "react";
// import axios from "axios";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";

// const NotificationsPage = () => {
//   const [notifications, setNotifications] = useState([]);

//     const [error, setError] = useState(null);
  
//       const [responseMessage, setResponseMessage] = useState(null);
//       const [alertType, setAlertType] = useState("");
//   const token = localStorage.getItem("access_token");

//   useEffect(() => {
//     if (!token) {
//       setResponseMessage("You are not authorized. Please log in.");
//       setAlertType("error");
//       return;
//     }

    

//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get(
//           `http://147.93.56.71:8001/api/user/notification/`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setNotifications(response.data);
//       } catch (err) {
//         if (err.response && err.response.status === 401) {
//           setAlertType("error");
//           setResponseMessage("Unauthorized access. Please check your token.");
//         } else {
//           setAlertType("error");
//           setResponseMessage("Failed to fetch teams. Please try again.");
//         }
//       }
//     };

//     // fetchUserRole();
//     fetchNotifications();
//   }, [token]);

 

//   if (error) {
//     return <div className="text-red-600 text-center mt-8">{error}</div>;
//   }

//   return (
//     <div className="p-4">
//           <h2 className="text-2xl font-bold mb-4">Notifications</h2>
//            {responseMessage && (
//                   <div className="mb-6">
//                     <Alert severity={alertType}>
//                       <AlertTitle>
//                         {alertType === "success" ? "Success" : "Error"}
//                       </AlertTitle>
//                       {responseMessage}
//                     </Alert>
//                   </div>
//                 )}
//       <div style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "5px" }}>
//         {notifications.length > 0 ? (
//           notifications.map((notification) => (
//             <div key={notification.id} style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
//               <strong>{new Date(notification.created_at).toLocaleString()}</strong>
//               <p>{notification.content}</p>
//             </div>
//           ))
//         ) : (
//           <p>No new notifications.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationsPage;

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";

// const NotificationsPage = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [error, setError] = useState(null);
//   const [responseMessage, setResponseMessage] = useState(null);
//   const [alertType, setAlertType] = useState("");
//   const token = localStorage.getItem("access_token");

//   useEffect(() => {
//     if (!token) {
//       setResponseMessage("You are not authorized. Please log in.");
//       setAlertType("error");
//       return;
//     }

//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get(
//           `http://147.93.56.71:8001/api/user/notification/`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setNotifications(response.data);
//       } catch (err) {
//         if (err.response && err.response.status === 401) {
//           setAlertType("error");
//           setResponseMessage("Unauthorized access. Please check your token.");
//         } else {
//           setAlertType("error");
//           setResponseMessage("Failed to fetch notifications. Please try again.");
//         }
//       }
//     };

//     fetchNotifications();
//   }, [token]);

//   if (error) {
//     return <div className="text-red-600 text-center mt-8">{error}</div>;
//   }

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6 text-cyan-800">Notifications</h2>
//       {responseMessage && (
//         <div className="mb-6">
//           <Alert severity={alertType}>
//             <AlertTitle>
//               {alertType === "success" ? "Success" : "Error"}
//             </AlertTitle>
//             {responseMessage}
//           </Alert>
//         </div>
//       )}
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         {notifications.length > 0 ? (
//           notifications.map((notification) => (
//             <div
//               key={notification.id}
//               className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
//             >
//               <div className="flex items-center justify-between">
//                 <p className="text-gray-700 text-sm">
//                   {new Date(notification.created_at).toLocaleString()}
//                 </p>
//                 <span className="text-xs text-gray-500">Unread</span>
//               </div>
//               <p className="text-gray-900 mt-1">{notification.content}</p>
//             </div>
//           ))
//         ) : (
//           <div className="p-6 text-center text-gray-600">
//             <p>No new notifications.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationsPage;

import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      setResponseMessage("You are not authorized. Please log in.");
      setAlertType("error");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://147.93.56.71:8001/api/user/notification/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setAlertType("error");
          setResponseMessage("Unauthorized access. Please check your token.");
        } else {
          setAlertType("error");
          setResponseMessage("Failed to fetch notifications. Please try again.");
        }
      }
    };

    fetchNotifications();
  }, [token]);

  if (error) {
    return <div className="text-red-600 text-center mt-8">{error}</div>;
  }

  return (
      <div className="p-4 max-w-4xl mx-auto">
           <p className="text-gray-700 font-bold border-b pb-2">Notifications</p>
      {/* <h2 className="text-2xl font-bold mb-6 text-cyan-800">Notifications</h2> */}
      {responseMessage && (
        <div className="mb-6">
          <Alert severity={alertType}>
            <AlertTitle>
              {alertType === "success" ? "Success" : "Error"}
            </AlertTitle>
            {responseMessage}
          </Alert>
        </div>
      )}
      <div className="mt-4 bg-white shadow-md rounded-lg overflow-hidden">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
              <div
                  
              key={notification.id}
              className=" p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-700 text-sm">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
                <span className="text-xs text-gray-500">Unread</span>
              </div>
              <p className="text-gray-900 mt-1">{notification.content}</p>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-600">
            <p>No new notifications.</p>
          </div>
        )}
          </div>
          <div>
              
          </div>
    </div>
  );
};

export default NotificationsPage;