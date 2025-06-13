


// import React, { useEffect, useState } from "react";
// import { FiCheckCircle, FiXCircle, FiUser } from "react-icons/fi";
// import LoadingSpinner from "../../components/common/LoadingSpinner";
// import { toast } from "react-toastify";
// import axiosInstance from "../../api/axiosInstance";

// const ManageFamilyRequests = () => {
//   const [loading, setLoading] = useState(true);
//   const [requests, setRequests] = useState([]);
//   const [residents, setResidents] = useState([]);
//   const [selectedResident, setSelectedResident] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [familyRes, residentRes] = await Promise.all([
//           axiosInstance.get("/admin/family/pending"),
//           axiosInstance.get("/admin/residents")
//         ]);
//         setRequests(familyRes.data);
//         setResidents(residentRes.data);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleApprove = async (familyId) => {
//     const residentId = selectedResident[familyId];
//     if (!residentId) {
//       toast.error("Please select a resident before approving");
//       return;
//     }

//     try {
//       await axiosInstance.put(`/admin/family/approve/${familyId}`, {
//         residentId
//       });
//       setRequests((prev) => prev.filter((req) => req._id !== familyId));
//       toast.success("Request approved");
//     } catch (err) {
//       console.error(err);
//       toast.error("Approval failed");
//     }
//   };

//   const handleReject = async (familyId) => {
//     try {
//       await axiosInstance.put(`/admin/family/reject/${familyId}`);
//       setRequests((prev) => prev.filter((req) => req._id !== familyId));
//       toast.success("Request rejected and removed");
//     } catch (err) {
//       console.error(err);
//       toast.error("Rejection failed");
//     }
//   };

//   if (loading) return <LoadingSpinner fullScreen />;

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Manage Family Requests</h1>
//         <p className="mt-1 text-base text-gray-600">
//           Review and approve or reject new family account requests
//         </p>
//       </div>

//       <div className="bg-white rounded-lg shadow-card overflow-hidden">
//         {requests.length === 0 ? (
//           <div className="text-center py-20">
//             <FiUser className="mx-auto h-16 w-16 text-gray-400" />
//             <h3 className="mt-4 text-lg font-medium text-gray-900">No pending requests</h3>
//             <p className="mt-2 text-base text-gray-600">
//               All family signup requests have been reviewed.
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Full Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Select Resident
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {requests.map((req) => (
//                   <tr key={req._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {req.user?.name || "N/A"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {req.user?.email || "-"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       <select
//                         className="form-select text-sm border-gray-300 rounded-md"
//                         value={selectedResident[req._id] || ""}
//                         onChange={(e) =>
//                           setSelectedResident((prev) => ({
//                             ...prev,
//                             [req._id]: e.target.value
//                           }))
//                         }
//                       >
//                         <option value="">-- Select --</option>
//                         {residents.map((r) => (
//                           <option key={r._id} value={r._id}>
//                             {r.fullName}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
//                       <button
//                         onClick={() => handleApprove(req._id)}
//                         className="text-green-600 hover:text-green-800"
//                       >
//                         <FiCheckCircle className="inline-block w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleReject(req._id)}
//                         className="text-red-600 hover:text-red-800"
//                       >
//                         <FiXCircle className="inline-block w-5 h-5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageFamilyRequests;





import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle, FiUser } from "react-icons/fi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

const ManageFamilyRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [familyRes, residentRes] = await Promise.all([
          axiosInstance.get("/admin/family/pending"),
          axiosInstance.get("/admin/residents"),
        ]);
        setRequests(familyRes.data);
        setResidents(residentRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (familyId) => {
    const residentId = selectedResident[familyId];
    if (!residentId) {
      toast.error("Please select a resident before approving");
      return;
    }

    try {
      await axiosInstance.put(`/admin/family/approve/${familyId}`, {
        residentId,
      });
      setRequests((prev) => prev.filter((req) => req._id !== familyId));
      toast.success("Request approved");
    } catch (err) {
      console.error(err);
      toast.error("Approval failed");
    }
  };

  const handleReject = async (familyId) => {
    try {
      await axiosInstance.put(`/admin/family/reject/${familyId}`);
      setRequests((prev) => prev.filter((req) => req._id !== familyId));
      toast.success("Request rejected and removed");
    } catch (err) {
      console.error(err);
      toast.error("Rejection failed");
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Family Requests</h1>
        <p className="mt-1 text-base text-gray-600">
          Review and approve or reject new family account requests
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        {requests.length === 0 ? (
          <div className="text-center py-20">
            <FiUser className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No pending requests</h3>
            <p className="mt-2 text-base text-gray-600">
              All family signup requests have been reviewed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Full Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Note from Family
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Link to Resident
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {req.user?.name || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {req.user?.email || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 max-w-xs">
                      {req.requestMessage || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <select
                        className="form-select text-sm border-gray-300 rounded-md w-full"
                        value={selectedResident[req._id] || ""}
                        onChange={(e) =>
                          setSelectedResident((prev) => ({
                            ...prev,
                            [req._id]: e.target.value,
                          }))
                        }
                      >
                        <option value="">-- Select --</option>
                        {residents.map((r) => (
                          <option key={r._id} value={r._id}>
                            {r.fullName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FiCheckCircle className="inline-block w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiXCircle className="inline-block w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFamilyRequests;