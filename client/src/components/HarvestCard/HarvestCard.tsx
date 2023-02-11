import { Box, Button, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { Harvest } from '../../models/harvest.model';
import MatIcon from '../MatIcon/MatIcon';
import moment from 'moment';

export interface HarvestCardProps {
  harvest: Harvest;
  onDelete: (harvestId?: string) => void;
  [key: string]: any;
}

const HarvestCard = ({ harvest, onDelete, ...props }: HarvestCardProps) => {
  let color: string = 'green';

  return (
    <Paper elevation={4} {...props} className={`p-2 flex justify-between items-center`}>
      <Box>
        <Box>
          <Box className='flex gap-2'>
            <MatIcon style={{ fontSize: '1.4rem' }} color='primary'>
              grass
            </MatIcon>
            <Typography>
              <span className='text-gray-400'>Kulturа:</span> {`${harvest.cultureName}  `}
            </Typography>
          </Box>
          <Box className='flex gap-2 items-center'>
            <MatIcon style={{ fontSize: '1.4rem' }} color='primary'>
              warehouse
            </MatIcon>
            <Typography>
              <span className='text-gray-400'>Količina:</span> {`${harvest.amount}`} kg
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className='h-full'>
        <Box className='h-full flex items-center gap-2'>
          <span>
            <span className='text-gray-400'>Datum berbe: </span>
            <span>{moment(harvest?.date).format('DD/MM/yyyy')}</span>
          </span>
          <span className='max-w-fit'>
            <Tooltip
              title='Obriši berbu'
              children={
                <span>
                  <IconButton onClick={() => onDelete(harvest.id)}>
                    <MatIcon color='error' style={{ fontSize: '1.2rem' }}>
                      delete
                    </MatIcon>
                  </IconButton>
                </span>
              }></Tooltip>
          </span>
        </Box>
      </Box>
    </Paper>
  );
};

export default HarvestCard;
