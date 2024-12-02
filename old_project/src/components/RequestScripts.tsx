import React from 'react';

export function RequestScripts() {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Pre-request Script</h3>
      <p className="text-gray-500">Add JavaScript code to execute before the request is sent</p>
    </div>
  );
}