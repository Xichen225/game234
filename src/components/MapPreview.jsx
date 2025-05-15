import { Box, Typography, Paper, Grid } from '@mui/material';

const MapPreview = ({ mapData }) => {
  // 获取地块样式
  const getCellStyle = (cell) => {
    if (cell.isStart) {
      return 'start-cell';
    } else if (cell.isEnd) {
      return 'end-cell';
    } else {
      const typeClass = cell.type === 'fire' ? 'fire' : cell.type === 'storm' ? 'storm' : 'ice';
      return `${typeClass}-${cell.level}`;
    }
  };

  // 获取地块显示内容
  const getCellContent = (cell) => {
    if (cell.isStart) {
      return '起点';
    } else if (cell.isEnd) {
      return '终点';
    } else {
      // const typeText = cell.type === 'fire' ? '炎热' : cell.type === 'storm' ? '风暴' : '寒冰';
      return `l.v.${cell.level}`;
    }
  };

  // 获取地块颜色图标
  const getCellIcon = (cell) => {
    if (cell.isStart || cell.isEnd) {
      return '';
    } else if (cell.type === 'fire') {
      return '🔥';
    } else if (cell.type === 'storm') {
      return '🌪️';
    } else {
      return '❄️';
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        选择适当的装备来抵御地块伤害，取得终点的宝藏。
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        （开始游戏后通过a,w,s,d控制角色移动）
      </Typography>

      <Box className="game-map" sx={{ mt: 3 }}>
        {mapData.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <Paper
              key={`${rowIndex}-${colIndex}`}
              className={`map-cell ${getCellStyle(cell)}`}
              elevation={0}
            >
              <Box>
                <Typography variant="caption">{getCellContent(cell)}</Typography>
                {/* 地块图片显示 */}
                {!(cell.isStart || cell.isEnd) && (
                  <img
                    src={`/game234/${cell.type === 'fire' ? 'r' : cell.type === 'storm' ? 'g' : 'b'}_p_${cell.level}.${cell.type === 'fire' ? (cell.level === 1 ? 'png' : 'gif') : (cell.level === 1 ? 'png' : 'gif')}`}
                    alt={`${cell.type}${cell.level}`}
                    style={{ width: '32px', height: '32px', display: 'block', margin: '4px auto' }}
                  />
                )}
              </Box>
            </Paper>
          ))
        ))}
      </Box>

      {/*<Box sx={{ mt: 2 }}>*/}
      {/*  <Grid container spacing={2}>*/}
      {/*    <Grid sx={{ width: '33.33%' }}>*/}
      {/*      <Box sx={{ display: 'flex', alignItems: 'center' }}>*/}
      {/*        <Box className="map-cell fire-1" sx={{ width: 20, height: 20, mr: 1 }}></Box>*/}
      {/*        <Typography variant="caption">炎热1级</Typography>*/}
      {/*      </Box>*/}
      {/*    </Grid>*/}
      {/*    <Grid sx={{ width: '33.33%' }}>*/}
      {/*      <Box sx={{ display: 'flex', alignItems: 'center' }}>*/}
      {/*        <Box className="map-cell fire-2" sx={{ width: 20, height: 20, mr: 1 }}></Box>*/}
      {/*        <Typography variant="caption">炎热2级</Typography>*/}
      {/*      </Box>*/}
      {/*    </Grid>*/}
      {/*    <Grid sx={{ width: '33.33%' }}>*/}
      {/*      <Box sx={{ display: 'flex', alignItems: 'center' }}>*/}
      {/*        <Box className="map-cell fire-3" sx={{ width: 20, height: 20, mr: 1 }}></Box>*/}
      {/*        <Typography variant="caption">炎热3级</Typography>*/}
      {/*      </Box>*/}
      {/*    </Grid>*/}
      {/*    */}
      {/*    <Grid sx={{ width: '33.33%' }}>*/}
      {/*      <Box sx={{ display: 'flex', alignItems: 'center' }}>*/}
      {/*        <Box className="map-cell storm-1" sx={{ width: 20, height: 20, mr: 1 }}></Box>*/}
      {/*        <Typography variant="caption">风暴1级</Typography>*/}
      {/*      </Box>*/}
      {/*    </Grid>*/}
      {/*    <Grid sx={{ width: '33.33%' }}>*/}
      {/*      <Box sx={{ display: 'flex', alignItems: 'center' }}>*/}
      {/*        <Box className="map-cell storm-2" sx={{ width: 20, height: 20, mr: 1 }}></Box>*/}
      {/*        <Typography variant="caption">风暴2级</Typography>*/}
      {/*      </Box>*/}
      {/*    </Grid>*/}
      {/*    <Grid sx={{ width: '33.33%' }}>*/}
      {/*      <Box sx={{ display: 'flex', alignItems: 'center' }}>*/}
      {/*        <Box className="map-cell storm-3" sx={{ width: 20, height: 20, mr: 1 }}></Box>*/}
      {/*        <Typography variant="caption">风暴3级</Typography>*/}
      {/*      </Box>*/}
      {/*    </Grid>*/}
      {/*    */}
      {/*    <Grid sx={{ width: '33.33%' }}>*/}
      {/*      <Box sx={{ display: 'flex', alignItems: 'center' }}>*/}
      {/*        <Box className="map-cell ice-1" sx={{ width: 20, height: 20, mr: 1 }}></Box>*/}
      {/*        <Typography variant="caption">寒冰1级</Typography>*/}
      {/*      </Box>*/}
      {/*    </Grid>*/}
      {/*    <Grid sx={{ width: '33.33%' }}>*/}
      {/*      <Box sx={{ display: 'flex', alignItems: 'center' }}>*/}
      {/*        <Box className="map-cell ice-2" sx={{ width: 20, height: 20, mr: 1 }}></Box>*/}
      {/*        <Typography variant="caption">寒冰2级</Typography>*/}
      {/*      </Box>*/}
      {/*    </Grid>*/}
      {/*    <Grid sx={{ width: '33.33%' }}>*/}
      {/*      <Box sx={{ display: 'flex', alignItems: 'center' }}>*/}
      {/*        <Box className="map-cell ice-3" sx={{ width: 20, height: 20, mr: 1 }}></Box>*/}
      {/*        <Typography variant="caption">寒冰3级</Typography>*/}
      {/*      </Box>*/}
      {/*    </Grid>*/}
      {/*  </Grid>*/}
      {/*</Box>*/}
    </Box>
  );
};

export default MapPreview;
