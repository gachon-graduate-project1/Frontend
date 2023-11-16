import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function TestPage() {
  const [buildingName, setBuildingName] = useState('');
  const [image, setImage] = useState(null);

  const fetchBuildingImages = async () => {
    try {
      const response = await axios.get('http://ceprj.gachon.ac.kr:60014/file/getFolderList', {
        params: {
          folderName: `imgs/${buildingName}/`
        }
      });
      const images = response.data;
      if (images && images.length > 0) {
        setImage(`https://palgongtea.s3.ap-northeast-2.amazonaws.com/imgs/${buildingName}/${images[1]}`);
      } else {
        setImage(null);
      }
    } catch (error) {
      console.error(error);
      setImage(null);
    }
  };

  return (
    <div>
      <TextField
        label="Building Name"
        value={buildingName}
        onChange={event => setBuildingName(event.target.value)}
      />
      <Button onClick={fetchBuildingImages}>Fetch Image</Button>
      {image && <img src={image} alt="Building" />}
    </div>
  );
}

export default TestPage;
