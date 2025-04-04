import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Badge,
  Chip
} from '@mui/material';
import MapPreview from './MapPreview';
import RefreshIcon from '@mui/icons-material/Refresh';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// 装备数据
const equipmentData = {
  head: [
    { id: 'head1', name: '火焰头盔', resistance: 'fire', image: '🔥' },
    { id: 'head2', name: '风暴头盔', resistance: 'storm', image: '🌪️' },
    { id: 'head3', name: '寒冰头盔', resistance: 'ice', image: '❄️' }
  ],
  body: [
    { id: 'body1', name: '火焰护甲', resistance: 'fire', image: '🔥' },
    { id: 'body2', name: '风暴护甲', resistance: 'storm', image: '🌪️' },
    { id: 'body3', name: '寒冰护甲', resistance: 'ice', image: '❄️' }
  ],
  feet: [
    { id: 'feet1', name: '火焰靴子', resistance: 'fire', image: '🔥' },
    { id: 'feet2', name: '风暴靴子', resistance: 'storm', image: '🌪️' },
    { id: 'feet3', name: '寒冰靴子', resistance: 'ice', image: '❄️' }
  ]
};

// 随机生成地图
const generateMap = () => {
  const terrainTypes = ['fire', 'storm', 'ice'];
  const rows = 5;
  const cols = 6;
  const map = [];

  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      // 起点和终点没有地形效果
      if ((row === rows - 1 && col === 0) || (row === 0 && col === cols - 1)) {
        currentRow.push({
          type: 'normal',
          level: 0,
          isStart: row === rows - 1 && col === 0,
          isEnd: row === 0 && col === cols - 1
        });
      } else {
        const type = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
        const level = Math.floor(Math.random() * 3) + 1; // 1-3级
        currentRow.push({ type, level });
      }
    }
    map.push(currentRow);
  }

  return map;
};

