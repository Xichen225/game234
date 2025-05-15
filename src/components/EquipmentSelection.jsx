import { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Chip
} from '@mui/material';
import MapPreview from './MapPreview';
import RefreshIcon from '@mui/icons-material/Refresh';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

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
        元素魔女之旅
        </Box>
        <Box sx={{ width: '50%', position: 'relative' }}>
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

      <Box sx={{ mb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
                  sx={{ width: 100, height: 170, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <img
                      src={`/game234/${item.resistance === 'fire' ? 'r' : item.resistance === 'storm' ? 'g' : 'b'}_e_1.png`}
                      alt={item.name}
                      style={{ width: '64px', height: '64px', display: 'block', margin: '0 auto 10px auto' }}
                    />
                    <Typography variant="caption" sx={{ fontSize: 13, lineHeight: 1.3, textAlign: 'center' }}>
                      抗性+{formatResistance(calculateTotalResistance(item))}
                    </Typography>
                    <Box sx={{ mt: 1.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(item.exp / item.expToNextLevel) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 0.6, fontSize: 12, textAlign: 'center' }}>
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
                  sx={{ width: 100, height: 170, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <img
                      src={`/game234/${item.resistance === 'fire' ? 'r' : item.resistance === 'storm' ? 'g' : 'b'}_e_2.png`}
                      alt={item.name}
                      style={{ width: '64px', height: '64px', display: 'block', margin: '0 auto 10px auto' }}
                    />
                    <Typography variant="caption" sx={{ fontSize: 13, lineHeight: 1.3, textAlign: 'center' }}>
                      抗性+{formatResistance(calculateTotalResistance(item))}
                    </Typography>
                    <Box sx={{ mt: 1.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(item.exp / item.expToNextLevel) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 0.6, fontSize: 12, textAlign: 'center' }}>
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
                  sx={{ width: 100, height: 170, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <img
                      src={`/game234/${item.resistance === 'fire' ? 'r' : item.resistance === 'storm' ? 'g' : 'b'}_e_3.png`}
                      alt={item.name}
                      style={{ width: '64px', height: '64px', display: 'block', margin: '0 auto 10px auto' }}
                    />
                    <Typography variant="caption" sx={{ fontSize: 13, lineHeight: 1.3, textAlign: 'center' }}>
                      抗性+{formatResistance(calculateTotalResistance(item))}
                    </Typography>
                    <Box sx={{ mt: 1.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(item.exp / item.expToNextLevel) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 0.6, fontSize: 12, textAlign: 'center' }}>
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
