// In your component file
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirect to home after logout
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
