import React, { useState } from "react";
import "./navbar.css";
import Search from "./Search";
import { Link, NavLink } from "react-router-dom";
import { exploreFill, homeFill, messageFill, messageOutline, profileIcon, savedIcon, settingsIcon, switchAccountIcon } from "../../assets/svgIcons";
import { exploreOutline } from "../../assets/svgIcons";
import { postUploadOutline } from "../../assets/svgIcons";
import { likeOutline } from "../../assets/svgIcons";
import { homeOutline } from "../../assets/svgIcons";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth";
import { url } from "../../baseUrl";
import { api } from "../../Interceptor/apiCall";
import defaultImg from '../../assets/dafault.png'
import { NotificationBox } from "../dialog/NotificationBox";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from '../../firebase';


export const Navbar = ({ active }) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [imgurl, setImgurl] = useState('')
  const context = useContext(AuthContext)
  const [caption, setCaption] = useState('')
  const [innerActive, setInnerActive] = useState()

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorElNot, setAnchorElNot] = React.useState(null);
  const openNot = Boolean(anchorElNot);
  const handleClickNot = (event) => {
    setInnerActive("notification")
    setAnchorElNot(event.currentTarget);
  };
  const handleCloseNot = () => {
    setAnchorElNot(null);
    setInnerActive()
  };

  const [openDailog, setOpenDilaog] = React.useState(false);

  const handleClickOpen = () => {
    setInnerActive("newpost")
    setOpenDilaog(true);
  };

  const handleCloseDialog = () => {
    setImgurl('')
    setCaption('')
    setOpenDilaog(false);
    setInnerActive()
  };

  const logout = async () => {
    api.post(`${url}/auth/logout`, {
      token: localStorage.getItem('refresh_token')
    }).then((resp) => {
      if (resp.data) {
        localStorage.clear();
        context.setAuth(null);
        window.location.replace("/"); // Navigate to the homepage
      }
    }).catch((err) => {
      console.error("Logout error:", err);
    });
  }
  context.logout = logout;

  const upload = async (e) => {
    const file = e.target.files[0]
    if (!(file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      context.throwErr("Filt type not supported")
    }
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.log(error);
        context.throwErr("Some error occured")
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgurl(downloadURL)
        });
      }
    );
  }
  const handlePost = async () => {
    if (!caption) {
      return context.throwErr("Caption Required")
    }
    const data = {
      caption: caption,
      files: [{
        fileType: "image",
        link: imgurl
      }]
    }
    api.post(`${url}/post/create`, data).then((res) => {
      if (res.data) {
        context.throwSuccess("Posted")
        handleCloseDialog()
        context.newpost(res.data)
      }
      console.log(res.data);
    })
  }


  return (
    <div className="navbar flex" style={{ borderRadius: "20px 20px 0 0" }}>
      <div className="width60s nav flex justity-between" style={{alignItems:"center"}}>


        <div className="searchbar">
          <Search />
        </div>
        <div className="icons">
          <NavLink to="/home" style={{ color: 'black' }} >{(active === "home" && !innerActive) ? homeFill : homeOutline}</NavLink>
          <Link to="/chats/all">{(active === "chat" && !innerActive) ? messageFill : messageOutline}</Link>

          <button onClick={handleClickOpen} className="no-style " >{innerActive === "newpost" ?
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" class="size-6">
              <path fill-rule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clip-rule="evenodd" />
            </svg>
            :
            postUploadOutline}</button>
          <Dialog
            maxWidth="lg"
            open={openDailog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
              style: {
                borderRadius: '15px'
              }
            }}
          >
            <DialogTitle style={{ fontFamily: 'Poppins', textAlign: 'center', fontSize: '15.5px', backgroundColor: '#BD00FF' }} id="alert-dialog-title">
              {"Create new post"}
            </DialogTitle>
            <Divider style={{ marginTop: '-10px' }} />
            <DialogContent style={{}}>
              <div className="post" style={{ width: '45vw', height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>

                {
                  imgurl ?
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                      <div className="imageup" style={{ height: '65%' }}>
                        <img style={{ width: '95%', height: '100%', margin: 'auto' }} src={imgurl} alt="" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', width: '80%', position: 'absolute', bottom: 15, margin: 'auto' }}>
                        <TextField
                          id="outlined-multiline-static"
                          label="Caption"
                          multiline
                          rows={4}
                          InputProps={{
                            style: { fontSize: '13.5px', fontFamily: 'Poppins' }
                          }}
                          value={caption} onChange={e => setCaption(e.target.value)}
                        />
                        <button onClick={() => handlePost()} style={{ border: 'none', outline: 'none', background: 'blue', padding: '3.5px 9px', borderRadius: '5px', color: 'white', backgroundColor: '#2196f3', marginTop: '12px', fontSize: '15px', cursor: 'pointer' }}>Upload</button>
                      </div>
                    </div> :
                    <>
                      <svg style={{ marginBottom: '10px' }} aria-label="Icon to represent media such as images or videos" color="#262626" fill="#262626" height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path><path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path><path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path></svg>
                      <p style={{ fontSize: '15px' }}>Drag photos and videos here</p>
                      <label htmlFor="imgHandleUp" style={{ border: 'none', outline: 'none', background: 'blue', padding: '3.5px 9px', borderRadius: '5px', color: 'white', backgroundColor: '#2196f3', marginTop: '12px', fontSize: '15px', cursor: 'pointer' }}>Select from computer</label>
                      <input onChange={e => upload(e)} id="imgHandleUp" type="file" multiple hidden />
                    </>
                }

              </div>
            </DialogContent>

          </Dialog>
          <button onClick={handleClickOpen} className="create-post-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path fillRule="evenodd" d="M12 2a1 1 0 011 1v8h8a1 1 0 110 2h-8v8a1 1 0 11-2 0v-8H3a1 1 0 110-2h8V3a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Create Post</span>
          </button>

          <Menu
            anchorEl={anchorElNot}
            id="account-menu"
            open={openNot}
            onClick={handleCloseNot}
            onClose={handleCloseNot}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                width: '470px',
                minHeight: '30px',
                maxHeight: '400px',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <div style={{ minHeight: '150px', maxHeight: '390px', display: 'flex', flexDirection: 'column', overflowY: 'scroll', }}>

              {
                <NotificationBox />
              }

            </div>

          </Menu>

          <NavLink to="/explore">{(active === "explore" && !innerActive) ? exploreFill : exploreOutline}</NavLink>


          <button className="no-style " style={{ marginRight: "10px" }} onClick={handleClickNot} >{innerActive === "notification" ?
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
            </svg>
          }</button>


          <button onClick={handleClick} className="no-style " >
            <img style={{ minWidth: '27px', height: '27px', objectFit: 'cover', borderRadius: '50%', border: (active === "myprofile" && !innerActive) ? '2px solid #333333' : "2px solid white", marginLeft: '-2px' }} src={context?.auth?.avatar ? context.auth.avatar : defaultImg} alt="" />
          </button>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                width: '250px',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem style={{ fontSize: '13px', fontFamily: 'Poppins' }}>
              <Link to={`/${context.auth.username}`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                {profileIcon}
                <span style={{ marginLeft: '12px' }}>Profile</span>
              </Link>
            </MenuItem>
            <MenuItem style={{ fontSize: '13px', fontFamily: 'Poppins' }}>
              <Link to="/saved/thenisab" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                {savedIcon}
                <span style={{ marginLeft: '12px' }}>Saved</span>
              </Link>
            </MenuItem>
            <MenuItem style={{ fontSize: '13px', fontFamily: 'Poppins' }}>
              <Link to="/accounts/edit" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                {settingsIcon}
                <span style={{ marginLeft: '12px' }}>Settings</span>
              </Link>
            </MenuItem>
            <MenuItem style={{ fontSize: '13px', fontFamily: 'Poppins' }}>
              {switchAccountIcon}
              <span style={{ marginLeft: '12px' }}>Switch accounts</span>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => logout()} style={{ fontSize: '13px', fontFamily: 'Poppins' }}>
              <span style={{ marginLeft: '7px' }}>Logout</span>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};
