// import { useState } from "react";
// import api from "../../utils/api";
// import { useAuth } from "../../context/AuthContext"; // Get logged-in user

// const UserDashboard = () => {
//   const { user } = useAuth();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showBookings, setShowBookings] = useState(false);

//   const fetchBookings = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get(`/bookingRoute/userBookings/${user.id}`);
//       setBookings(response.data.bookings); // API only returns `bookings` now
//       setShowBookings(true); // Show bookings only after fetching
//       console.log(response.data.bookings);
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="dashboard">
//       <h2>Welcome, {user.name}</h2>
//       <img
//         src={user.profilePic || "default-user.jpg"}
//         alt="Profile"
//         className="profile-pic"
//       />

//       {/* Fetch Bookings Button */}
//       <button onClick={fetchBookings} disabled={loading}>
//         {loading ? "Fetching Bookings..." : "Show My Bookings"}
//       </button>

//       {showBookings && (
//         <div>
//           <h3>Your Bookings:</h3>
//           {
//           bookings.length > 0 ? (
//             bookings.map((booking) => (
//               <div key={booking._id} className="booking-card">
//                 <p><strong>Cab:</strong> {booking.cab.type}</p>
//                 <p><strong>Driver:</strong> {booking.driver ? booking.driver.name : "No driver selected"}</p>
//                 <p><strong>Trip:</strong> {new Date(booking.rentalStartDate).toLocaleDateString()} → {new Date(booking.rentalEndDate).toLocaleDateString()}</p>
//                 <p><strong>Price:</strong> ₹{booking.price}</p>
//                 <p><strong>Status:</strong> {booking.paymentStatus}</p>
//               </div>
//             ))
//           ) 
//           : (
//             <p>No bookings found.</p>
//           )}
         
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserDashboard;
import { useState } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext"; // Get logged-in user
import "./userDashboard.css"
import CartoonImage from "../../assets/images/cartoon.jpg";
const UserDashboard = () => {
  const { user, login,isAuthenticated  } = useAuth(); // To update user details after editing
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBookings, setShowBookings] = useState(false);

  // Edit User State
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    userId : user.id,
    name: user.name,
    phoneNumber: user.phoneNumber || "",
    password: "",
  });
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch Bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/bookingRoute/userBookings/${user.id}`);
      setBookings(response.data.bookings);
      setShowBookings(true);
    } catch (error) {
      alert("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Form Changes
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Submit Updated User Data
  // const handleUpdate = async () => {
  //   setUpdating(true);
  //   setMessage("");
  //   try {
  //     const response = await api.put("/users/updateUser", editData); // API call to update user
  //     setMessage(response.data.message);
      
  //     // Update User Context
  //     //please give me code to update the data here ......

  //     setEditMode(false); // Close form after update
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     setMessage("Failed to update details.");
  //   } finally {
  //     setUpdating(false);
  //   }
  // };
  const handleUpdate = async () => {
    setUpdating(true);
    setMessage("");
    try {
        const response = await api.put("/users/updateUser", editData); // API call to update user
        setMessage(response.data.message);
        
        // Update User Context
        const updatedUser = {
            ...user, // Keep existing properties
            name: editData.name,
            phoneNumber: editData.phoneNumber,
        };

        login(updatedUser); // Update context with new user data

        setEditMode(false); // Close form after update
    } catch (error) {
        alert("Error updating user");
        setMessage("Failed to update details.");
    } finally {
        setUpdating(false);
    }
};

  // return (
  //   <div className="dashboard">
  //     <h2>Welcome, {user.name}</h2>
  //     <button onClick={fetchBookings} disabled={loading}>
  //       {loading ? "Fetching Bookings..." : "Show My Bookings"}
  //     </button>
  //     <button onClick={() => setEditMode(true)}>Edit Profile</button>

  //     {/* Edit Profile Form */}
  //     {editMode && (
  //       <div className="modal">
  //         <div className="modal-content">
  //           <h3>Edit Your Details</h3>
  //           <label>
  //             Name:
  //             <input type="text" name="name" value={editData.name} onChange={handleChange} />
  //           </label>
  //           <label>
  //             Phone Number:
  //             <input type="text" name="phoneNumber" value={editData.phoneNumber} onChange={handleChange} />
  //           </label>
  //           <label>
  //             New Password:
  //             <input type="password" name="password" value={editData.password} onChange={handleChange} />
  //           </label>
  //           {message && <p>{message}</p>}
  //           <button onClick={handleUpdate} disabled={updating}>
  //             {updating ? "Updating..." : "Save Changes"}
  //           </button>
  //           <button onClick={() => setEditMode(false)}>Cancel</button>
  //         </div>
  //       </div>
  //     )}

  //     {showBookings && (
  //       <div>
  //         <h3>Your Bookings:</h3>
  //         {bookings.length > 0 ? (
  //           bookings.map((booking) => (
  //             <div key={booking._id} className="booking-card">
  //               <p>Cab: {booking.cab.type} ({booking.cab.seats} seats)</p>
  //               <p>Driver: {booking.driver ? booking.driver.name : "No driver selected"}</p>
  //               <p>Trip: {new Date(booking.rentalStartDate).toLocaleDateString()} → {new Date(booking.rentalEndDate).toLocaleDateString()}</p>
  //               <p>Price: ₹{booking.price}</p>
  //               <p>Status: {booking.paymentStatus}</p>
  //             </div>
  //           ))
  //         ) : (
  //           <p>No bookings found.</p>
  //         )}
  //       </div>
  //     )}
  //   </div>
  // );
  if(!isAuthenticated){
    return (
      <>
        <div className="booking-container-noBookings">
               <h3>Please Login!.</h3>
               <img src={CartoonImage} alt="Filter Placeholder" className="placeholder-image-dashboard" />
              
              </div>
      </>
    )
  }
  return (
    <div className="dashboard">
      <h2 className="userDashboardHeading">Welcome, {user.name}</h2>
      <button onClick={fetchBookings} disabled={loading}>
        {loading ? "Fetching Bookings..." : "Show My Bookings"}
      </button>
      <button onClick={() => setEditMode(true)}>Edit Profile</button>
  
      {/* Edit Profile Form */}
      {editMode && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Your Details</h3>
            <label>
              Name:
              <input type="text" name="name" value={editData.name} onChange={handleChange} />
            </label>
            <label>
              Phone Number:
              <input type="text" name="phoneNumber" value={editData.phoneNumber} onChange={handleChange} />
            </label>
            <label>
              New Password:
              <input type="password" name="password" value={editData.password} onChange={handleChange} />
            </label>
            {message && <p>{message}</p>}
            <button onClick={handleUpdate} disabled={updating}>
              {updating ? "Updating..." : "Save Changes"}
            </button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      )}
  
      {showBookings && (
        <div>
         
            {bookings.length >0 ?<h3>Your Bookings:</h3>:"" }
          <div className="booking-container">
          
            {bookings.length > 0 ? (
              
              bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <p><strong>Cab:</strong> {booking.cab.type} ({booking.cab.seats} seats)</p>
                  <p><strong>Driver:</strong> {booking.driver ? booking.driver.name : "No driver selected"}</p>
                  <p><strong>Trip:</strong> {new Date(booking.rentalStartDate).toLocaleDateString()} → {new Date(booking.rentalEndDate).toLocaleDateString()}</p>
                  <p><strong>Price:</strong> ₹{booking.price}</p>
                  <p><strong>Status:</strong> {booking.paymentStatus}</p>
                </div>
              ))
            ) : (
              <div className="booking-container-noBookings">
               <h3>No bookings found.</h3>
               <img src={CartoonImage} alt="Filter Placeholder" className="placeholder-image-dashboard" />
              
              </div>
             
            )}
          </div>
        </div>
      )}
    </div>
  );
  
};

export default UserDashboard;
