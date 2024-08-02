import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import backgroundImage from "../assets/dafault.png";
import logo from "../components/Aside/logo.png";
import { AuthContext } from "../context/Auth";

const Aside = () => {
  const location = useLocation();
  const context = useContext(AuthContext);
  const [user, setUser] = useState({});

  useEffect(() => {
    // Retrieve user details from localStorage
    const localStorageUser = JSON.parse(localStorage.getItem('user'));
    if (localStorageUser) {
      setUser(localStorageUser);
    }
  }, []);

  const linkStyle = (path) => ({
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginTop: "10px",
    color: location.pathname === path ? "purple" : "white",
  });

  const iconStyle = (path) => ({
    height: "30px",
    width: "30px",
    color: location.pathname === path ? "purple" : "white",
  });

  return (
    <div className="asides" style={{ backgroundColor: "rgba(60, 0, 107, 0.7)", borderRadius: "20px", padding: "20px 20px", width: "20%", margin: "10px", position: "-webkit-sticky", height: "100vh", top: "0", position: "sticky" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src={logo} alt="Logo" style={{ width: "300px", marginBottom: "0px" }} />
        <img src={user?.avatar || backgroundImage} alt="User Avatar" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
      </div>
      <h1 style={{ textAlign: "center", color: "white" }}>{user?.username || "Loading..."}</h1>
      <h5 style={{ textAlign: "center", color: "white" }}>{user?.email || ""}</h5>
      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", color: "white" }}>
        <div>
          <h5>{user?.posts?.length || 0}</h5>
          <h5>Posts</h5>
        </div>
        <div style={{ borderLeft: "1px solid black" }}>
          <h5>{user?.followers?.length || 0}</h5>
          <h5>Followers</h5>
        </div>
        <div style={{ borderLeft: "1px solid black" }}>
          <h5>{user?.followings?.length || 0}</h5>
          <h5>Following</h5>
        </div>
      </div>
      <br />
      <h5 style={{ color: "white", fontSize:"15px"}}>Bio :</h5>
      <h5 style={{ color: "white" }}>{user.bio}</h5>

      <div style={{ paddingTop: "40px", gap: "5px" }}>
        <Link to="/home" style={linkStyle("/")}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" style={iconStyle("/")}>
            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
          </svg>
          <p>Home</p>
        </Link>
        <Link to="/explore" style={linkStyle("/explore")}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" style={iconStyle("/explore")}>
            <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z" clipRule="evenodd" />
          </svg>
          <span>Explore</span>
        </Link>
        <Link to={`/chats/${user?._id}`} style={linkStyle(`/chats/${user?._id}`)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" style={iconStyle(`/chats/${user?._id}`)}>
            <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
          </svg>
          <span>Message</span>
        </Link>
        <Link to={`/${context.auth.username}`}  style={linkStyle(`/saved/${user?._id}`)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" style={iconStyle(`/saved/${user?._id}`)}>
            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
          </svg>
          <span>Profile</span>
        </Link>
        <Link to={`/accounts/${user?._id}`} style={linkStyle(`/accounts/${user?._id}`)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" style={iconStyle(`/accounts/${user?._id}`)}>
            <path fillRule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
          </svg>
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Aside;
