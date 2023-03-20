
// WORKS FOR INDIVIDUAL AND SEPARATE CLIENTS

// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   // const [text, setText] = useState('');
//   const [inputValue, setInputValue] = useState('');
//   const [serverResponse, setServerResponse] = useState('');

//   // const handleButtonClick = () => {
//   //   axios.post('/api/echo', { text })
//   //     .then(response => {
//   //       console.log(response.data);
//   //     })
//   //     .catch(error => {
//   //       console.log(error);
//   //     });
//   // };
//   const handleButtonClick = async () => {
//     const api = axios.create({
//       baseURL: 'http://localhost:5001'
//     });
//     const response = await api.post('/api/echo', { text: inputValue });
//       setServerResponse(response.data.echo);
//   };


//   return (
//     <div>
//       <input
//         type="text"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//       />
//       <button onClick={handleButtonClick}>Send</button>
//       <p>Server response: {serverResponse}</p>
//     </div>
//   );
// }

// export default App;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [message, setMessage] = useState("");
//   const [name, setName] = useState("");
//   const [image, setImage] = useState(null);

//   const handleInputChange = (event) => {
//     const target = event.target;
//     const value = target.value;
//     const name = target.name;
//     if (name === "message") {
//       setMessage(value);
//     } else if (name === "name") {
//       setName(value);
//     }
//   };

//   const handleFileInputChange = (event) => {
//     setImage(event.target.files[0]);
//   };

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append("message", message);
//     formData.append("name", name);
//     if (image) {
//       formData.append("image", image, image.name);
//     }

//     try {
//       console.log("data name: ", formData.name, "data message: ", formData.message);
//       const api = axios.create({
//               baseURL: 'http://localhost:5001'
//      });
//       await api.post('api/messages', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       console.log("message sent");
//       setMessage("");
//       setName("");
//       setImage(null);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="App">
//       <div className="form-container">
//         <form onSubmit={handleFormSubmit}>
//           <label htmlFor="name">Name:</label>
//           <input type="text" name="name" id="name" value={name} onChange={handleInputChange} required />

//           <label htmlFor="message">Message:</label>
//           <textarea name="message" id="message" value={message} onChange={handleInputChange} required />

//           <label htmlFor="image">Image:</label>
//           <input type="file" name="image" id="image" accept="image/*" onChange={handleFileInputChange} />

//           <button type="submit">Send</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default App;

// working!! but not the image
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [serverMessages, setServerMessages] = useState([]);

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (name === "message") {
      setMessage(value);
    } else if (name === "name") {
      setName(value);
    }
  };

  const handleFileInputChange = (event) => {
    console.log(event.target);
    setImage(event.target.files[0]);
  };

  const handleSend = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("message", message);
    formData.append("name", name);
    if (image) {
      formData.append("image", image, image.name);
    }

    try {
      const api = axios.create({
        baseURL: 'http://localhost:5001'
      });
      await api.post('api/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("message sent");
      setMessage("");
      setName("");
      setImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5001');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      setServerMessages(prevMessages => [...prevMessages, messageData]);
    };

    return () => {
      ws.close();
      console.log('Disconnected from WebSocket server');
    };
  }, []);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Send Message</h5>
            </div>
            <div className="card-body">

              <form onSubmit={handleSend}>
                <label htmlFor="name">Name:</label>
                <input type="text" name="name" id="name" value={name} onChange={handleInputChange} required />

                <label htmlFor="message">Message:</label>
                <textarea name="message" id="message" value={message} onChange={handleInputChange} required />

                <label htmlFor="image">Image:</label>
                <input type="file" name="image" id="image" accept="image/*" onChange={handleFileInputChange} />

                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
           <div className="card">
              <div className="card-header">
                <h5>Received Messages</h5>
              </div>
              <div className="card-body">
                <ul className="list-group">
                    {/* <div className="message-container"> */}
                      {serverMessages.map((message, index) => (
                        <li
                          className="list-group-item d-flex justify-content-between align-items-center"
                          key={index}
                        >
                          <div>
                            <p className="mb-0">
                              <strong>{message.name}: </strong>
                                      {message.message}
                            </p>
                            {/* //<div key={index}>

                              //<p>{message.name}:</p>
                              //<p>{message.message}</p> */}
                              {message.imageUrl && <img src={message.imageUrl} alt="uploaded file" className="img-fluid mt-2" />}
                          </div>
                          <small>{formatTime(message.timestamp)}</small>
                        </li>
                      ))}

                  </ul>
              </div>
            </div>
        </div>
      </div>    
    </div>
  );
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const formattedTime = hours + ":" + minutes + ":" + seconds;
  return formattedTime;
}

export default App;
