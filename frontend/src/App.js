import { Navbar } from "./components/navbar/Navbar";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { AuthContext } from "./context/Auth";
import { useEffect, useState } from "react";
import Redirect from "./routers/Redirect";
import { Forgot } from "./pages/Forgot";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import toast, { Toaster } from "react-hot-toast";
import { Chat } from "./pages/Chat";
import Story from "./pages/Story";
import { api } from "./Interceptor/apiCall";
import { url } from "./baseUrl";
import io from "socket.io-client";
import { Password } from "./pages/Password";
import AuthRedirect from "./pages/AuthRedirect";
import Aside from "./pages/Aside"; 
import backgroundImage from "../src/assets/download.jpeg"
import { FAQ } from "./pages/Faq";
import { jwtDecode } from "jwt-decode";
import ReactModal from 'react-modal'; // Import ReactModal

export const socket = io(url);

function App() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("user")));
  const [active, setActive] = useState("home");
  const [stories, setStories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const throwErr = (err) => {
    toast.error(err, {
      style: {
        fontFamily: "Poppins",
        fontSize: "12.5px",
      },
    });
  };

  const throwSuccess = (msg) => {
    toast.success(msg, {
      style: {
        fontFamily: "Poppins",
        fontSize: "12.5px",
      },
    });
  };

  useEffect(() => {
    if (!auth) return;

    const token = auth.access_token;
    if (token) {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000 - 1000; // Buffer time of 1 second

      if (Date.now() >= expirationTime) {
        handleSessionExpiration();
      } else {
        const logoutTimer = setTimeout(() => {
          handleSessionExpiration();
        }, expirationTime - Date.now());

        return () => clearTimeout(logoutTimer);
      }
    }

    api
      .get(`${url}/story/home`)
      .then((res) => {
        setStories(res.data);
      })
      .catch((err) => console.log(err));
  }, [auth]);

  useEffect(() => {
    socket.on("connect");
    if (auth) socket.emit("online", { uid: auth._id });
    return () => {
      socket.off("connect");
    };
  }, [auth]);

  const handleActive = (page) => {
    setActive(page);
  };

  const handleSessionExpiration = () => {
    setIsModalOpen(true); // Show the modal
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("user");
    setIsModalOpen(false); // Close the modal
    navigate("/login");
  };

  const findStory = (id) => {
    const flatArr = [];
    stories.forEach((item) => {
      flatArr.push(...item);
    });
    const currentIndex = flatArr.findIndex((item) => item.id === id);
    if (currentIndex === -1) {
      return {
        prev: undefined,
        current: undefined,
        next: undefined,
      };
    }
    return {
      prev: currentIndex - 1 >= 0 ? flatArr[currentIndex - 1] : undefined,
      current: flatArr[currentIndex],
      next:
        currentIndex + 1 < flatArr.length
          ? flatArr[currentIndex + 1]
          : undefined,
    };
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, throwErr, throwSuccess, handleActive, findStory }}
    >
      <Toaster />
      <ReactModal 
        isOpen={isModalOpen}
        onRequestClose={handleLogout}
        contentLabel="Session Expired"
        ariaHideApp={false}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          },
        }}
      >
        <h2>Session Expired</h2>
        <p>Your session has expired. Please log in again.</p>
        <button onClick={handleLogout}>OK</button>
      </ReactModal>
      <div
        className="flex"
        style={{
          width: "100%",
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: "red",
          justifyContent: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {auth && <Aside active={active} style={{ width: "20%" }} />}
        <div className="main-body">
          {auth && <Navbar active={active} />}
          <Routes>
            <Route
              path="/"
              element={
                <Redirect>
                  <Login />
                </Redirect>
              }
            />
            <Route
              path="/signup"
              element={
                <Redirect>
                  <Signup />
                </Redirect>
              }
            />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/:username" element={<Profile />} />
            <Route path="/oauth/redirect" element={<AuthRedirect />} />
            <Route path="/chats/:id" element={<Chat />} />
            <Route path="/story/:userId" element={<Story />} />
            <Route exact path="/home" element={<Home stories={stories} />} />
            <Route path="/saved/:username" element={<Profile post={false} />} />
            <Route path="/accounts/:params" element={<Settings />} />
            <Route path="/reset/:token" element={<Password />} />
            <Route path="/FAQ" element={<FAQ />} />
          </Routes>
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
