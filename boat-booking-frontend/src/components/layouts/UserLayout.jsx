import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

export default function UserLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <main className="flex-grow max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
      <UserFooter />
    </div>
  );
}