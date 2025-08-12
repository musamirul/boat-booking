import UserHeaderTest from "./UserHeaderTest";
import UsersFooter from "./UsersFooter";
import UserCTA from "./UserCTA";
export default function UsersLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <UserHeaderTest />
      
      <main className="flex-grow max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
      <UserCTA/>
      <UsersFooter/>
    </div>
  );
}