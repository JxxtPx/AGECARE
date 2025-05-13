import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiUpload,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ResidentCard from "../../components/common/ResidentCard";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
const bodyParts = ["Head", "Chest", "Abdomen", "Arms", "Legs", "Skin"];

const ManageResidents = () => {
  const [loading, setLoading] = useState(true);
  const [residents, setResidents] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [residentToDelete, setResidentToDelete] = useState(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fileForm, setFileForm] = useState({
    file: null,
    title: "",
    fileType: "pdf",
    notes: "",
    rolesAllowed: ["admin"],
  });

  // Form state using exact backend model fields
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    user: "",
    roomNumber: "",
    photo: "",
    contactInfo: {
      phone: "",
      email: "",
      address: "",
    },
    emergencyContacts: [{ name: "", relation: "", phone: "", email: "" }],
    allergies: "",
    dietaryPreferences: "",
    medicalConditions: [], // [{ bodyPart: "", description: "" }]
    medicalHistory: "",
    isActive: true,
    files: [],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/admin/users");
        setUserOptions(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const res = await axiosInstance.get("/admin/residents");
        setResidents(res.data);
      } catch (error) {
        console.error("Error fetching residents:", error);
        toast.error("Failed to load residents");
      } finally {
        setLoading(false);
      }
    };
    fetchResidents();
  }, []);

  const handleCreateResident = () => {
    setSelectedResident(null);
    setFormData({
      fullName: "",
      gender: "",
      dateOfBirth: "",
      user: "",
      roomNumber: "",
      photo: "",
      contactInfo: { phone: "", email: "", address: "" },
      emergencyContacts: [{ name: "", relation: "", phone: "", email: "" }],
      allergies: "",
      dietaryPreferences: "",
      medicalConditions: [],
      medicalHistory: "",
      isActive: true,
      files: [],
    });
    setActiveTab("details");
    setShowModal(true);
  };

  const handleEditResident = async (resident) => {
    setSelectedResident(resident);
    setFormData({
      fullName: resident.fullName,
      gender: resident.gender,
      dateOfBirth: resident.dateOfBirth?.split("T")[0] || "",
      user: resident.user,
      roomNumber: resident.roomNumber,
      photo: resident.photo || "",
      contactInfo: resident.contactInfo || {
        phone: "",
        email: "",
        address: "",
      },
      emergencyContacts: resident.emergencyContacts || [
        { name: "", relation: "", phone: "", email: "" },
      ],
      allergies: (resident.allergies || []).join(", "),
      dietaryPreferences: resident.dietaryPreferences || "",
      medicalConditions: (resident.medicalConditions || []).map((mc) => ({
        bodyPart: mc.bodyPart || mc.part || "",
        description: mc.note || "",
      })),
      medicalHistory: resident.medicalHistory || "",
      isActive: resident.isActive,
      files: [],
    });
    setActiveTab("details");
    setShowModal(true);
    await fetchResidentFiles(resident._id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let photoUrl = formData.photo;

      if (profileImageFile) {
        const formDataImage = new FormData();
        formDataImage.append("file", profileImageFile);
        formDataImage.append("upload_preset", "unsigned_upload");
        formDataImage.append("folder", "agedcare/residents/profile");

        const cloudinaryRes = await fetch(
          "https://api.cloudinary.com/v1_1/dq1uwrywk/image/upload",
          {
            method: "POST",
            body: formDataImage,
          }
        );
        const imageData = await cloudinaryRes.json();
        photoUrl = imageData.secure_url;
      }

      const payload = {
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        user: formData.user,
        roomNumber: formData.roomNumber,
        photo: photoUrl,
        contactInfo: formData.contactInfo,
        emergencyContacts: formData.emergencyContacts,
        allergies: formData.allergies.split(",").map((a) => a.trim()),
        dietaryPreferences: formData.dietaryPreferences,
        medicalConditions: formData.medicalConditions
          .filter(
            (c) =>
              (c.bodyPart || c.part) && (c.bodyPart || c.part).trim() !== ""
          )
          .map((c) => ({
            bodyPart: (c.bodyPart || c.part).trim(),
            note: c.description?.trim() || "",
          })),
        medicalHistory: formData.medicalHistory,
        isActive: formData.isActive,
        files: formData.files,
      };

      console.log("🧪 Final Payload:", payload);

      if (selectedResident) {
        const res = await axiosInstance.put(
          `/admin/residents/${selectedResident._id}`,
          payload
        );
        const updatedResident = res.data.resident || res.data;
        setResidents(
          residents.map((r) =>
            r._id === selectedResident._id ? updatedResident : r
          )
        );
        toast.success("Resident updated successfully");
      } else {
        const res = await axiosInstance.post("/admin/residents", payload);
        const newResident = res.data.resident || res.data;
        setResidents([...residents, newResident]);
        toast.success("Resident created successfully");
      }

      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save resident");
    } finally {
      setIsSubmitting(false); // ✅ done submitting
    }
  };

  const handleDeleteResident = async () => {
    if (!residentToDelete) return;
    try {
      await axiosInstance.delete(`/admin/residents/${residentToDelete._id}`);
      setResidents((prev) =>
        prev.filter((r) => r._id !== residentToDelete._id)
      );
      toast.success("Resident deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete resident");
    } finally {
      setShowConfirmDelete(false);
      setResidentToDelete(null);
    }
  };
  const handleCheckboxChange = (bodyPart, checked) => {
    setFormData((prev) => {
      const existing = prev.medicalConditions.find(
        (m) => m.bodyPart === bodyPart
      );
      let updated;
      if (checked && !existing) {
        updated = [...prev.medicalConditions, { bodyPart, description: "" }];
      } else if (!checked) {
        updated = prev.medicalConditions.filter((m) => m.bodyPart !== bodyPart);
      } else {
        updated = [...prev.medicalConditions];
      }
      return { ...prev, medicalConditions: updated };
    });
  };

  const handleConditionChange = (bodyPart, desc) => {
    setFormData((prev) => {
      const updated = prev.medicalConditions.map((m) =>
        m.bodyPart === bodyPart ? { ...m, description: desc } : m
      );
      return { ...prev, medicalConditions: updated };
    });
  };

  const isChecked = (bodyPart) =>
    formData.medicalConditions.some((m) => m.bodyPart === bodyPart);

  const getDescription = (bodyPart) =>
    formData.medicalConditions.find((m) => m.bodyPart === bodyPart)
      ?.description || "";

  const handleFileUpload = async () => {
    if (!fileForm.title.trim()) {
      toast.error("Please enter a title for the file.");
      return;
    }

    if (!fileForm.file || !selectedResident?._id) {
      toast.error("Please select a file to upload.");
      return;
    }

    setIsUploadingFile(true); // ✅ show loading

    const formDataObj = new FormData();
    formDataObj.append("file", fileForm.file);
    formDataObj.append("title", fileForm.title);
    formDataObj.append("fileType", fileForm.fileType);
    formDataObj.append("rolesAllowed", JSON.stringify(fileForm.rolesAllowed));
    formDataObj.append("notes", fileForm.notes);

    try {
      const res = await axiosInstance.post(
        `/admin/resident-files/${selectedResident._id}`,
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, res.data.file],
      }));
      toast.success("File uploaded successfully");
      setFileForm({
        file: null,
        title: "",
        fileType: "pdf",
        notes: "",
        rolesAllowed: ["admin"],
      });
    } catch (err) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploadingFile(false); // ✅ hide loading
    }
  };

  const [deletingFileId, setDeletingFileId] = useState(null);

  const handleDeleteFile = async (fileId) => {
    setDeletingFileId(fileId); // 🔄 Start loading for this file
    try {
      await axiosInstance.delete(`/admin/resident-files/${fileId}`);
      setFormData((prev) => ({
        ...prev,
        files: prev.files.filter((file) => file._id !== fileId),
      }));
      toast.success("File deleted");
    } catch (err) {
      toast.error("Failed to delete file");
    } finally {
      setDeletingFileId(null); // ✅ Stop loading
    }
  };

  const fetchResidentFiles = async (residentId) => {
    try {
      const res = await axiosInstance.get(
        `/admin/resident-files/${residentId}`
      );
      setFormData((prev) => ({ ...prev, files: res.data }));
    } catch (err) {
      toast.error("Failed to load resident files");
    }
  };

