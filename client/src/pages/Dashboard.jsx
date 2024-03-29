import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComment from "../components/DashComment";
import DashOverview from "../components/DashOverview";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* sidebar */}
      <div className="md:min-w-56">
        <DashSidebar />
      </div>

      {/* profile */}
      {tab === "profile" && <DashProfile />}

      {/* posts */}
      {tab === "posts" && <DashPosts />}

      {/* get all users */}
      {tab === "users" && <DashUsers />}

      {/* get all comments */}
      {tab === "comments" && <DashComment />}

      {/* dash overview */}
      {tab === "dash" && <DashOverview />}
    </div>
  );
};

export default Dashboard;
