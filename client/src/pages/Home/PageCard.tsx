import { Box, Card, CardContent, CardMedia, Paper, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

interface PageCardProps {
  image?: string;
  children?: ReactNode;
  title?: string;
  onClick?: () => void;
  [key: string]: any;
}

const PageCard = ({ image, children, title, onClick, ...props }: PageCardProps) => {
  return (
    <Paper {...props}>
      <Card className='h-full'>
        <CardMedia sx={{ height: '400px' }} image={`${image}`} title={`${title}`} />
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {title}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {children}
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default PageCard;
