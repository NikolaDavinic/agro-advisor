import { Box, Card, CardContent, CardMedia, Paper, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ImageListing from '../../components/ImageList/ImageListing';
import PageCard from './PageCard';

//Treba samo da se pribave podaci za ovo sto ce da se prikazuje ovde
const Home = () => {
  const navigate = useNavigate();

  return (
    <Box className='h-full'>
      <Box
        sx={{
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          height: '100%',
          position: 'relative',
          backgroundAttachment: 'fixed',
          // backgroundPosition: 'center center',
          backgroundImage: `url(http://localhost:3000/6694962.jpg)`,
        }}>
        <Box position='relative'>
          <Box className='p-5'>
            <Typography
              variant='h4'
              fontWeight='bold'
              sx={{
                letterSpacing: '2px',
                color: 'var(--secondary-light)',
                textShadow:
                  '-1px -1px 0 var(--primary), 1px -1px 0 var(--primary), -1px 1px 0 var(--primary), 1px 1px 0 var(--primary)',
              }}>
              Dobrodošli na AgroAdvisor
            </Typography>
          </Box>
          <Box
            className='flex flex-col lg:flex-row gap-5 lg:px-20 p-5 lg:justify-center'
            sx={{ height: '100%' }}>
            <Box className='w-full lg:w-1/4 flex-grow'>
              <Link to='/plots'>
                <PageCard
                  title='Parcele'
                  className='w-full'
                  image='/plots-page.png'
                  sx={{ border: '2px solid var(--primary)' }}>
                  <span>Budite u toku da li vam je komšija preorao među</span>
                </PageCard>
              </Link>
            </Box>
            <Box className='w-full lg:w-2/5'>
              <Link to='/dashboard'>
                <PageCard
                  title='Transakcije'
                  image='/dashboard-page.jpg'
                  className='w-full h-full'
                  sx={{ border: '2px solid var(--primary)' }}>
                  Pratite vaše prihode i rashode
                </PageCard>
              </Link>
            </Box>
            <Box className='w-full lg:w-1/4 flex-grow'>
              <Link to='/machines'>
                <PageCard
                  title='Mašinerija'
                  className='w-full'
                  image='/machinery-page.jpg'
                  sx={{ border: '2px solid var(--primary)' }}>
                  <span>Informacije o vašim mašinama na dohvat ruke</span>
                </PageCard>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
