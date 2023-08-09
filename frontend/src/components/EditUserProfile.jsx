import { useState } from 'react';
import { useNavigate } from 'react-router';


const EditUserProfile = () => {
  const navigate = useNavigate();
  // State to hold user data
  const [userData, setUserData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    linkedin: '',
    facebook: '',
    picture: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const convertBase64 = (file) => new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result)
    }

    fileReader.onerror = (error) => {
      reject(error)
    }
  })

  const handlePictureUpload = async (event) => {
    const pictureFile = event.target.files[0];
      const base64 = await convertBase64(pictureFile);
      const imageBase64 = base64.split(",")[1];
      //console.log(base64);
      console.log(imageBase64)

    setUserData((prevUserData) => ({
      ...prevUserData,
      picture: imageBase64,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("jwtToken");
  
    const username = localStorage.getItem("username").toLowerCase();
  
    fetch(`http://localhost:8080/dashboard/edit-user?id=${username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('User data updated successfully');
          return response.json(); 
        } else {
          console.log('User data update failed');
          throw new Error('User data update failed');
        }
      })
      .then((responseData) => {
        const updatedUsername = responseData.username; 
        const newToken = responseData.token;
        const picture = responseData.picture;
        console.log(picture)
        localStorage.setItem("username", updatedUsername); 
        localStorage.setItem("jwtToken", newToken);
        localStorage.setItem("picture", picture)
        console.log(`Updated username: ${updatedUsername}`);
        navigate(`/dashboard/${updatedUsername}`);
      })
      .catch((error) => {
        console.error('Error updating user data:', error);
      });
  };
  

  return (
    <>
    <div className="container mt-4">
      <h2 className="mb-4">Edit User Profile</h2>
      <form onSubmit={handleFormSubmit}>
      <div className="mb-3">
          <label htmlFor="username" className="form-label">Username:</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name:</label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="linkedin" className="form-label">LinkedIn:</label>
          <input
            type="text"
            name="linkedin"
            value={userData.linkedin}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="facebook" className="form-label">Facebook:</label>
          <input
            type="text"
            name="facebook"
            value={userData.facebook}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="picture" className="form-label">Upload Picture:</label>
          <input type="file" accept="image/*" onChange={handlePictureUpload} className="form-control" />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
    </>
  );
};

export default EditUserProfile;