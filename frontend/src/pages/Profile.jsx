import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Image } from '../components/post/Image'
import { Spinner } from '../assets/Spinner'
import { url } from '../baseUrl'
import { api } from '../Interceptor/apiCall'
import { useContext } from 'react'
import { AuthContext } from '../context/Auth'
import { Dialog, DialogContent, DialogTitle, } from '@mui/material'
import { Followers } from '../components/dialog/Followers'
import Story from '../components/profile/Story'

export const Profile = ({ findStory, post = true }) => {
  const navigate = useNavigate()
  const context = useContext(AuthContext)
  const [user, setUser] = useState()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [iFollow, setIFollow] = useState(false)
  const [toggle, setToggle] = useState(1)
  const [followers, setFollowers] = useState(0)
  const params = useParams()

  useEffect(() => {
    api.get(`${url}/user/${params.username}`).then(resp => {
      setUser(resp.data)
      setFollowers(resp.data.followers.length)
      setIFollow(resp.data.followers.includes(context.auth._id))
      if (resp.data._id === context.auth._id) {
        context.handleActive("myprofile")
      } else {
        context.handleActive()
      }
    }).catch(err => console.log(err))
    return () => setUser()
  }, [context, params.username])

  useEffect(() => {
    if (!user) return
    if (post) {
      api.get(`${url}/post/userpost/${user?._id}`).then((data) => {
        setLoading(false)
        if (data) {
          setPosts(data.data);
        }
      }).catch(err => {
        console.log(err);
      })
    }
    if (!post) {
      api.get(`${url}/post/get/saved`).then((data) => {
        setLoading(false)
        if (data) {
          setPosts(data.data);
        }
      }).catch(err => {
        console.log(err);
      })
    }
    return () => {
      setPosts([])
    }
  }, [post, user])


  async function handleFollow() {
    api.get(`${url}/user/handlefollow/${user._id}`).then((res) => {
      if (res.data?.success) {
        setIFollow(prev => !prev)
      }
      if (iFollow) {
        setFollowers(f => f - 1)
      } else {
        setFollowers(f => f + 1)
      }
    })
  }

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openMore, setMore] = React.useState(false);

  const handleClickMenu = () => {
    setMore(true);
  };
  const handleCloseMenu = () => {
    setMore(false);
  };

  const handShake = () => {
    if (!user) return
    api.post(`${url}/chat/handshake`, {
      "people": [user._id]
    }).then((res) => {
      navigate(`/chats/${res.data.roomId}`)
    }).catch(err => console.log(err))
  }

  return (
    <div className='home' style={{ display: 'flex', flexDirection: 'column', backgroundColor:"white", width:"100%",background:"white"}}>
      <div className="user-info" style={{ display: 'flex', flexDirection: 'row', width: '84%', margin: 'auto', marginTop: '20px' }}>
        <div className="image-user">
          <Story profile={true} avatar={user?.avatar} uid={user?._id} />
        </div>
        <div className="follow-details" style={{ marginLeft: '5vw' }}>
          <div className="samline" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <p style={{ fontSize: '29px', marginRight: '22px', fontWeight: 'lighter', color: '#424141' }}>{user?.username}</p>
            {
              user?._id !== context.auth._id &&
              <button onClick={() => handShake()} style={{ border: '1px solid #c1c1c1', padding: '4px 7px', fontSize: '14px', borderRadius: '4px', fontWeight: 'bold', marginRight: '22px', color: '#424141' }}>Message</button>
              //
            }
            {
              user?._id === context.auth._id ?
                <button onClick={() => { navigate('/accounts/edit') }} style={{ border: '1px solid #c1c1c1', padding: '4px 7px', fontSize: '14px', borderRadius: '4px', fontWeight: 'bold', marginRight: '22px', color: '#424141' }}>Edit Profile</button>
                :
                iFollow ?
                  <button onClick={() => handleFollow()} style={{ padding: '4px 13px', fontSize: '14px', borderRadius: '4px', fontWeight: 'bold', marginRight: '22px', border: '1px solid #c1c1c1', color: '#424141' }}>Unfollow</button>
                  :
                  <button onClick={() => handleFollow()} style={{ padding: '5.5px 13px', fontSize: '14px', borderRadius: '4px', fontWeight: 'bold', marginRight: '22px', backgroundColor: 'rgb(33, 150, 243)', color: 'white' }}>Follow</button>
            }

            {
              user?._id === context.auth._id && <button className='no-style'><svg onClick={() => handleClickMenu()} style={{ marginTop: '5px' }} aria-label="Options" className="_ab6-" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" fill="none" r="8.635" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle><path d="M14.232 3.656a1.269 1.269 0 0 1-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 0 1-.796.66m-.001 16.688a1.269 1.269 0 0 1 .796.66l.505.996h1.862l.505-.996a1.269 1.269 0 0 1 .796-.66M3.656 9.768a1.269 1.269 0 0 1-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 0 1 .66.796m16.688-.001a1.269 1.269 0 0 1 .66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 0 1-.66-.796M7.678 4.522a1.269 1.269 0 0 1-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 0 1-.096 1.03m11.8 11.799a1.269 1.269 0 0 1 1.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 0 1 .096-1.03m-14.956.001a1.269 1.269 0 0 1 .096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 0 1 1.03.096m11.799-11.8a1.269 1.269 0 0 1-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 0 1-1.03-.096" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg></button>

            }
            <Dialog
              PaperProps={{
                style: {
                  minHeight: '10%',
                  maxHeight: '55%',
                  minWidth: '350px',
                  maxWidth: '350px',
                  padding: 0,
                  overflowY: 'auto',
                  borderRadius: '15px'
                }
              }}
              onClose={handleCloseMenu}
              aria-labelledby="customized-dialog-title"
              open={openMore}
            >
              <div>
                <div onClick={() => navigate('/accounts/reset')} className="option" style={{ borderBottom: '1px solid #dfdfdf', width: '100%', padding: '12px 0', fontSize: '14.17px', color: 'black', marginTop: '0px', textAlign: 'center', cursor: 'pointer' }}>
                  Change password
                </div>
                <div onClick={() => context.logout()} className="option" style={{ borderBottom: '1px solid #dfdfdf', width: '100%', padding: '12px 0', fontSize: '14.17px', color: 'black', textAlign: 'center', cursor: 'pointer' }}>
                  Logout
                </div>
                <div onClick={() => handleCloseMenu()} className="option" style={{ borderBottom: '1px solid #dfdfdf', width: '100%', padding: '12px 0', fontSize: '14.17px', color: 'black', marginBottom: '0px', textAlign: 'center', cursor: 'pointer' }}>
                  Cancel
                </div>

              </div>
            </Dialog>

          </div>
          <div className="singleline" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
            <p style={{ marginRight: '28px' }}><span style={{ fontWeight: 'bold', marginRight: '4px' }}>{user?.posts?.length}</span> Posts</p>
            <p onClick={() => { setToggle(1); handleClickOpen() }} style={{ marginRight: '28px', cursor: 'pointer' }}><span style={{ fontWeight: 'bold', marginRight: '4px' }}>{followers}</span> Followers</p>
            <p onClick={() => { setToggle(2); handleClickOpen() }} style={{ marginRight: '28px', cursor: 'pointer' }}><span style={{ fontWeight: 'bold', marginRight: '4px', cursor: 'pointer' }}>{user?.followings?.length}</span> Followings</p>
          </div>
          <Dialog
            PaperProps={{
              style: {
                minHeight: '15%',
                maxHeight: '55%',
                minWidth: '400px',
                maxWidth: '400px',
                padding: 0,
                overflowY: 'auto',
                borderRadius: '15px'
              }
            }}
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              <p style={{ textAlign: 'center', fontSize: '14px', fontWeight: 'bold', marginTop: '-5px', marginBottom: '-3px' }}>{toggle === 2 ? "Followings" : "Followers"}</p>
            </DialogTitle>
            {
              <DialogContent style={{ marginTop: '-9px', minHeight: '5px' }} dividers>
                <Followers handleClose={handleClose} toggle={toggle} userId={user?._id} />
              </DialogContent>
            }
          </Dialog>
          <div className="bioandstuff" style={{ marginTop: '20px' }}>
            <p style={{ fontWeight: 'bold' }}>{user?.name}</p>
            <p style={{ marginTop: '4px', marginBottom: '3px' }}>{user?.bio ? user.bio : "-"}</p>
            {
              user?.website &&
              <a href={user?.website} target="_blank" style={{ marginTop: '10px', color: '#0e4378', fontWeight: 'normal' }} rel="noreferrer">{user?.website.replace('https://', '')}</a>
            }
          </div>
        </div>
      </div>
      <div className="post-section" style={{ borderTop: '1px solid #d2cfcf', marginTop: '54px' }}>
        <div className="tab-select" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <Link to={`/${user?.username}`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: '18px 18px', borderTop: post ? '1px solid black' : '', paddingTop: '22px', marginTop: '-0.5px', width: '79px', paddingRight: '4px' }}>
            <svg aria-label="" className="_ab6-" color="#262626" fill="#262626" height="12" role="img" viewBox="0 0 24 24" width="12"><rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line></svg>
            <p style={{ fontSize: '12.4px', color: post ? 'black' : 'gray', marginLeft: '4px', fontWeight: post ? 'bold' : 'normal' }}>POSTS</p>
          </Link>
          {
            user?._id === context.auth._id &&
            <Link to={`/saved/${user?.username}`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: '18px 18px', borderTop: !post ? '1px solid black' : '', paddingTop: '22px', marginTop: '-0.5px', width: '79px', paddingRight: '4px' }}>
              <svg aria-label="" className="_ab6-" color="#8e8e8e" fill="#8e8e8e" height="12" role="img" viewBox="0 0 24 24" width="12"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
              <p style={{ fontSize: '12.4px', color: !post ? 'black' : 'gray', marginLeft: '4px', fontWeight: !post ? 'bold' : 'normal' }}>SAVED</p>
            </Link>
          }

        </div>
        <div className="post-content">
          {
            posts.length === 0 && loading && <Spinner />
          }

          {
            posts.length === 0 && !loading && <p style={{ textAlign: 'center', marginTop: '72px', width: '100%', fontWeight: 'bold', fontSize: '16px' }}>No posts to see</p>
          }

          {
            post ?
              <div className='grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', rowGap: '17px' }}>
                {
                  posts?.map(item =>
                    <Image userId={item.owner} postId={item._id} likes={item.likes.length} comments={item.comments.length} key={item._id} src={item.files[0].link}></Image>
                  )
                }

              </div> : <div className='grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', rowGap: '13px' }}>
                {
                  posts?.map(item =>
                    <Image userId={item.owner} postId={item._id} likes={item.likes.length} comments={item.comments.length} key={item._id} src={item.files[0].link}></Image>
                  )
                }
              </div>
          }
        </div>
      </div>
    </div>
  )
}
