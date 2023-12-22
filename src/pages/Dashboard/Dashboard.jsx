import { useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  console.log(user.displayName, user.email, user.photoURL);

  return (
    <div className="my-10">
      <div className="text-center flex justify-center items-center flex-col">
        <img src={user?.photoURL} className="rounded-full w-24 h-24" alt="" />
        <h1 className="font-semibold text-xl mt-4">{user?.displayName}</h1>
        <p className="text-sm">{user?.email}</p>
        <hr className="w-20 border-2 mt-2 border-gray-500" />
      </div>
    </div>
  );
};

export default Dashboard;