const filteredResidents = (residents || []).filter((resident) => {

    const fullName = resident.fullName?.toLowerCase() || "";
    const phone = resident.contactInfo?.phone || "";

    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm);

    const matchesFilter =
      filterStatus === "all" ||
      resident.isActive === (filterStatus === "active");

    return matchesSearch && matchesFilter;
  });

  const renderFileUploadForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          className="form-input mt-1"
          value={fileForm.title}
          onChange={(e) => setFileForm({ ...fileForm, title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          File Type
        </label>
        <select
          className="form-input mt-1"
          value={fileForm.fileType}
          onChange={(e) =>
            setFileForm({ ...fileForm, fileType: e.target.value })
          }
        >
          <option value="pdf">PDF</option>
          <option value="image">Image</option>
          <option value="doc">Document</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          className="form-input mt-1"
          rows={2}
          value={fileForm.notes}
          onChange={(e) => setFileForm({ ...fileForm, notes: e.target.value })}
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Access Roles
        </label>
        <div className="grid grid-cols-2 gap-2">
          {["admin", "nurse", "carer", "coordinator", "family"].map((role) => (
            <label
              key={role}
              className="flex items-center gap-2 p-2 rounded border border-gray-300 shadow-sm hover:shadow-md transition bg-white cursor-pointer"
            >
              <input
                type="checkbox"
                checked={fileForm.rolesAllowed.includes(role)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...fileForm.rolesAllowed, role]
                    : fileForm.rolesAllowed.filter((r) => r !== role);
                  setFileForm({ ...fileForm, rolesAllowed: updated });
                }}
                className="h-4 w-4 accent-rose-600 rounded border-gray-300 focus:ring-rose-500"
              />
              <span className="text-sm text-gray-800 capitalize">{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div
        className={`mt-1 border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition
    ${
      fileForm.file
        ? "border-green-400 bg-green-50"
        : "border-gray-300 hover:border-rose-400"
    }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile) {
            setFileForm({ ...fileForm, file: droppedFile });
          }
        }}
        onClick={() => document.getElementById("resident-file-input").click()}
      >
        {fileForm.file ? (
          <span className="text-sm text-green-700 font-medium">
            {fileForm.file.name}
          </span>
        ) : (
          <span className="text-sm text-gray-500">
            Drag & drop a file here or click to select
          </span>
        )}
        <input
          type="file"
          id="resident-file-input"
          className="hidden"
          onChange={(e) =>
            setFileForm({ ...fileForm, file: e.target.files[0] })
          }
        />
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleFileUpload}
        disabled={isUploadingFile}
      >
        {isUploadingFile ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            Uploading...
          </span>
        ) : (
          "Upload File"
        )}
      </button>

      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-2">Uploaded Files</h4>
        <div className="space-y-2">
          {formData.files.map((file) => (
            <div
              key={file._id}
              className="border p-3 rounded-md flex justify-between items-start"
            >
              <div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary-600 underline hover:text-primary-800"
                >
                  {file.title}
                </a>
                <p className="text-xs text-gray-500">Type: {file.fileType}</p>
                <p className="text-xs text-gray-500">
                  Access: {file.rolesAllowed?.join(", ")}
                </p>
                <p className="text-xs text-gray-500">
                  Notes: {file.notes || "-"}
                </p>
              </div>
              <button
                className="text-red-500 text-sm"
                onClick={() => handleDeleteFile(file._id)}
                disabled={deletingFileId === file._id}
              >
                {deletingFileId === file._id ? (
                  <svg
                    className="animate-spin w-4 h-4 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  <FiTrash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
          {formData.files.length === 0 && (
            <div className="text-sm text-gray-500">No files uploaded yet.</div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Residents</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage resident profiles
          </p>
        </div>
        <button onClick={handleCreateResident} className="btn btn-primary">
          <FiPlus className="w-5 h-5 mr-2" />
          Add New Resident
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            {/* Icon: Hidden on mobile, visible on sm and up, always vertically centered */}
            <div className="absolute inset-y-0 left-0 pl-3 hidden sm:flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>

            <input
              type="text"
              className="w-full border border-gray-300 rounded-md py-2 text-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 pl-3 sm:pl-10"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            {/* Icon hidden on small screens, shown on sm and up */}
            <div className="absolute inset-y-0 left-0 pl-3 hidden sm:flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>

            <select
              className="w-full border border-gray-300 rounded-md py-2 text-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 pl-3 sm:pl-10"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Residents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResidents.map((resident) => (
          <ResidentCard
            key={resident._id}
            resident={resident}
            onClick={() => handleEditResident(resident)}
            onDelete={(res) => {
              setResidentToDelete(res);
              setShowConfirmDelete(true);
            }}
          />
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {selectedResident
                          ? "Edit Resident"
                          : "Add New Resident"}
                      </h3>
                      <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-4">
                      <nav className="-mb-px flex space-x-8">
                        <button
                          onClick={() => setActiveTab("details")}
                          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "details"
                              ? "border-primary-500 text-primary-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          Details
                        </button>
                        <button
                          onClick={() => setActiveTab("medical")}
                          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "medical"
                              ? "border-primary-500 text-primary-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          Medical Info
                        </button>
                        <button
                          onClick={() => setActiveTab("files")}
                          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "files"
                              ? "border-primary-500 text-primary-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          Files
                        </button>
                      </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-4">
                      {activeTab === "details" && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          {/* General Info */}
                          <div>
                            <h4 className="text-base font-semibold text-gray-800 mb-2">
                              Resident Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Profile Picture
                                </label>
                                {formData.photo && (
                                  <img
                                    src={formData.photo}
                                    alt="Profile"
                                    className="w-24 h-24 object-cover rounded-full border mb-2"
                                  />
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    setProfileImageFile(file);
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = () =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          photo: reader.result,
                                        }));
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  className="form-input mt-1"
                                  value={formData.fullName}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      fullName: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Date of Birth
                                </label>
                                <input
                                  type="date"
                                  className="form-input mt-1"
                                  value={formData.dateOfBirth}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      dateOfBirth: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Gender
                                </label>
                                <select
                                  className="form-input mt-1"
                                  value={formData.gender}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      gender: e.target.value,
                                    })
                                  }
                                  required
                                >
                                  <option value="">Select gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Room Number
                                </label>
                                <input
                                  type="text"
                                  className="form-input mt-1"
                                  value={formData.roomNumber}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      roomNumber: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">
                              Contact Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Phone Number
                                </label>
                                <input
                                  type="tel"
                                  className="form-input mt-1"
                                  placeholder="+61 412 345 678"
                                  value={formData.contactInfo.phone}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      contactInfo: {
                                        ...formData.contactInfo,
                                        phone: e.target.value,
                                      },
                                    })
                                  }
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Email Address
                                </label>
                                <input
                                  type="email"
                                  className="form-input mt-1"
                                  placeholder="resident@example.com"
                                  value={formData.contactInfo.email}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      contactInfo: {
                                        ...formData.contactInfo,
                                        email: e.target.value,
                                      },
                                    })
                                  }
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Home Address
                                </label>
                                <input
                                  type="text"
                                  className="form-input mt-1"
                                  value={formData.contactInfo.address}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      contactInfo: {
                                        ...formData.contactInfo,
                                        address: e.target.value,
                                      },
                                    })
                                  }
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Emergency Contact */}
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">
                              Emergency Contact
                            </h4>
                            <p className="text-xs text-gray-500 mb-3">
                              This contact will be used in case of emergency.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Name"
                                value={formData.emergencyContacts[0].name}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    emergencyContacts: [
                                      {
                                        ...formData.emergencyContacts[0],
                                        name: e.target.value,
                                      },
                                    ],
                                  })
                                }
                              />
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Relation"
                                value={formData.emergencyContacts[0].relation}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    emergencyContacts: [
                                      {
                                        ...formData.emergencyContacts[0],
                                        relation: e.target.value,
                                      },
                                    ],
                                  })
                                }
                              />
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Phone"
                                value={formData.emergencyContacts[0].phone}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    emergencyContacts: [
                                      {
                                        ...formData.emergencyContacts[0],
                                        phone: e.target.value,
                                      },
                                    ],
                                  })
                                }
                              />
                              <input
                                type="email"
                                className="form-input"
                                placeholder="Email"
                                value={formData.emergencyContacts[0].email}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    emergencyContacts: [
                                      {
                                        ...formData.emergencyContacts[0],
                                        email: e.target.value,
                                      },
                                    ],
                                  })
                                }
                              />
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Allergies
                              </label>
                              <input
                                type="text"
                                className="form-input mt-1"
                                placeholder="E.g. Nuts, Dairy, Penicillin"
                                value={formData.allergies}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    allergies: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Dietary Preferences
                              </label>
                              <input
                                type="text"
                                className="form-input mt-1"
                                placeholder="E.g. Vegetarian, Gluten-Free"
                                value={formData.dietaryPreferences}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    dietaryPreferences: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>

                          {/* Linked User */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Linked User Account
                            </label>
                            <select
                              className="form-input mt-1"
                              value={formData.user}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  user: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">Select user</option>
                              {userOptions.map((u) => (
                                <option key={u._id} value={u._id}>
                                  {u.name} ({u.email})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Status */}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="isActive"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={formData.isActive}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  isActive: e.target.checked,
                                })
                              }
                            />
                            <label
                              htmlFor="isActive"
                              className="ml-2 block text-sm text-gray-900"
                            >
                              Active
                            </label>
                          </div>
                        </form>
                      )}

                      {activeTab === "medical" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Medical History
                            </label>
                            <textarea
                              className="form-input mt-1"
                              rows={4}
                              placeholder="General medical history..."
                              value={formData.medicalHistory || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  medicalHistory: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold mb-2">
                              Body Part Conditions
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {bodyParts.map((part) => (
                                <div key={part} className="border rounded p-3">
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={isChecked(part)}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          part,
                                          e.target.checked
                                        )
                                      }
                                    />
                                    <span>{part}</span>
                                  </label>
                                  {isChecked(part) && (
                                    <textarea
                                      className="form-input mt-2"
                                      rows={2}
                                      placeholder={`Describe condition for ${part}`}
                                      value={getDescription(part)}
                                      onChange={(e) =>
                                        handleConditionChange(
                                          part,
                                          e.target.value
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "files" && renderFileUploadForm()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {activeTab !== "files" && (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-primary w-full sm:w-auto sm:ml-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : selectedResident ? (
                      "Update Resident"
                    ) : (
                      "Create Resident"
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline w-full sm:w-auto mt-3 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete resident{" "}
              <span className="font-semibold">
                {residentToDelete?.fullName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteResident}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageResidents;
