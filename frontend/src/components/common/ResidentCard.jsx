import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { FiTrash2 } from "react-icons/fi";

const ResidentCard = ({
  resident,
  compact = false,
  onClick = null,
  linkTo = null,
  showActions = true,
  onDelete = null,
}) => {
  const { _id, fullName, roomNumber, careLevel, dateOfBirth, isActive, photo } =
    resident;

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const cardContent = (
    <div className={`${compact ? "p-3" : "p-4"} flex items-start`}>
      <div
        className={`${
          compact ? "w-10 h-10" : "w-14 h-14"
        } flex-shrink-0 rounded-full overflow-hidden mr-3`}
      >
        {photo ? (
          <img
            src={photo}
            alt={fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-700 text-lg font-medium">
            {fullName?.charAt(0) || ""}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3
            className={`${
              compact ? "text-sm" : "text-base"
            } font-medium text-gray-900 truncate`}
          >
            {fullName}
          </h3>
          <StatusBadge
            status={isActive ? "active" : "inactive"}
            size={compact ? "sm" : "md"}
          />
        </div>

        <div
          className={`mt-1 ${compact ? "text-xs" : "text-sm"} text-gray-500`}
        >
          {roomNumber && <p>Room: {roomNumber}</p>}
          {careLevel && <p>Care Level: {careLevel}</p>}
          {dateOfBirth && <p>Age: {calculateAge(dateOfBirth)}</p>}
        </div>

        {showActions && !compact && (
          <div className="mt-3 flex flex-wrap gap-2">

            <button
              type="button"
              className="btn btn-outline text-xs py-1 px-2"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(resident);
              }}
            >
              View Details
            </button>
            <button
              type="button"
              className="btn btn-primary text-xs py-1 px-2"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(resident);
              }}
            >
              Care Plan
            </button>
            {onDelete && (
              <button
              type="button"
              className="flex items-center space-x-1 border border-red-600 text-red-600 rounded hover:bg-red-50 shrink-0 text-xs py-1 px-2"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(resident);
              }}
            >
              <FiTrash2 className="w-4 h-4" />
              <span >Delete</span>
            </button>
            
            
            
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className="block bg-white border border-gray-200 rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200"
      >
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div
        role="button"
        onClick={() => onClick(resident)}
        className="cursor-pointer w-full text-left bg-white border border-gray-200 rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200"
      >
        {cardContent}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-card">
      {cardContent}
    </div>
  );
};

export default ResidentCard;
