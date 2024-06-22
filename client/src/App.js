
import './App.css';
import io from 'socket.io-client'
import {useEffect,useState} from 'react'

const socket = io.connect("http://localhost:5000")

function App() {
  const [message,setMessage] = useState("")
  // const [messageReceived,setMessageReceived] = useState("")
  const room = 10;
  const [chat,setChat] = useState([])

  const joinRoom = () =>{
    if(room!==""){
      socket.emit("join_user",room)
    }
  }

  const sendMessage=()=>{
    socket.emit("send_message",{message,room});
    let temp = {}
    temp.msg = message;
    temp.type='self'
    setChat(prev=>[...prev,temp])
        setMessage('')

  };

    useEffect(()=>{
      socket?.off("receive_message").on("receive_message",(data)=>{
        console.log(data)
        // setMessageReceived(data.message)
        let temp = {}
        temp.msg=data.message;
        temp.type='another'
        setChat(prev=>[...prev,temp])
      })
    },[socket])

    useEffect(() => {
      if(socket){
        joinRoom()
      }
    },[])
    
    return (
      <div className="container mt-5">
          <div className="d-flex">
              <input
                  className="form-control my-2 me-2"
                  placeholder="Message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(key) => {
                      if (key.key === "Enter") sendMessage();
                  }}
              />
              <button className="btn btn-primary btn-sm my-2" onClick={sendMessage}>
                  Send Message
              </button>
          </div>
          <h1>Messages:</h1>
          <div className="container">
              {chat.map((msg, index) => (
                  <div
                      className={`d-flex ${msg.type === 'self' ? 'justify-content-end' : 'justify-content-start'}`}
                      key={index}
                  >
                      <h6 className={`p-2 rounded ${msg.type === 'self' ? 'bg-success text-white' : 'bg-primary text-white'}`}>
                          {msg.msg}
                      </h6>
                  </div>
              ))}
          </div>
      </div>
  );

}

export default App;
