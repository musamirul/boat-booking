export default function Modal({ children, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg relative w-96">
          <button
            className="absolute top-2 right-2 text-red-500"
            onClick={onClose}
          >
            ✖
          </button>
          {children}
        </div>
      </div>
    );
  }