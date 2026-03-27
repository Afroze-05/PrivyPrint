export function Card({ children }) {
  return (
    <div className="p-4 rounded-xl shadow bg-white">
      {children}
    </div>
  );
}

export function Button({ children, ...props }) {
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      {...props}
    >
      {children}
    </button>
  );
}

export function Input(props) {
  return (
    <input
      className="border p-2 rounded-lg w-full"
      {...props}
    />
  );
}