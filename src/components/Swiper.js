import React, { useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import '../styles/swiper.css';

// import required modules
import { Navigation } from 'swiper/modules';

export default function Swipers({ buildingName }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
          const response = await axios.get('http://ceprj.gachon.ac.kr:60014/building/search', {
            params: {
              folderName: `imgs/${buildingName}/`,
            },
          });
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [buildingName]);

  return (
    <div style={{ width: '70%', margin: '0 auto' }}>
      <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
      {data.map((imageUrl, index) => (
          <SwiperSlide key={index}>
            <img src={imageUrl} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}