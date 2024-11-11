import useLogout from "../../Hooks/Logout/postLogOutUser";

function LogoutButton() {
  const logout = useLogout();

  return (
    <button onClick={logout} className="lg:hover:border-r-transparent  hover:border-r-4 lg:hover:border-b-4 hover:border-r-cyan-400 lg:hover:border-b-cyan-400 lg:pb-2 -mr-2  lg:-mr-0 bordernav">
      Logout
    </button>
  );
}

export default LogoutButton;