const EquipmentSelection = ({
  selectedEquipment,
  setSelectedEquipment,
  equipmentDatabase,
  mapData,
  setMapData,
  startGame,
  resetData,
  selectedDifficulty,
  setSelectedDifficulty,
  refreshMap,
  achievements,
  difficultyLevels,
  playerHealth
}) => {
  // 初始化地图数据
  useEffect(() => {
    if (!mapData) {
      // 根据当前选择的难度生成地图
      refreshMap();
    }
  }, [mapData, setMapData, refreshMap]);

  // 难度更改时重新生成地图
  const handleDifficultyChange = (event, newDifficulty) => {
    if (newDifficulty !== null) {
      // 更新难度设置并生成新地图
      setSelectedDifficulty(newDifficulty);
      // 难度切换时地图会自动根据难度规则更新
    }
  };

  // 选择装备
  const selectEquipment = (slot, item) => {
    setSelectedEquipment({
      ...selectedEquipment,
      [slot]: item
    });
  };

  // 计算总抗性值（基本值 + 等级加成）
  const calculateTotalResistance = (item) => {
    if (!item) return 0;
    // 每级提供基础值的10%额外加成
    const levelBonus = item.baseValue * 0.1 * (item.level - 1);
    return item.baseValue + levelBonus;
  };

  // 格式化抗性值，保留一位小数
  const formatResistance = (value) => {
    return Math.round(value * 10) / 10;
  };

  // 检查是否所有装备都已选择
  const allEquipmentSelected = () => {
    return selectedEquipment.head && selectedEquipment.body && selectedEquipment.feet;
  };

  // 获取抗性类型的中文名称
  const getResistanceText = (type) => {
    return type === 'fire' ? '炎热' : type === 'storm' ? '风暴' : '寒冰';
  };

  // 获取难度对应的颜色
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case difficultyLevels.EASY:
        return '#4caf50'; // 绿色
      case difficultyLevels.NORMAL:
        return '#2196f3'; // 蓝色
      case difficultyLevels.HARD:
        return '#ff9800'; // 橙色
      case difficultyLevels.EXPERT:
        return '#f44336'; // 红色
      default:
        return '#757575'; // 灰色
    }
  };

  // 获取难度显示名称
  const getDifficultyName = (difficulty) => {
    switch (difficulty) {
      case difficultyLevels.EASY:
        return '简单';
      case difficultyLevels.NORMAL:
        return '中等';
      case difficultyLevels.HARD:
        return '困难';
      case difficultyLevels.EXPERT:
        return '高难';
      default:
        return difficulty;
    }
  };

  return (
    <Box>


      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center',justifyContent: 'space-between' }}>
        <Box sx={{fontSize:24,fontWeight:'bold'}}>
          Game Title
        </Box>
        <Box sx={{ width: '70%', position: 'relative' }}>
          <LinearProgress
            variant="determinate"
            value={playerHealth / 10}
            color={playerHealth > 500 ? 'success' : playerHealth > 200 ? 'warning' : 'error'}
            sx={{ height: 24, borderRadius: 2 }}
          />
          <Typography
            variant="body1"
            sx={{
              position: 'absolute',
              width: '100%',
              textAlign: 'center',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
            }}
          >
            {Math.round(playerHealth/10)}%
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <ToggleButtonGroup
            value={selectedDifficulty}
            exclusive
            onChange={handleDifficultyChange}
            aria-label="难度选择"
            size="small"
          >
            <ToggleButton
              value={difficultyLevels.EASY}
              aria-label="简单"
              sx={{
                color: getDifficultyColor(difficultyLevels.EASY),
                borderColor: getDifficultyColor(difficultyLevels.EASY),
                '&.Mui-selected': { backgroundColor: `${getDifficultyColor(difficultyLevels.EASY)}30` }
              }}
            >
              简单
            </ToggleButton>

            <ToggleButton
              value={difficultyLevels.NORMAL}
              aria-label="中等"
              sx={{
                color: getDifficultyColor(difficultyLevels.NORMAL),
                borderColor: getDifficultyColor(difficultyLevels.NORMAL),
                '&.Mui-selected': { backgroundColor: `${getDifficultyColor(difficultyLevels.NORMAL)}30` }
              }}
            >
              中等
            </ToggleButton>

            <ToggleButton
              value={difficultyLevels.HARD}
              aria-label="困难"
              sx={{
                color: getDifficultyColor(difficultyLevels.HARD),
                borderColor: getDifficultyColor(difficultyLevels.HARD),
                '&.Mui-selected': { backgroundColor: `${getDifficultyColor(difficultyLevels.HARD)}30` }
              }}
            >
              困难
            </ToggleButton>

            <ToggleButton
              value={difficultyLevels.EXPERT}
              aria-label="高难"
              sx={{
                color: getDifficultyColor(difficultyLevels.EXPERT),
                borderColor: getDifficultyColor(difficultyLevels.EXPERT),
                '&.Mui-selected': { backgroundColor: `${getDifficultyColor(difficultyLevels.EXPERT)}30` }
              }}
            >
              高难
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!allEquipmentSelected()}
              onClick={startGame}
              sx={{ mr: 2 }}
            >
              开始游戏
            </Button>
            <Button
              variant="outlined"
              onClick={refreshMap}
              disabled={selectedDifficulty === difficultyLevels.HARD || selectedDifficulty === difficultyLevels.EXPERT}
            >
              换一张图
            </Button>
          </Box>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end',mt:1 }}>
            {Object.entries(achievements).map(([difficulty, count]) => (
              <Chip
                key={difficulty}
                icon={count > 0 ? <EmojiEventsIcon /> : null}
                label={`${getDifficultyName(difficulty)}${count > 0 ? ` x${count}` : ''}`}
                sx={{
                  color: 'white',
                  backgroundColor: count > 0 ? getDifficultyColor(difficulty) : 'rgba(0, 0, 0, 0.12)',
                  opacity: count > 0 ? 1 : 0.5,
                  fontWeight: 'bold',
                  '& .MuiChip-icon': {
                    color: 'gold'
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Tooltip title="重置所有数据（装备和勋章）">
            <IconButton onClick={resetData} color="secondary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box className="selection-container">
        <Paper className="equipment-section" elevation={3}>
          <div className="equipment-slot">
            <div className="equipment-options">
              {equipmentDatabase.head.map((item) => (
                <Card
                  key={item.id}
                  className={`option-card ${selectedEquipment.head?.id === item.id ? 'selected' : ''}`}
                  onClick={() => selectEquipment('head', item)}
                  sx={{ width: 100, minHeight: 120 }}
                >
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {item.name} Lv.{item.level}
                    </Typography>
                    <Typography variant="caption">
                      抗性+{formatResistance(calculateTotalResistance(item))}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(item.exp / item.expToNextLevel) * 100}
                        sx={{ height: 5, borderRadius: 5 }}
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        {item.exp}/{item.expToNextLevel}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Divider sx={{ my: 2 }} />

          <div className="equipment-slot">
            <div className="equipment-options">
              {equipmentDatabase.body.map((item) => (
                <Card
                  key={item.id}
                  className={`option-card ${selectedEquipment.body?.id === item.id ? 'selected' : ''}`}
                  onClick={() => selectEquipment('body', item)}
                  sx={{ width: 100, minHeight: 120 }}
                >
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {item.name} Lv.{item.level}
                    </Typography>
                    <Typography variant="caption">
                      抗性+{formatResistance(calculateTotalResistance(item))}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(item.exp / item.expToNextLevel) * 100}
                        sx={{ height: 5, borderRadius: 5 }}
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        {item.exp}/{item.expToNextLevel}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Divider sx={{ my: 2 }} />

          <div className="equipment-slot">
            <div className="equipment-options">
              {equipmentDatabase.feet.map((item) => (
                <Card
                  key={item.id}
                  className={`option-card ${selectedEquipment.feet?.id === item.id ? 'selected' : ''}`}
                  onClick={() => selectEquipment('feet', item)}
                  sx={{ width: 100, minHeight: 120 }}
                >
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {item.name} Lv.{item.level}
                    </Typography>
                    <Typography variant="caption">
                      抗性+{formatResistance(calculateTotalResistance(item))}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(item.exp / item.expToNextLevel) * 100}
                        sx={{ height: 5, borderRadius: 5 }}
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        {item.exp}/{item.expToNextLevel}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Paper>

        <Paper className="map-preview-section" elevation={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              地图预览
            </Typography>
            <Typography variant="subtitle1" sx={{
              color: getDifficultyColor(selectedDifficulty),
              fontWeight: 'bold',
            }}>
              难度: {selectedDifficulty}
            </Typography>
          </Box>

          {mapData && <MapPreview mapData={mapData} />}
        </Paper>
      </Box>
    </Box>
  );
};

export default EquipmentSelection;
