import React from "react";

const UserFooter = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 mt-8">
        <div className="container mx-auto p-4 text-center text-sm">
          © {new Date().getFullYear()} Boat Booking System. All rights reserved.
        </div>
      </footer>
  );
};

export default UserFooter;