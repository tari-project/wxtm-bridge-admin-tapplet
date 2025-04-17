import { Paper } from '@mui/material';
import ReactJsonView from '@microlink/react-json-view';
import { CallDataViewProps } from './types';

const CallDataView = ({ decodedData }: CallDataViewProps) => {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        padding: 3,
      }}
    >
      <ReactJsonView
        src={decodedData}
        enableClipboard={false}
        displayObjectSize={false}
        name={'calldata'}
      />
    </Paper>
  );
};

export default CallDataView;
