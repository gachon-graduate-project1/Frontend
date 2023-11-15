import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Pagination } from '@mui/material';
import axios from 'axios';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: '2px solid #5784F7'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 3),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: "#5784F7"
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(2, 0),
    marginLeft: `calc(1em + ${theme.spacing(6)})`,
    marginRight: `calc(1em + ${theme.spacing(1)})`,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50ch',
    },
  },
}));

export default function RealtyList() {
  const [buildingList, setBuildingList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const response = await axios.get('http://ceprj.gachon.ac.kr:60014/building/getAll', {
          params: {
            startIndex,
            endIndex
          }
        });
        setBuildingList(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage]);

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return buildingList.slice(indexOfFirstItem, indexOfLastItem);
  };

  const getPriceText = (building) => {
    let priceText = '';
    if (building.transactionType === '월세' || building.transactionType === '단기임대') {
      priceText = ` ${building.rentPrice}만 원`;
    } else if (building.transactionType === '전세') {
      priceText = ` ${building.warantPrice}만 원`;
    } else if (building.transactionType === '매매') {
      priceText = ` ${building.dealPrice}만 원`;
    }
    return `${building.transactionType} ${priceText}`;
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const search = async () => {
    try {
      const response = await axios.get('http://ceprj.gachon.ac.kr:60014/building/search', {
        params: {
          keyword: searchTerm
        }
      });
      setBuildingList(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('검색 결과가 없습니다');
      } else {
        console.error(error);
      }
    }
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      search();
    }
  };

 // 매물 이미지 미리보기 한장 출력
 const fetchBuildingImages = async (building) => {
  try {
    const response = await axios.get('http://ceprj.gachon.ac.kr:60014/file/getFolderList', {
      params: {
        folderName: `imgs/${building.building_name}/`
      }
    });
    const images = response.data;
    if (images && images.length > 0) {
      return images[0]; // 첫 번째 이미지를 반환
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};




  
  return (
    <>
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar elevation={0} style={{ backgroundColor: 'transparent' }} position="static">
            <Grid item style={{ margin: "100px 50px 50px 50px" }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  style={{ color: "#898989" }}
                  placeholder="지역명 또는 단지명으로 검색해주세요."
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onKeyPress={handleSearchKeyPress}
                />
              </Search>
            </Grid>
          </AppBar>
        </Box>
        <List sx={{ textAlign: 'center', width: '70%', margin: '50px', bgcolor: 'background.paper' }}>
          <Grid style={{ margin: '20px', textAlign: 'left', fontWeight: 'bold', color: '#414141' }}>검색 결과</Grid>
          <Divider sx={{ margin: '0 0', backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />

          {getCurrentItems().map((building) => (
  <React.Fragment key={building.id}>
    <ListItem alignItems="center">
    <ListItemAvatar>
  {building && (
    <img
      src={`http://ceprj.gachon.ac.kr:60014/img/${building.building_name}/${fetchBuildingImages(building)}`}
      width="200px"
      style={{ margin: '5px' }}
      alt="Building"
    />
  )}
</ListItemAvatar>
      <div style={{ margin: '30px' }}>
        <ListItemText
          primary={<Typography variant="h5" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{building.address}</Typography>}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
                style={{ fontSize: '1.3em' }}
              >
                {getPriceText(building)}
              </Typography>
            </React.Fragment>
          }
        />
      </div>
    </ListItem>
    <Divider sx={{ margin: '0 0', backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
    <Divider variant="inset" component="li" />
  </React.Fragment>
))}


          <Grid sx={{ justifyContent: 'center', marginTop: '20px' }}>
            <Pagination
              count={Math.ceil(buildingList.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
            />
          </Grid>
        </List>
      </Grid>
    </>
  );
}
