import React from "react";

const ResidentCareFormPreview = ({ form }) => {
  if (!form) return null;

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 space-y-6 print:bg-white">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">{form.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{form.description}</p>
      </div>

      {/* Metadata */}
      <div className="text-sm text-gray-500">
        <strong>Allowed Roles:</strong> {form.rolesAllowed?.join(", ") || "—"}
      </div>

      {/* Questions & Answers */}
      <div className="space-y-4">
        {form.questions?.map((q, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-md bg-gray-50 px-4 py-3 space-y-2"
          >
            <p className="text-base font-medium text-gray-700">
              Q{idx + 1}. {q.questionText}
            </p>

            {["radio", "select", "text", "textarea"].includes(q.type) && (
              <p className="text-sm text-gray-800">
                <strong>Answer:</strong> {q.answerText || "—"}
              </p>
            )}

            {q.type === "checkbox" && Array.isArray(q.answerText) ? (
              <div>
                <strong className="text-sm text-gray-700">Selected:</strong>
                <ul className="list-disc list-inside text-sm text-gray-800 pl-4 mt-1">
                  {q.answerText.map((ans, i) => (
                    <li key={i}>{ans}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {q.options?.length > 0 && (
              <div className="text-xs text-gray-500">
                <strong>Options:</strong> {q.options.join(", ")}
              </div>
            )}

            <div className="text-xs text-gray-400">
              Type: {q.type} {q.isRequired && "(Required)"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResidentCareFormPreview;
