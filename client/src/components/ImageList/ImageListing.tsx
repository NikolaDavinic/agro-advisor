import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { color } from '@mui/system';

interface ImageListingProps {
  data: Array<any>
}

const ImageListing = ({
  data
}:ImageListingProps) => {
  return (
    <Box sx={{ width: "100%", height: 450, overflowY: 'scroll', padding: "10px", border: "10px solid #FFB100", 
      borderRadius: "2%"}}>
      <ImageList variant="masonry" cols={3} gap={8}>
        {data.map((item) => (
          <ImageListItem key={item.img}>
            <img
              src={`${item.img}?w=248&fit=crop&auto=format`}
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar position="below" className='font-bold' color='pirmary' title={item.author} />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}
export default ImageListing;